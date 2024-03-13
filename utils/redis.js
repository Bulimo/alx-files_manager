import redis from 'redis';

const { promisify } = require('util');

class RedisClient {
  constructor() {
    // Create a Redis client
    this.client = redis.createClient();
    // Promisify Redis functions for async/await support
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setExAsync = promisify(this.client.setex).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    // Handle errors
    this.client.on('error', (err) => console.log(`Redis client not connected to the server: ${err}`));
  }

  isAlive() {
    // Check if the connection to Redis is successful
    return this.client.connected;
  }

  async get(key) {
    try {
      // Retrieve the value for the given key
      const value = await this.getAsync(key);
      return value;
    } catch (error) {
      console.error(`Redis Get Error: ${error}`);
      throw error;
    }
  }

  async set(key, value, duration) {
    try {
      // Set the value for the given key with expiration
      this.setExAsync(key, duration, value);
    } catch (error) {
      console.error(`Redis Set Error: ${error}`);
      throw error;
    }
  }

  async del(key) {
    try {
      // Delete the value for the given key
      await this.delAsync(key);
    } catch (error) {
      console.error(`Redis Delete Error: ${error}`);
      throw error;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
