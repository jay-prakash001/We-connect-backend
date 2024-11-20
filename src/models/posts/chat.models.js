import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    clientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true
    },
    workerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Worker",
        required:true
    },
    postId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    content:{
        type:String,
        required:true
    }
}, {timestamps:true})


export const Chat = new mongoose.model("Chat", chatSchema)