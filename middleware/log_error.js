const logEvents = require("./log_events");


const logError = async (error, req, res, next) => {

    logEvents("error_logs.txt", `${req.method} ${req.headers.origin}\t${req.url} \t${error.message}\n`);

    res.status(500).send(error.message);
}

module.exports = logError;