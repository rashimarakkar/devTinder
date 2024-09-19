const express = require("express");
const PORT = 3000;

const app = express();

app.get("/user", (req, res) => {
  res.send({ firstName: "Rashid", lastName: "TP" });
});

app.post("/user", (req, res) => {
  res.send("Saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully");
});

app.use("/test", (req, res) => {
  res.send("hellow from test");
});

app.listen(PORT, () => {
  console.log(`Server started running successfully on port ${PORT}`);
});
