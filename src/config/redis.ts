import { Redis } from "ioredis";
import { CONFIG } from "./constants";

let redisClient: Redis;

const connectRedis = (): Redis => {
    try {
        const client = new Redis({
            host: CONFIG.REDIS.HOST,
            port: CONFIG.REDIS.PORT,
            db: CONFIG.REDIS.DB,
        });

        client.on('connect', () => console.info("Redis Connected!!"));
        client.on('error', (err) => console.error("Redis Error", err));

        return client;
    } catch (error) {
        console.error("Redis Connection Failed", error);
        process.exit(1);
    }
};

redisClient = connectRedis();

export default redisClient;