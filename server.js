const express = require('express');
const app = express();

app.use(express.json());

// Stage 2: In-memory task list
let tasks = [
  { id: 1, title: "Learn HTTP", done: true },
  { id: 2, title: "Build CRUD API", done: false },
  { id: 3, title: "Publish to GitHub", done: false }
];

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
  res.json(tasks);
});

// Stage 2: Read Single Task
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  res.json(task);
});

// Stage 3: Create Task with Validation
app.post('/tasks', (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }
  const newTask = {
    id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
    title: title,
    done: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Stage 4: Update Task
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  
  if (req.body.title !== undefined) task.title = req.body.title;
  if (req.body.done !== undefined) task.done = req.body.done;
  
  res.json(task);
});

// Stage 4: Delete Task
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }
  tasks.splice(index, 1);
  res.status(204).send();
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
