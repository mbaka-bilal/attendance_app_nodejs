const whiteList = [
    "http://127.0.0.1:3500",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;