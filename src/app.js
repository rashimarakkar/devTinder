const express = require("express");
const PORT = 3000;
const app = express();




app.get("/user", (req,res,next)=>{

throw new Error("my created error")

res.send("user data")

})

app.use("/", (err,req,res,next)=>{  

    if(err){
        res.status(401).send(err.message)
    }
})

app.listen(PORT, () => {
  console.log(`Server started running successfully on port ${PORT}`);
});
