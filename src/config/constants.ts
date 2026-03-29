export const CONFIG = {
    PORT: process.env.PORT || 8888,
    REDIS: {
        HOST: process.env.REDIS_HOST || 'localhost',
        PORT: Number(process.env.REDIS_PORT) || 6379,
        DB: Number(process.env.REDIS_DB) || 1,
    },
    URL: {
        MAX_TTL: Number(process.env.URL_TTL) || 86400,
        BASE_URL: process.env.BASE_URL || 'http://localhost:8888',
    }
};