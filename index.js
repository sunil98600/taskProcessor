const express = require('express');
const rateLimit = require('express-rate-limit'); // Rate limiter
const cluster = require('cluster');
const { queueTask } = require('./taskProcessor');
const PORT = 8000;
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json()); 

// Rate limiter configuration
const userRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // allows only 20 requests per user
    keyGenerator: (req) => req.body.userid, // Use userid (ensure this matches your input)
    message: 'Rate limit exceeded. Your task has been queued.', // If limit is exceeded
    handler: (req, res, next) => {
        queueTask(req.body.user_id, req.body.task);
        res.status(429).send('Task queued due to rate limit.');
    }
});

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    // Fork worker processes
    for (let i = 0; i < 2; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} exited`);
        // Fork a new worker if one dies
        cluster.fork();
    });

} else {

    // POST route to handle task submission
    app.post("/",userRateLimiter, (req, res) => {
        const { user_id, task } = req.body;
        console.log(user_id, task);
        queueTask(user_id, task);
        res.send("task submitted");
    });

    // Start the server in worker processes
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} started and listening on port ${PORT}`);
    });
}
