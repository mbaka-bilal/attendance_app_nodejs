const express = require("express");
const attendanceController = require("../controller/attendance_controller");

const attendanceRoute = express.Router();

attendanceRoute.route("/fetchAttendance").get(attendanceController.fetchAttendance);
attendanceRoute.route("/record").post(attendanceController.updateAttendance);


module.exports = attendanceRoute;