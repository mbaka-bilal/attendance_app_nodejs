const cors = require("cors");
const express = require("express");
const logRequests = require("./middleware/log_request");
const logError = require("./middleware/log_error");
const corsOptions = require("./controller/cors");
const attendanceRoute = require("./routes/attendance_route");
const usersRoute = require("./routes/users_route");

const app = express();
const port = process.env.port || 3500;

//Log all requests
app.use(logRequests);

//cors
app.use(cors(corsOptions));

//built in middleware to handle urlencoded form
app.use(express.urlencoded({ extended: false }));

//built in middleware to handle json
app.use(express.json());

//routes
app.use(attendanceRoute);
app.use(usersRoute);

//handle all unhandled routes
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("json")) {
        res.json({ "error": `${req.url} endpoint does not exist` });
    } else if (req.accepts("html")) {
        //Send 404 file
        res.sendFile()
    } else {
        res.type("txt").send("404 Not Found");
    }
});

//Log all errors
app.use(logError);

app.listen(port, () => console.log(`server is running on port ${port}`));


