const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const compress = require("compression");
const bodyParser = require("body-parser");
const timeout = require('connect-timeout')


//const apiRoutes = require("../api");

module.exports = () => {
    const app = express();
    app.use(timeout(process.env.REQ_TIMEOUT));
    app.use(
        compress({
            filter(req, res) {
                return /json/.test(res.getHeader("Content-Type"));
            },
            level: 9,
        })
    );

    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "local") {
        app.use(morgan("dev"));
    }

    app.use(
        bodyParser.urlencoded({
            extended: true,
        })
    );
    app.use(bodyParser.json({}));

    // Use helmet to secure Express headers
    app.use(helmet());
    app.disable("x-powered-by");

    app.use(
        cors({
            origin: true,
            credentials: true,
        })
    );
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, PATCH");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return next();
    });

    // app.use("/", apiRoutes());

    return app;
};
