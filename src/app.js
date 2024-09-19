const express = require("express");
const PORT = 3000;

const app = express();

app.use("/",(req,res)=>{
    res.send('welcome to nodejs');
})

app.use("/test",(req,res)=>{
    res.send('hellow from server');
})

app.listen(PORT, () => {
  console.log(`Server started running successfully on port ${PORT}`);
});
