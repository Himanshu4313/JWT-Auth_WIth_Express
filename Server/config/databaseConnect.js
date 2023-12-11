//Here we implement a function database connection
const mongoose = require("mongoose");

const mongodb_URL = process.env.MONGODB_URL; 
const connectToDB = async () =>{
      mongoose.connect(mongodb_URL)
      .then((connection) =>{
         console.log("Database is connected successfully with ",connection.connection.host);
      })
      .catch((error) =>{
         console.log(error.message);
         process.exit(1);
      })
}

module.exports = connectToDB;