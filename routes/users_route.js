const express = require("express");
const users = require("../controller/user_controller");

const usersRoute = express.Router();

usersRoute.route("/register").post(users.register);
usersRoute.route("/getUsers").get(users.users);


module.exports = usersRoute;
