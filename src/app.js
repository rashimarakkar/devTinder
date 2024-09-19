const express  = require("express");
const PORT = 3000;

const app = express();


app.get("/user/:id/:name/:age", (req, res) => {
  
    console.log(req.params);
    
  res.send(req.params);
});

app.listen(PORT, () => {
  console.log(`Server started running successfully on port ${PORT}`);
});
