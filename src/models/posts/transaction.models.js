import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({

    transactionId:{
        type : String,
        required: true
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    clientId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required:true
    },
    workerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required:true
    }

},{timestamps:true})


export const Transaction = mongoose.model("Transaction",transactionSchema)