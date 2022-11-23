const bunyan = require("bunyan");

const logger = bunyan.createLogger({
    name: process.env.APPNAME,
    env: process.env.NODE_ENV,
    serializers: bunyan.stdSerializers,
    src: true,
});

module.exports = logger;
