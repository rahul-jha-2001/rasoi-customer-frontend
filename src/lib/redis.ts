// lib/redis.ts
import Redis from "ioredis";

const { REDIS_HOST,REDIS_PORT,REDIS_PASSWORD } = process.env;

const redis = new Redis({
    host: REDIS_HOST,  // or your Docker container IP (e.g., "host.docker.internal")
    port: REDIS_PORT ? parseInt(REDIS_PORT, 10) : undefined,
    password: REDIS_PASSWORD, // remove this if no password
  });  

export default redis;
