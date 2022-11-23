require("dotenv").config();

const mongoose = require("mongoose");
const http = require("http");

const config = require('./config');
//const logger = require("../src/lib/logger");

mongoose.Promise = global.Promise;

const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(config.db, mongooseOptions);
const db = mongoose.connection;

//db.on("error", (err) => logger.error("Mongoose error", err));

db.once("open", async () => {
    mongoose.db = mongoose.createConnection(config.db, mongooseOptions);

    const setupExpress = require("./config/express.js");

    const app = setupExpress();
    http.createServer(app).listen(config.port);

    console.log("Connected to db", config.db);
    console.log("Application started on port", config.port);
});
