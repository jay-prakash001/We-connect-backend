import { Client } from "../models/users/client.models.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import uploadOnCloudinary from "../utils/cloudinary.utils.js";
import {ApiError} from '../utils/ApiError.utils.js';
import {ApiResponse} from '../utils/ApiResponse.utils.js';

const createClient = asyncHandler(async (req, res) => {
console.log(req.body)
console.log(req.files)
//  const imgLocalPath = req.files?.profileImg[0]?.path
// const img = await uploadOnCloudinary(imgLocalPath)

// console.log(img)
    const { name, phone } = req.body;

    // Validation for top-level fields
    if ([name, phone].some((field) => !field || field.toString().trim() === "")) {

        throw new ApiError(400, "Name,  and phone are required");
    }

    // Validation for nested location fields


    

    // Specific validation for phone number
    if (!/^\d{10}$/.test(phone)) {
        throw new ApiError(400, "Phone number must be a 10-digit number");
    }

    const existingUser = await Client.findOne({ phone })

    if (existingUser) {
        throw new ApiError(409, "user exists")
    }

    const imgLocalPath = req.files?.profileImg[0]?.path

    console.log(imgLocalPath)
    if (!imgLocalPath) {
        throw new ApiError(400, "profile image is required")

    }

    const img = await uploadOnCloudinary(imgLocalPath)

    console.log(img)

    if (!img) {
        throw new ApiError(400, "profile image is required, server error")

    }

    const client = await Client.create({
        name:name, profileImg: img.url,phone:phone
    })

    const createdUser = await Client.findById(client._id)
    console.log(createdUser)
    if(!createdUser){
        throw new ApiError(500,"internal server error")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )
 
})
const createWorker = asyncHandler(async (req, res) => {
    console.log('create worker')
    console.log(req.body)
    res.end()
})

export { createClient, createWorker }