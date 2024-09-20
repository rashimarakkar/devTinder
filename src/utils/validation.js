const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, photoUrl, password, email, age, gender } =
    req.body;

    console.log(firstName, lastName);
    

  if (!firstName && !lastName) {
    throw new Error("name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("enter a strong password");
  }
};

module.exports = validateSignupData;
