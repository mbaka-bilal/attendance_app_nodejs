const logEvents = require("./log_events");

const logRequests = async (req, res, next) => {
    logEvents("request_log.txt", `${req.method} ${req.headers.origin}\t${req.url}\n`);
    next();
}

module.exports = logRequests;