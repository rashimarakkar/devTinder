const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validateSignupData = require("../utils/validation");

authRouter.post("/signUp", async (req, res) => {
    try {
        validateSignupData(req);
        const { firstName, lastName, photoUrl, password, email, age, gender } =
            req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,
            lastName,
            photoUrl,
            password: passwordHash,
            email,
            age,
            gender,
        });
        await user.save();
        res.send("User added successfully");
    } catch (error) {
        console.log(error.message);
        res.status(400).send(error.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error("user not found");
        }

        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            const token = await user.getJwt();
            res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
            res.send("login is success");
        } else {
            throw new Error("Invalid credentials");
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = authRouter;
