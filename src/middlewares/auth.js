const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
        throw new Error("Invalid token");
      }

    const decoded = await jwt.verify(token, "rashidjwt");
    const { _id } = decoded;
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
     
    req.user =user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  userAuth,
};
