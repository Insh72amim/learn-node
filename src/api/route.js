const express = require("express");

const apiRouter = express.Router();
const read = require("./readData/routes");

module.exports = () =>
    apiRouter
        .get("/sayHello", (req, res) => res.send("Health is good!!!"))
        .use("/read", read);
