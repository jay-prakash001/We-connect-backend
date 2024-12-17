import { User } from "../models/users/user.models.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import { ApiError } from '../utils/ApiError.utils.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import { profileImg } from "../utils/utils.js";
import mongoose from "mongoose";
import { Worker } from "../models/users/workers.models.js";


const createWorker = asyncHandler(async (req, res) => {

    const { name, lat, long, city, pin_code, state, bio, experience } = req.body;

    // Check if any field is missing or empty
    const imgLocalPath = req.file.path;
    if (![name, lat, long, city, pin_code, state, bio, experience, imgLocalPath].every(Boolean)) {
        throw new ApiError(400, "Every field is required");
    }
    try {
        const reqUser = req.user;
        const img = await uploadOnCloudinary(req.file.path);
        const user = await User.findOneAndUpdate({ phone: reqUser.phone }, {
            name: name,
            profileImg: img.url
        });
        let worker = await Worker.findOneAndUpdate({ user: user._id }, {
            bio: bio,
            location: {
                lat: lat,
                long: long,
                city: city,
                pin_code: pin_code,
                state: state
            },
            experience: experience,
        })

        if (!worker) {

            worker = await Worker.create({
                user: new mongoose.Types.ObjectId(user._id),
                bio: bio,
                location: {
                    lat: lat,
                    long: long,
                    city: city,
                    pin_code: pin_code,
                    state: state
                },
                experience: experience,
            })
        }
        user.save({ validateBeforeSave: false }, { new: true })
        worker.save({ validateBeforeSave: false }, { new: true })
        return res.status(201).json(
            new ApiResponse(200, { user: user, worker: worker }, "worker created successfully")
        )
    } catch (error) {
        console.log(error)
        throw new ApiError(401, "worker creation failed b'coz : ", error)
    }


})

const setUserDetails = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new ApiError(`Phone ${req.phone} not found`)
    }

    const { name } = req.body

    try {
        const imgLocalPath = req.files?.profileImg[0]?.path
        if (!(name)) {
            throw new ApiError(`Name is required`)
        }
        if (!(imgLocalPath)) {
            throw new ApiError(`Image  path is required`)
        }
        const user = await User.findOne({ phone: req.user.phone })
        console.log(user)

        if (!user) {
            throw new ApiError(`User ${req.phone} not found`)
        }
        const img = await uploadOnCloudinary(imgLocalPath)
        console.log(user.profileImg)
        user.name = name
        user.profileImg = img.url
        user.save({ validateBeforeSave: false }, { new: true })
        return res.status(201).json(new ApiResponse(200, { user }, "user created successfully"))
    } catch (err) {
        console.log(err)
        res.status(500).json(new ApiError(500, err))
    }
    res.end()
})

// to be tested
const logOut = asyncHandler(async (req, res) => {
    console.log(req.phone)
    const user = await User.findOne({ phone: req.phone })

    if (!user) {
        throw new ApiError(`User ${req.phone} not found`)
    }
    user.refreshToken = undefined;
    user.save({ validateBeforeSave: false }, { new: true })
    const options = {
        httpOnly: true,
        secure: true,
    }
    res.status(200).clearCookie("accessToken", options)
        .clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "Logged out successfully"))
})


const get_user_details = asyncHandler(async (req, res) => {
    console.log(req.user)

    return res.status(200).json(new ApiResponse(200, req.user, "user fetched successfully"))
})
const get_user_profile = asyncHandler(async (req, res) => {
    console.log(req.user)

    const result = await User.aggregate([
        {
            $lookup: {
                from: 'posts', // Collection name for posts
                localField: 'client', // User's _id field
                foreignField: 'userId', // Post's userId field
                as: 'userPosts' // The resulting array field
            }
        },
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id) // Match the logged-in user
            }
        },
        {
            $addFields: {
                totalPosts: { $size: '$userPosts' } // Count the number of posts
            }
        },
        {
            $project: {
            //    title : '$userPosts.title'
            userPosts:0,
            refreshToken:0
            }
        }
    ]);
    
    


    return res.status(200).json(new ApiResponse(200, result[0], "user fetched successfully"))
})
const get_worker_details = asyncHandler(async (req, res) => {


    console.log(req.user)
    try {
        const worker = await Worker.findOne({ user: req.user._id })

        return res.status(200).json(new ApiResponse(200, { user: req.user, worker: worker }, "user fetched successfully"))
    } catch (error) {
        throw new ApiError(401, "fetching worker detail failed ", error)
    }



})

const update_profileImg = asyncHandler(async (req, res) => {
    try {
        const reqUser = req.user

        if (!reqUser) {
            throw new ApiError(401, "unauthorized request")
        }
        const imgLocalPath = req.file.path;
        const img = await uploadOnCloudinary(imgLocalPath);

        const user = await User.findOneAndUpdate({ phone: reqUser.phone }, {
            profileImg: img.url
        });

        return res.status(201).json(new ApiResponse(200, {}, "profile updated Successfully"))

    } catch (error) {
        throw new ApiError(401, "updation failed", error)
    }
})
// getting full profile -> counts of post , projects , transactions etc

export { createWorker, setUserDetails, logOut, get_user_details, get_worker_details, update_profileImg, get_user_profile };
