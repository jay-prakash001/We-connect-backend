import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    name :{
        type : String, 
        required : true
    },
    profileImg:{
        type : String, 
        required: true
    }, 
    
    phone:{
        type :Number,
        required:true
    },
    refreshToken:{
        type : String,
        required:true,
        default: ""
    }


}, {timestamps:true})

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { phone: this.phone },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Example: '15m'
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { phone: this.phone  },
        process.env.REFRESH_TOKEN_SECRET, // Use a different secret for refresh tokens
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Example: '7d'
    );
};


export const User = mongoose.model("User", userSchema)