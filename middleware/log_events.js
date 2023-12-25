const fs = require("fs");
const fsPromises = require("fs").promises;
const { v4: uuid } = require("uuid");
const path = require("path");
const { format } = require("date-fns");

const logEvents = async (filename, message) => {
    const date = format(new Date(), "yyyy/MM/dd\tHH:mm:ss");

    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
        await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(path.join(__dirname, "..", "logs", filename), `${date}\t ${uuid()}\t ${message}`);
}

module.exports = logEvents;