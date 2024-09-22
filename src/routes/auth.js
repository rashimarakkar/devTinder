const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

authRouter.post("/signUp", async (req, res) => {
  try {
    console.log("inside signup");
    console.log(req.body);

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
    console.log(req.body);
    console.log(user);

    if (!user) {
      throw new Error("user not found");
    }

    const isPasswordValid = await user.validatePassword(password);
    console.log("isPasswordValid", isPasswordValid);

    if (isPasswordValid) {
      const token = await user.getJwt();
      res.cookie("token", token, { expires: new Date(Date.now() + 24 * 60* 60* 1000 ) });
      res.send("login is success");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });

  res.send("logout successfully");
});

module.exports = authRouter;
