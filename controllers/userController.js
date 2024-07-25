const userModel = require("../models/userModel");

// login user
const loginController = async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await userModel.findOne({ userId, password, verified: true });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
//register
const registerController = async (req, res) => {
    try {
        const newUser = new userModel({ ...req.body, verified: true });
        await newUser.save();
        res.status(201).send("New user added Successfully!");
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error in registering user",
            error: error.message,
        });
    }
};

module.exports = {
    loginController,
    registerController,
};