const Queue = require('bull');
const fs = require('fs');
const path = require('path');

// Configure the Bull queue with Redis
const taskQueue = new Queue('taskQueue', {
    redis: {
        host: 'redis', // Change to 'localhost' if running locally
        port: 6379,
    }
});

// Error handling for Bull queue
taskQueue.on('error', (err) => {
    console.error('Error with Bull queue:', err);
});

// Function to queue a task with a delay
function queueTask(user_id, task) {
    console.log(`Queuing task for user: ${user_id} with delay of 1000ms`);
    taskQueue.add({ user_id, task }, { delay: 1000 }); // Delay of 1000ms
}

// Process the task from the queue
taskQueue.process(async (job) => {
    const { user_id, task } = job.data;
    console.log(`Processing task for user: ${user_id}`);
    await processTask(user_id, task);
});


async function processTask(user_id, task) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 seconds
    const logMessage = `${user_id} - task completed at ${new Date().toISOString()}`;
    console.log(logMessage);
    logTaskCompletion(logMessage);
}


function logTaskCompletion(message) {
    const logDir = path.join(__dirname, 'logs'); 
    const logFilePath = path.join(logDir, 'task_log.txt'); 

    // Check if 'logs' directory exists, create it if not
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }

    // Append the log message to the file asynchronously
    fs.appendFile(logFilePath, message + '\n', (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
}


module.exports = { queueTask };
