const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/connectionRequest", userAuth, (req, res) => {
  console.log("connectionRequest sent");

  res.send("connectionRequest sent");
});

module.exports = requestRouter;
