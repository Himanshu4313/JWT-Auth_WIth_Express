const userModel = require("../models/userSchema.js");
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");

//controller for signUp user
exports.signUp = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  // before saving data into database we check some condition

  // check all fields are required
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  //check given email is valid or not
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please enter valid email.",
    });
  }

  //check password and confirmPassword are match or not
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Your password will mismatched, Please check it.",
    });
  }

  try {
    const user = await userModel.save({
      name,
      email,
      password,
      confirmPassword,
    });

    res.status(200).json({
      success: true,
      message: "User signUp successfully.",
      data: user,
    });
  } catch (error) {
    //This error takel user already exists
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Already user can exists with your providing email.",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//controller for signIn user
exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  //check validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are mandatory",
    });
  }
  try {
    //check email and password are correct or not
    const userExists = await userModel.findOne({ email }).select("+password");

    if (!userExists || !(bcrypt.compare(password , userExists.password))) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // now token in cookies
    const token = userExists.jwtToken();
    userExists.password = undefined;

    const cookiesOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookiesOption);
    res.status(200).json({
      success: true,
      message: "Login Successfully",
      data: userExists,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

//controller for getInfo of user
exports.getUserInfo = async (req , res) =>{
      const id = req.user.id;
      try {
        const userInfo = await userModel.findById(id);
        return res.status(200).json({
            success : true,
            data : userInfo
        })
      } catch (error) {
             return res.status(400).json({
                success : false ,
                message : error.message
             })
      }
}

//controller for logout 
exports.logout = (req , res) =>{
     try {
        const cookiesOption = {
            expires : new Date(),
            httpOnly : true
        }
        res.cookie("token" , null , cookiesOption);
        res.status(200).json({
            success : true,
            message : "Logout successfully"
        })
     } catch (error) {
        res.status(400).json({
            success : false,
            message : error.message
        })
     }
}