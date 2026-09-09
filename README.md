# Task API (SQLite Persistence)

A database-backed RESTful CRUD API built with Node.js, Express, and SQLite (`better-sqlite3`).

## Why SQLite?
SQLite was chosen because it is zero-configuration, serverless, and stores all data locally in a single file (`tasks.db`). This guarantees data persistence across server restarts without complex setup.

## Features
- ✅ **Read Tasks** - Get all tasks or a specific task by ID
- ✅ **Create Tasks** - Add new tasks with title validation
- ✅ **Update Tasks** - Modify task title and completion status
- ✅ **Delete Tasks** - Remove tasks permanently
- ✅ **Health Check** - Monitor server health status
- ✅ **API Documentation** - Interactive Swagger UI integration

## Tech Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite (`better-sqlite3`)** - Persistent file database
- **Swagger UI** - Interactive documentation

## How to Run
1. Clone the repository:
   ```bash
   git clone [https://github.com/poorniidananjanaa01-ai/task-api.git](https://github.com/poorniidananjanaa01-ai/task-api.git)
   cd task-api