import mongoose from 'mongoose';

const approachSchema = new mongoose.Schema({

    postId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Post",
    required: true
    },
    workerId:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true
    },
    content :{
        type :String,
        required:true
    }


},{timestamps:true})


export const Approach = mongoose.model('Approach',approachSchema)