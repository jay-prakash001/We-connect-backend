import asyncHandler from "../utils/asyncHandler.utils.js";
import {Worker} from '../models/users/workers.models.js'
import { ApiError } from "../utils/ApiError.utils.js";
import {Approach} from '../models/posts/approaches.models.js'

import mongoose from 'mongoose'
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Post } from "../models/posts/posts.models.js";
const createApproach = asyncHandler(async (req, res) => {

try {
        const worker = await Worker.findOne({ user: req.user._id })
        
        if(!worker){
            throw new ApiError(401, 'invalid credentials')
        }
        const {postId, content} = req.body
    
        if(!postId || !content){
            throw new ApiError(402, 'all fields required')
        }
    
        const approach  = await Approach.create({
            postId: new mongoose.Types.ObjectId(postId), 
            workerId : new mongoose.Types.ObjectId(worker._id), 
            content : content
        })
    
        console.log(approach)
        if(approach){
            const post = await Post.findByIdAndUpdate(new mongoose.Types.ObjectId(postId),{
                $push:{
                    approaches:approach._id
                }
            })
            console.log(post)
           return res.status(201).json( new ApiResponse(201,{approach}, "approached successfully"))
        }
    
    
} catch (error) {
    throw new ApiError(500, 'approach failed')
}
})

const deleteApproach = asyncHandler(async(req, res)=>{




})
export { createApproach }