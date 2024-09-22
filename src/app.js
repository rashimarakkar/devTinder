const express = require("express");
const PORT = 3000;
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
