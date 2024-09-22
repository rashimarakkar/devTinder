const validator = require("validator");

const validateSignupData = (req) => {
  console.log('inside validateSignupData');
  
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

const validateEditUserData= (req)=>{


  const allowedUpdateFields = ['firstName', 'lastName', 'photoUrl', 'age', 'gender'];

  const isEditAllowed = Object.keys(req.body).every((field)=> allowedUpdateFields.includes(field))

  return isEditAllowed;

}

const validateNewPassword=(newPassword)=>{
  return validator.isStrongPassword(newPassword, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
}

module.exports = {validateSignupData, validateEditUserData, validateNewPassword};
