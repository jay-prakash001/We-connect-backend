import mongoose from "mongoose";
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




export const User = mongoose.model("Client", userSchema)