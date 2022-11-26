const express = require("express");

const apiRouter = express.Router();

console.log("hi");

module.exports = () =>
    apiRouter.get("/justSay", (req, res) => res.send("Yes I can read"));
