//enable dotenv file 
require("dotenv").config();
//import express
const express = require("express");
// import cors 
const cors = require("cors");
//import databaseConnect file 
const connectToDB = require("./config/databaseConnect.js");
//import routes 
const authRouter = require("./routes/authRouters.js");
const cookieParser = require("cookie-parser");

const app = express();

// connect to database
connectToDB();


//Express middlewear 
app.use(express.json());
app.use(express.urlencoded({extended : true}));
//cookies parser it help to change token into json object.
app.use(cookieParser());
//enable corss origin because of communicating one platform to another platform [client and server]
app.use(cors());

// auth router path ,  all auth route are access From here
app.use('/api/auth',authRouter);

// home path route it always execute 
app.use("/", (req , res) =>{
     res.status(200).json({message : "JWT Authentication Application"})
})


module.exports = app;