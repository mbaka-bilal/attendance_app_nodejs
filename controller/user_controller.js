const path = require("path");
const fs = require("fs");
const fsPromises = require('fs').promises;

const register = async (request, response) => {
    /*
        {
            "firstName": jhon,
            "lastName": doe,
            "studentId": U2019/555223232
        }
    */

    try {
        if (request.body.firstName == null || request.body.lastName == null) {
            response.status(400).json({ "status": false, "message": "Invalid body data" });
            return;
        }


        const filePath = path.join(__dirname, "..", "model", "users.json");

        if (!fs.existsSync(filePath)) {
            await fsPromises.writeFile(filePath, JSON.stringify([]));
        }

        //get all contents of the file
        const users = JSON.parse(await fsPromises.readFile(filePath, 'utf-8'));

        //Check if user already exists
        for (var i = 0; i < users.length; i++) {
            var userMap = new Map(Object.entries(users[i]));

            console.log(users[i]);

            if (`${request.body.studentId}` == userMap.get("studentId")) {
                response.status(400).json({
                    "status": false,
                    "message": "User already exists"
                });
                return;
            }
        }



        users.push({
            "studentId": request.body.studentId,
            "firstName": request.body.firstName,
            "lastName": request.body.lastName,

        });



        await fsPromises.writeFile(filePath, JSON.stringify(users)).then(() => {
            response.status(200).json({
                "status": true,
                "message": "registration successfull"
            });
        });
    } catch (e) {
        console.log(`error while registering student ${e}`);
        response.status(400).json({
            "status": false,
            "message": `error ${e}`
        });
    }

}

const users = async (request, response) => {
    try {
        const filePath = path.join(__dirname, "..", "model", "users.json");

        if (!fs.existsSync(filePath)) {
            response.status(200).json({
                "status": true,
                "message": "No users yet",
                "data": []
            });
        }

        const users = JSON.parse(await fsPromises.readFile(filePath, 'utf-8'));

        response.status(200).json({
            "status": true,
            "message": "request successfull",
            "data": users
        });

    } catch (e) {
        console.log(`Error fetching users ${e}`);
        response.status(400).json({
            "status": false,
            "message": `error fetching users ${e}`
        });
    }

}

module.exports = { register, users };