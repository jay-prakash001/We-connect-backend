import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   
    approachId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Approach",
        required:true
    },
    content:{
        type:String,
        required:true
    }
}, {timestamps:true})


export const Chat = new mongoose.model("Chat", chatSchema)