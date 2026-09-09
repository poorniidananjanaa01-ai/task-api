const express = require('express');
const swaggerUi = require('swagger-ui-express');
const Database = require('better-sqlite3');

const app = express();
app.use(express.json());

const db = new Database('tasks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER NOT NULL DEFAULT 0
  )
`);

const count = db.prepare('SELECT COUNT(*) AS count FROM tasks').get().count;
if (count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Buy groceries', 0);
  insert.run('Read Express docs', 0);
  insert.run('Build CRUD API with SQLite', 1);
}

const toTask = row => ({ ...row, done: Boolean(row.done) });

// Stage 5: Swagger UI OpenAPI Configuration
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Task API',
    version: '1.0.0',
    description: 'A SQLite-backed CRUD API for managing tasks'
  },
  paths: {
    '/': {
      get: {
        summary: 'Root endpoint',
        responses: {
          200: { description: 'API info' }
        }
      }
    },
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          200: { description: 'Server is healthy' }
        }
      }
    },
    '/tasks': {
      get: {
        summary: 'Get all tasks',
        responses: {
          200: { description: 'Returns list of all tasks' }
        }
      },
      post: {
        summary: 'Create a new task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Buy milk' }
                },
                required: ['title']
              }
            }
          }
        },
        responses: {
          201: { description: 'Task created successfully' },
          400: { description: 'Bad Request - Title is required' }
        }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get task by ID',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'Task found' },
          404: { description: 'Task not found' }
        }
      },
      put: {
        summary: 'Update a task',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', example: 'Buy almond milk' },
                  done: { type: 'boolean', example: true }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Task updated successfully' },
          404: { description: 'Task not found' }
        }
      },
      delete: {
        summary: 'Delete a task',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          204: { description: 'Task deleted (No Content)' },
          404: { description: 'Task not found' }
        }
      }
    }
  }
};

// Mount Swagger UI at /docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Stage 0: Root endpoint
app.get('/', (req, res) => {
  res.json({ name: "Task API", version: "1.0", endpoints: ["/tasks"] });
});

// Stage 1: Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// Stage 2: Read All Tasks
app.get('/tasks', (req, res) => {
  res.json(db.prepare('SELECT id, title, done FROM tasks ORDER BY id').all().map(toTask));
});

// Stage 2: Read Single Task
app.get('/tasks/:id', (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  const task = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  res.json(toTask(task));
});

// Stage 3: Create Task with Validation
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ error: "Title is required" });
  }
  const result = db.prepare('INSERT INTO tasks (title, done) VALUES (?, 0)').run(title.trim());
  const newTask = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(toTask(newTask));
});

// Stage 4: Update Task
app.put('/tasks/:id', (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  const task = db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  const title = req.body.title === undefined ? task.title : req.body.title;
  const done = req.body.done === undefined ? Boolean(task.done) : req.body.done;
  if (typeof title !== 'string' || title.trim() === '' || typeof done !== 'boolean') {
    return res.status(400).json({ error: 'Title must be a non-empty string and done must be a boolean' });
  }

  db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(title.trim(), done ? 1 : 0, taskId);
  res.json(toTask(db.prepare('SELECT id, title, done FROM tasks WHERE id = ?').get(taskId)));
});

// Stage 4: Delete Task
app.delete('/tasks/:id', (req, res) => {
  const taskId = Number.parseInt(req.params.id, 10);
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
  if (result.changes === 0) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  res.status(204).send();
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});