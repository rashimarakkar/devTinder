const express = require("express");
const PORT = 3000;
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signUp", async (req, res) => {
  console.log(req.body);

  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) res.status(404).send(error.message);

    res.send(user);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feeds", async (req, res) => {
  try {
    const users = await User.find({});

    if (!users) {
      res.status(404).send("No users found");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }

  // const users = await User.find({});
  // res.status(200).send(user);
});

app.delete("/user", async (req, res) => {
  console.log("inside delete user");

  console.log(req.body.userId);

  const user = await User.findByIdAndDelete(req.body.userId);
  if (!user) {
    res.status(404).send("No user found");
  } else {
    res.send("User deleted successfully");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  const user = await User.findByIdAndUpdate(userId, data);

  if (!user) {
    res.status(404).send("No user found");
  } else {
    res.send("User data updated successfully");
  }
});

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.status(401).send(err.message);
//   }
// });

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
