# # Task Processing System with Rate Limiting, Clustering, and Queue Management

This project is a scalable task processing system built using Redis, Bull, Express.js, and clustering to efficiently handle tasks. It includes features like rate-limiting, task queuing with delayed execution, and CPU load balancing through clustering.

## Features

- **Task Queuing**: Asynchronous task handling using Redis and Bull for queueing.
- **Rate Limiting**: Limits the number of requests per user per minute. Exceeded requests are automatically queued.
- **Clustering**: Utilizes Node.js clustering to handle multiple requests using multi-core processing.
- **Logging**: Logs task completion details into a file for easy tracking.

## Prerequisites

- **Node.js** (v12+)
- **Redis** (for task queuing)
- **Bull** (for managing job queues)
- **express-rate-limit** (for rate-limiting user requests)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/task-processing-system.git
    cd task-processing-system
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start Redis server:

    ```bash
    redis-server
    ```

4. Run the application:

    ```bash
    npm start
    ```

## How It Works

### 1. Task Queueing
Tasks are queued using Redis and Bull. When a user submits a task, it is added to a Bull queue, which processes tasks asynchronously. If a rate limit is hit, tasks are delayed and executed when the rate limit allows.

### 2. Rate Limiting
The system uses `express-rate-limit` to limit user requests to 20 per minute. If a user exceeds this limit, their task is automatically queued for processing after a delay.

### 3. Clustering
The app uses Node.js's `cluster` module to run multiple worker processes. This enables efficient load balancing by utilizing all available CPU cores.

## API Endpoints

- **POST /:** Submits a task. The request body should include `user_id` and `task`.

    Example request body:
    ```json
    {
      "user_id": "123",
      "task": "Sample Task"
    }
    ```

## Project Structure

```bash
├── index.js           # Main application entry point with Express.js and clustering
├── taskProcessor.js   # Task processing logic with Bull and Redis
├── logs/              # Directory to store task completion logs
└── README.md          # This README file
```

## Project Structure
Task completion logs are stored in the logs/task_log.txt file. A sample log entry:
```bash
123 - task completed at 2024-10-01T20:18:13.582Z
```

## Dependencies

- [express](https://www.npmjs.com/package/express)
- [bull](https://www.npmjs.com/package/bull)
- [redis](https://redis.io/)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)


