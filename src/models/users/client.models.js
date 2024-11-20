import mongoose from "mongoose";

export  const locationSchema = new mongoose.Schema({
    lat:{
        type : Number, 
        required : true
    },
    long : {
        type : Number, 
        required : true
    },
    city : {
        type : String,
        required : true
    }, 
    pin_code : {
        type : Number ,
        required : true
    }, 
    state : {
        type : String , 
        required : true
    }
})



const clientSchema = new mongoose.Schema({

    name :{
        type : String, 
        required : true
    },
    profileImg:{
        type : String, 
        required: true
    }, 
    location :{
        type : locationSchema,
        required : true
    }, 
    phone:{
        type :Number,
        required:true
    },


}, {timestamps:true})

export const Client = mongoose.model("Client", clientSchema)