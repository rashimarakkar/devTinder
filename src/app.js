const express = require("express");
const PORT = 3000;
const app = express();
const { connectDB } = require("./config/database");
const User = require("./models/user");

app.use(express.json())

app.post("/signUp", async (req, res) => {
    console.log(req.body);
    
  const user = new User({...req.body});
  try {
    await user.save();
    res.send("User added successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(401).send(err.message);
  }
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
