const express = require("express");
const PORT = 3000;
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.post("/user/login", (req, res) => {
  res.send("user logged in successfully");
});

app.get("/user", userAuth, (req, res) => {
  res.send("User data sent");
});

app.get("/admin/getAllData", (req, res) => {
  res.send("all data sent");
});

app.delete("/admin/getAllData", (req, res) => {
  res.send("delete a user");
});

app.listen(PORT, () => {
  console.log(`Server started running successfully on port ${PORT}`);
});
