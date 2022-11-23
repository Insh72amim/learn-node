class HttpError extends Error {}

class BadRequestError extends HttpError {
    constructor(message, paths) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Invalid request";
        this.status = 400;
        this.paths = paths;
    }
}

class UnauthorizedError extends HttpError {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Unauthorized User";
        this.status = 401;
    }
}

class NotFoundError extends HttpError {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Not found";
        this.status = 404;
    }
}

class RouteNotFoundError extends HttpError {
    constructor(message) {
        super();
        this.name = this.constructor.name;
        this.message = message || "Route Not found";
        this.status = 404;
    }
}

const defaultResponse = {
    message: "Something went wrong on the server",
    status: 500,
};

function getErrorMessage(err) {
    if ((err.code && err.code === 11000) || err.code === 11001) {
        return {
            message: "Unique field already exists",
            status: 400,
        };
    }

    if (err instanceof HttpError) {
        return {
            message: err.message,
            stack: err.stack,
            status: err.status,
            paths: err.paths,
        };
    }

    // This catches when body-parser encounters bad JSON user data in a request
    if (err.stack.match(/^SyntaxError:.+in JSON(.|\n)*node_modules\/body-parser/)) {
        return {
            message:
                process.env.NODE_ENV === "production"
                    ? "The data received by the server is not properly formatted. Try refreshing your browser."
                    : `Bad JSON in HTTP request. ${err.message}:  ${err.body}`,
            status: 400,
        };
    }

    // This catches error from MongoDB
    if (err.name === "MongoError") {
        return {
            message: `MongoError: ${err.message}`,
            status: 500,
        };
    }

    //handling axio error
    if (err.isAxiosError) {
        return {
            message: err.response.statusText,
            status: err.response.status,
        };
    }

    defaultResponse.message = (err && err.message) || defaultResponse.message;
    defaultResponse.stack = err && err.stack;
    return defaultResponse;
}

module.exports = {
    HttpError,
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    RouteNotFoundError,
    getErrorMessage,
};
