const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
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

userRouter.get("/feeds", userAuth, async (req, res) => {
  try {
    const DEFAULT_LIMIT = 2;
    const MAX_LIMIT = 2;
    
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || DEFAULT_LIMIT;

    limit = limit > MAX_LIMIT ? MAX_LIMIT : limit;

    const skip = (page - 1) * limit;
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });

    // Find users not in the hidden list and not the logged-in user
    const users = await User.find({
      _id: { $nin: [...hideUsersFromFeed, loggedInUser._id.toString()] },
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
       // Optional: Include pagination metadata
       res.status(200).json({
        currentPage: page,
        usersPerPage: limit,
        users,
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
