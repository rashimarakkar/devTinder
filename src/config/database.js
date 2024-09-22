
const mongoose = require("mongoose");

const connectDB = async ()=>{

    // await mongoose.connect("mongodb+srv://rashimarakkar:nooru&thyshu@jsworld.e3y1b.mongodb.net/devTinder")
    await mongoose.connect("mongodb://127.0.0.1:27017/devTinder")
}


module.exports= {connectDB};
