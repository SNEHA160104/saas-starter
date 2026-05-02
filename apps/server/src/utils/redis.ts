import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (err) => {
  console.error('Redis client error:', err);
});

export const addToBlacklist = async (token: string, expiresIn: number) => {
  await redisClient.set(`bl_${token}`, 'true', 'EX', expiresIn);
};

export const isBlacklisted = async (token: string) => {
  const result = await redisClient.get(`bl_${token}`);
  return result === 'true';
};

export default redisClient;
