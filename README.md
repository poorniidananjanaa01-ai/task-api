# Task API

A simple in-memory CRUD API for managing tasks, built with Express.js and Node.js.

## Features

- ✅ **Read Tasks** - Get all tasks or a specific task by ID
- ✅ **Create Tasks** - Add new tasks with validation
- ✅ **Update Tasks** - Modify task title and completion status
- ✅ **Delete Tasks** - Remove tasks from the list
- ✅ **Health Check** - Monitor server status
- ✅ **API Documentation** - Interactive Swagger UI

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Swagger UI** - API documentation

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

- `GET /` - Root endpoint (API info)
- `GET /health` - Health check
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Documentation

Visit `http://localhost:3000/docs` for interactive Swagger UI documentation.

## Example Request

```bash
curl http://localhost:3000/tasks
```

## License

MIT
