import mongoose from "mongoose";






const clientSchema = new mongoose.Schema({

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


}, {timestamps:true})

export const Client = mongoose.model("Client", clientSchema)