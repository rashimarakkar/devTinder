const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [2, "First name must be at least 2 characters long"],
      maxLength: [10, "First name cannot exceed 10 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: [10, "Last name cannot exceed 10 characters"],
    },
    photoUrl: {
      type: String,
      default:
        "https://media.licdn.com/dms/image/v2/D5603AQFXwjAWQ538Rg/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1726118073863?e=1732147200&v=beta&t=ty56QCp7SWWZNCdPflcZGdQPx6YUjwoSJBqXHwooijI",
      trim: true,
      validate: (value) => {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL" + value);
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters long"],
      // select: false , - if we make it true can not be accessed for checking
      validate: {
        validator: function (value) {
          // Password must contain at least one letter and one number
          return /(?=.*\d)(?=.*[a-zA-Z]).{6,}/.test(value);
        },
        message: "Password must contain at least one letter and one number",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          // Validate email format

          if (!validator.isEmail(value)) {
            throw new Error("Invalid email address");
          }
        },
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
      max: [100, "Age cannot exceed 100"],
      validate: {
        validator: Number.isInteger,
        message: "Age must be an integer",
      },
    },
    gender: {
      type: String,
      enum:{
        values: ["male", "female", "other"],
        message:`{VALUE} is not a valid gender type`
      }
      // validate: {
      //   validator: function (value) {
      //     // Gender must be either male, female, or other
      //     if (!["male", "female", "other"].includes(value)) {
      //       throw new Error("Invalid gender");
      //     }
      //   },
      //   message: "Gender must be either 'male', 'female', or 'other'",
      // },
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt timestamps


userSchema.methods.getJwt = async function(){
  const user= this;
  return  await jwt.sign({ _id: user._id }, "rashidjwt", {expiresIn:"1d"});
}

userSchema.methods.validatePassword = async function (passwordByUser) {
  console.log('inside validatePassword function');
  
  const user= this;
  console.log('passwordByUser', passwordByUser);
  console.log(user.password);
  
  return  await bcrypt.compare(passwordByUser, user.password);
}

const User = mongoose.model("User", userSchema);

module.exports = User;
