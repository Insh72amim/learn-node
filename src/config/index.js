module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.MONGO_URI || "MONGO_URI",
    redisUri: process.env.REDIS_URI || "REDIS_URI",
    redisPort: process.env.REDIS_PORT || "REDIS_PORT",
};
