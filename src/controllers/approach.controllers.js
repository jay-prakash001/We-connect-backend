import asyncHandler from "../utils/asyncHandler.utils.js";
import { Worker } from '../models/users/workers.models.js'
import { ApiError } from "../utils/ApiError.utils.js";
import { Approach } from '../models/posts/approaches.models.js'

import mongoose from 'mongoose'
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import { Post } from "../models/posts/posts.models.js";
const createApproach = asyncHandler(async (req, res) => {

    try {
        const worker = await Worker.findOne({ user: req.user._id })

        if (!worker) {
            throw new ApiError(401, 'invalid credentials')
        }
        const { postId, content } = req.body

        if (!postId || !content) {
            throw new ApiError(402, 'all fields required')
        }

        const approach = await Approach.create({
            postId: new mongoose.Types.ObjectId(postId),
            workerId: new mongoose.Types.ObjectId(worker._id),
            content: content
        })

        console.log(approach)
        if (approach) {
            const post = await Post.findByIdAndUpdate(new mongoose.Types.ObjectId(postId), {
                $push: {
                    approaches: approach._id
                }
            })
            console.log(post)
            return res.status(201).json(new ApiResponse(201, { approach }, "approached successfully"))
        }


    } catch (error) {
        throw new ApiError(500, 'approach failed')
    }
})
const get_approach_worker = asyncHandler(async (req, res) => {

    try {
        const worker = await Worker.findOne({ user: req.user._id })
        const approaches = await Approach.aggregate([

            {
                $lookup: {
                    from: 'posts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'post'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'post.client',
                    foreignField: '_id',
                    as: 'clientDetails'
                }
            },
            {
                $match: {
                    workerId: new mongoose.Types.ObjectId(worker._id)
                }
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'post.title': 1,
                    'post.location.city': 1,
                    'post.imagesUrl': 1,
                    'clientDetails.name': 1,
                    'clientDetails.profileImg': 1
                }
            }


        ])

        console.log(approaches)

        return res.status(200).json(
            new ApiResponse(200, approaches, "approaches fetched successfully")
        )
    } catch (error) {
        throw new ApiError(404, "error fetching approaches", error)
    }
})
const get_approach_user = asyncHandler(async (req, res) => {

    try {

        const approaches = await Approach.aggregate([

            {
                $lookup: {
                    from: 'posts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'post'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'post.client',
                    foreignField: '_id',
                    as: 'clientDetails'
                }
            },
            {
                $match: {
                    'post.client': new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'post.title': 1,
                    'post.imagesUrl': 1,
                }
            }


        ])

        console.log(approaches)

        return res.status(200).json(
            new ApiResponse(200, approaches, "approaches fetched successfully")
        )
    } catch (error) {
        throw new ApiError(404, "error fetching approaches", error)
    }
})
const deleteApproach = asyncHandler(async (req, res) => {

    try {
        const { approachId } = req.body
    
        const worker = await Worker.findOne({ user: req.user._id })

        if ( !req.user || !worker) {
            throw  new ApiError(401, "invalid user credential")
                }


     
        const approach = await Approach.findOne({ _id: new mongoose.Types.ObjectId(approachId) })
    
        if(!approach){
            
         throw new ApiError(401, "approach not found!")
        }

        if (approach.workerId.toString() === worker._id.toString()) {
            const res = await Approach.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(approachId) })
    
            return res.status(200).json(new ApiResponse(200, res, "approach deleted successfully"))
        }
        else{

          throw  new ApiError(401, "unauthorized access")
        }
    
    } catch (error) {
        throw new ApiError(404, `${error}`)
    }

    res.end()

})
export { createApproach, get_approach_worker, get_approach_user, deleteApproach }