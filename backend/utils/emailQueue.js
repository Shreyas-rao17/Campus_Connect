const Queue = require('bull');
const emailQueue = new Queue('email-queue', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

emailQueue.on('completed', (job) => {
  console.log(`✅ Email job ${job.id} completed`);
});

emailQueue.on('failed', (job, error) => {
  console.error(`❌ Email job ${job.id} failed:`, error);
});

module.exports = emailQueue;
