const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const User = require('../models/user');

const { validateEditUserData, validateNewPassword } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditUserData(req)) {
      throw new Error("Invalid edit request");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();

    // res.send(`${loggedInUser.firstName} Updated successfully`)
    res.json({ message: "updated successfully", data: loggedInUser });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    // body contains new password and old password
    // compare oldpassword with current loggegin user password
    // if not match then throw error invalid passord
    // Validate the new password strength
    // change req.user.password to new password and then save

    const { newPassword, oldPassword } = req.body;
    // let user = req.user;
    // if (!user.password) {
      const user = await User.findById(req.user._id).select('+password');
      if (!user) {
        throw new Error("User not found");
      }
    // }
    const isPasswordValid = await user.validatePassword(oldPassword);

    if (!isPasswordValid) {
      throw new Error("Incorrect old password");
    }
    // Validate the new password strength
    if (!validateNewPassword(newPassword)) {
      throw new Error("New password is not strong enough");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.password = passwordHash;
    await user.save();
    res.send("password updated successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = profileRouter;
