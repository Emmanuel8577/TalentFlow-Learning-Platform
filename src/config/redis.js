const { createClient } = require('redis');
require('dotenv').config();

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Using an async function to connect
const connectRedis = async () => {
  try {
    await client.connect();
    console.log('Connected to Upstash Redis successfully!');
  } catch (err) {
    console.error('Redis connection failed:', err);
  }
};

connectRedis();

module.exports = client;