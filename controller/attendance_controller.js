const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;
const { format, parseJSON } = require("date-fns");


//TODO add a register so we fetch student id from that list based on the students name

const updateAttendance = async (request, response) => {
    /*

    valid request

        "studentId": U20,
        "firstName": name,
        "lastName": name,
        "courseId": sta120,

    */

    if (request.body.studentId == null || request.body.firstName == null ||
        request.body.lastName == null ||
        request.body.courseId == null) {
        response.status(400).json({
            "status": false,
            "message": "Invalid request body",
        });
        return;
    }


    const date = format(new Date(), "yyyyMMdd");
    const fileName = `${request.body.courseId}_${date}.json`;
    const filePath = path.join(__dirname, "..", "model", fileName);
    var studentExists = false;

    try {
        if (!fs.existsSync(filePath)) {
            await fsPromises.writeFile(filePath, JSON.stringify([]));
        }

        //check if student exists
        const users = JSON.parse(await fsPromises.readFile(path.join(__dirname, "..", "model", "users.json"), "utf-8"));

        for (i = 0; i < users.length; i++) {
            const userMap = new Map(Object.entries(users[i]));
            if (request.body.studentId == userMap.get("studentId")) {
                if ((request.body.firstName.toLowerCase() != userMap.get("firstName")) || (request.body.lastName.toLowerCase() != userMap.get("lastName"))) {
                    response.status(400).json({
                        "status": false,
                        "message": "firstname or lastname does not match what we have on record",
                    });
                    return;
                } else {
                    studentExists = true;
                    break;
                }
            }
        }

        if (studentExists) {
            const data = await fsPromises.readFile(filePath, 'utf-8');
            const attendanceList = JSON.parse(data);

            //Check if user has recorded their attendance already
            for (var i = 0; i < attendanceList.length; i++) {
                var attendanceMap = new Map(Object.entries(attendanceList[i]));

                // console.log(attendanceMap);
                // console.log(`student id is ${attendanceMap.get("studentId")}`);
                // console.log(`student id from post ${request.body}`);

                if (request.body.studentId == attendanceMap.get("studentId")) {
                    response.status(400).json({
                        "status": false,
                        "message": "User has already recorded their attendance"
                    });
                    return;
                }
            }


            //Add attendance to list    
            attendanceList.push(
                {

                    "studentId": request.body.studentId,
                    "studentName": `${request.body.lastName} ${request.body.firstName}`,
                    "loggedTime": new Date().toString(),
                }
            );

            //update file.
            await fsPromises.writeFile(filePath, JSON.stringify(attendanceList)).then((e) => {
                response.status(200).json({
                    "status": true,
                    "message": "Attendance recorded successfully",
                });
            });
        } else {
            response.status(400).json({
                "status": false,
                "message": "Student data not found, kindly register first",
            })
        }
    } catch (e) {
        console.log(`${e}`)
        response.status(400).json({
            "status": false,
            "message": `${e}`,
        });
    }
}

const fetchAttendance = async (req, res) => {
    try {
        /* valid data 
         {
            "courseId": ,
            "date": , //this is ${year}${month}${date} 20231211
         }

        */

        if (req.body.courseId == null || req.body.date == null) {
            res.status(400).json({ "status": false, "message": "Invalid request body" });
            return;
        }

        const fileName = `${req.body.courseId}_${req.body.date}.json`;

        const filePath = path.join(__dirname, "..", "model", fileName);

        //Check if file exists
        if (!fs.existsSync(filePath)) {
            res.status(201).json({ "status": false, "message": "Attendance does not exist" });
            return;
        }

        //return the file content to the client
        const attendance = JSON.parse(await fsPromises.readFile(filePath));
        res.status(200).json({
            "status": true,
            "data": attendance,
        });

    } catch (e) {
        res.status(400).json({
            "status": false,
            "data": e
        });
    }

}

module.exports = { updateAttendance, fetchAttendance };