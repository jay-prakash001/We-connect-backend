import mongoose from "mongoose";


 export const locationSchema = new mongoose.Schema({
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    pin_code: {
        type: Number,
        required: true
    },
    state: {
        type: String,
        required: true
    }

})
const workerSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bio: {
        type: String,
    },
    location: {
        type: locationSchema,
        required: true
    },
    experience:{
        type:String,
        required:true
    }


}, {timestamps: true})

export const Worker = mongoose.model("Worker", workerSchema)