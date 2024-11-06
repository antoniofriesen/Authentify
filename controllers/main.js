const CustomAPIError = require("../errors/customError.js");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        throw new CustomAPIError("Please provide email and password!", 400);
    };

    // just for demo, since we are not connecting to DB yet.
    const id = new Date().getDate();

    // try to keep payload small, better experience for the user
    // in production use, long and complex string values (JWT_SECRET)
    const token = jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: "30d" });

    res.status(200).json({ msg: "user created", token });
};

const dashboard = async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new CustomAPIError("No token provided!", 401);
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const luckyNumber = Math.floor(Math.random() * 100);
        res.status(200).json({
            msg: `Hello, ${decoded.username}`,
            secret: `Here is your authorized data, your lucky number is ${luckyNumber}`
        });
    } catch (error) {
        throw new CustomAPIError("Not authorized to access this route!", 401);
    }
};


module.exports = {
    login,
    dashboard
};