const express = require("express");
const bcrypt = require("bcrypt");
const PORT = 3000;
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const cookieParser = require("cookie-parser");

const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/login", async (req, res) => {
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

app.post("/signUp", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/connectionRequest", userAuth, (req, res) => {
  console.log("connectionRequest sent");

  res.send("connectionRequest sent");
});

connectDB()
  .then(() => {
    console.log("mongodb database connected succesfully");

    app.listen(PORT, () => {
      console.log(`Server started running successfully on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error while connecting to database");
  });
