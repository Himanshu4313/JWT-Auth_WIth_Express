//enable dotenv file 
require("dotenv").config();
//import express
const express = require("express");
// import cors 
const cors = require("cors");
//import databaseConnect file 
const connectToDB = require("./config/databaseConnect.js");
const app = express();

//Express middlewear 
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//enable corss origin because of communicating one platform to another platform [client and server]
app.use(cors());

// connect to database
connectToDB();

app.get("/", (req , res) =>{
     res.json({message : "Hello server is working.."})
})

module.exports = app;