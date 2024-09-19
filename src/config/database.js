
const mongoose = require("mongoose");

const connectDB = async ()=>{

    await mongoose.connect("mongodb+srv://rashimarakkar:nooru&thyshu@jsworld.e3y1b.mongodb.net/devTinder")
}


module.exports= {connectDB};
