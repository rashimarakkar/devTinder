const express  = require("express");
const PORT = 3000;

const app = express();

app.use("/users",(req,res,next)=>{

console.log('inside first route handler');

next()
// res.send("sending from first route handler")
},
(req,res,next)=>{

console.log('inside second route handler');

// res.send("sending from second route handler")
next()
},
(req,res)=>{

    console.log('inside third rout handler');
    
    res.send("sending from third route handler")
}
)

app.listen(PORT, () => {
  console.log(`Server started running successfully on port ${PORT}`);
});
