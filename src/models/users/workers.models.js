import mongoose from "mongoose";
import {locationSchema} from "./client.models.js";




const locationSchema = new mongoose.Schema({
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
const workerSchema = new mongoose.Schema({

    name :{
        type : String, 
        required : true
    },
    bio :{
        type : String,
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

export const Client = mongoose.model("Worker", workerSchema)