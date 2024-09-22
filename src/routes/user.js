const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoUrl";

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedUser._id,
      status: "intrested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender ");

    res.json({ message: " Data fetched sccessfully", data: connectionRequest });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.status(200).json({ message: "data fetched successfully", data });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = userRouter;
