const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const { isValidObjectId } = require("mongoose");

requestRouter.post( 
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "intrested"];

      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // used pre function in mongoose schema for this checking
      // if(fromUserId.toString() === toUserId.toString()){
      //   return res
      //   .status(400)
      //   .json({ message: "cannot send connection request to yourself"});
      // }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res
          .status(404)
          .json({ message: "Request sending user not found" });
      }
      // {fromUserId: fromUserId,toUserId: fromUserId}
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "connection request already exists" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName +
          " is " +
          (status === "intrested" ? status + " in " : status) +
          " " +
          toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      if(!isValidObjectId(requestId)){
        return res.status(400).send("Invalid connection request Id");
      }

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(422).send("status not allowed");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "intrested",
      })

      if (!connectionRequest) {
        return res.status(404).send("Connection request not found");
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.status(200).json({ message: "Connection request " + status, data });
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }
);

module.exports = requestRouter;
