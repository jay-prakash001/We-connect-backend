import {User} from "../models/users/user.models.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import uploadOnCloudinary from "../utils/cloudinary.utils.js";
import {ApiError} from '../utils/ApiError.utils.js';
import {ApiResponse} from '../utils/ApiResponse.utils.js';
import {profileImg} from "../utils/utils.js";
import mongoose from "mongoose";
import {Worker} from "../models/users/workers.models.js";
//

const createWorker = asyncHandler(async (req, res) => {

    const { name, lat, long, city, pin_code, state, bio, experience } = req.body;

// Check if any field is missing or empty
    const imgLocalPath = req.file.path;
    if (![name, lat, long, city, pin_code, state, bio, experience,imgLocalPath].every(Boolean)) {
        throw new ApiError(400, "Every field is required");
    }

    const reqUser = req.user;
    const img = await uploadOnCloudinary(req.file.path);
    const user = await User.findOneAndUpdate({phone : reqUser.phone},{
        phone : phone,
        name: name,
        profileImg:img.url
    });
console.log(user);

    const worker = await  Worker.create({
        user: new mongoose.Types.ObjectId(user._id),
        bio :bio,
        location:{
            lat: lat,
            long: long,
            city: city,
            pin_code: pin_code,
            state: state
        },
        experience:experience,
    })
    console.log(worker)
    return res.status(201).json(
        new ApiResponse(200, {}, "user created successfully")
    )

})

const setUserDetails = asyncHandler(async (req, res) => {
    if (!req.phone) {
        throw new ApiError(`Phone ${req.phone} not found`)
    }
    const {name} = req.body
    console.log(req.files);
   try{
       const imgLocalPath = req.files?.profileImg[0]?.path
       if (!(name)) {
           throw new ApiError(`Name is required`)
       }
       if (!(imgLocalPath)) {
           throw new ApiError(`Image  path is required`)
       }
       const user = await User.findOne({phone: req.phone})
       console.log(user)

       if (!user) {
           throw new ApiError(`User ${req.phone} not found`)
       }
       const img = await uploadOnCloudinary(imgLocalPath)
       console.log(user.profileImg)
       user.name = name
       user.profileImg = img.url
       user.save({validateBeforeSave:false},{new: true})
       res.status(201).json(new ApiResponse(200, {user}, "user created successfully"))
   }catch(err){
       console.log(err)
       res.status(500).json(new ApiError(500,err))
   }
    res.end()
})

const logOut = asyncHandler(async (req, res) => {
    console.log(req.phone)
    const user = await User.findOne({phone: req.phone})

    if (!user) {
        throw new ApiError(`User ${req.phone} not found`)
    }
    user.refreshToken = undefined;
    user.save({validateBeforeSave:false},{new: true})
    const options = {
        httpOnly: true,
        secure: true,
    }
    res.status(200).clearCookie("accessToken",options)
        .clearCookie("refreshToken",options).json(new ApiResponse(200,{},"Logged out successfully"))
})


const get_user_details =asyncHandler(async(req, res)=>{
    console.log(req.user)

    return res.status(200).json(new ApiResponse(200,req.user,"user fetched successfully"))
    res.end()
})

export { createWorker,  setUserDetails,logOut,get_user_details };



// const createClient = asyncHandler(async (req, res) => {
//
//     const imgLocalPath = req.files?.profileImg[0]?.path
//     console.log()
//     console.log("imgLocalPath", imgLocalPath)
//     res.setHeader("Content-Type", "image/jpeg");
//     res.end()
//     // const img = await uploadOnCloudinary(imgLocalPath)
//     //
//     // // console.log(img)
//     // const { name, phone } = req.body;
//     //
//     // // Validation for top-level fields
//     // if ([name, phone].some((field) => !field || field.toString().trim() === "")) {
//     //
//     //     throw new ApiError(400, "Name,  and phone are required");
//     // }
//     //
//     // // Validation for nested location fields
//     //
//     //
//     //
//     //
//     // // Specific validation for phone number
//     // if (!/^\d{10}$/.test(phone)) {
//     //     throw new ApiError(400, "Phone number must be a 10-digit number");
//     // }
//     //
//     // const existingUser = await Client.findOne({ phone })
//     //
//     // if (existingUser) {
//     //     throw new ApiError(409, "user exists")
//     // }
//     //
//     // const imgLocalPath = req.files?.profileImg[0]?.path
//     //
//     // console.log(imgLocalPath)
//     // if (!imgLocalPath) {
//     //     throw new ApiError(400, "profile image is required")
//     //
//     // }
//     //
//     // const img = await uploadOnCloudinary(imgLocalPath)
//     //
//     // console.log(img)
//     //
//     // if (!img) {
//     //     throw new ApiError(400, "profile image is required, server error")
//     //
//     // }
//     //
//     // const client = await Client.create({
//     //     name: name, profileImg: img.url, phone: phone
//     // })
//     //
//     // const createdUser = await Client.findById(client._id)
//     // console.log(createdUser)
//     // if (!createdUser) {
//     //     throw new ApiError(500, "internal server error")
//     // }
//     // return res.status(201).json(
//     //     new ApiResponse(200, createdUser, "user created successfully")
//     // )
//
// })