const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    name : {
        type : String,
        required : [true , "name is required"],
        minLength : [5 , "name must be in 5 char"],
        maxLength : [20 , "name should be at least 20 char"],
        trim : true
    },
    email : {
        type : String,
        required : [true , "email is required"],
        unique : [true , "This email is already exists"],
        lowerCase : true
    },
    password : {
        type : String,
        Selection : true,
    },
    forgotPasswordToken : {
        type : String,
    },
    forgotPasswordExpiryDate : {
        type : Date,
    },
},{
    timestamps :true
})

// bcrypt is used for password 
userSchema.pre('save' , async (next) =>{
        if(!this.isModified('password')){
            return next();
        }
        this.password = await bcrypt.hash(this.password , 10);
        return next();
})
//jwttoken
userSchema.methods = {
    jwtToken(){
        return JWT.sign(
            {id : this._id , email : this.email},
            process.env.SECRET,
            {expiresIn : '24h'}
        ) 
    }
}

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;