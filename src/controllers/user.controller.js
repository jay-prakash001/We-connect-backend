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
    const { name, phone ,lat, long, city, pin_code, state} = req.body;

    // Validation for top-level fields
    if ([name, phone].some((field) => !field || field.toString().trim() === "")) {

        throw new ApiError(400, "Name, profile image, and phone are required");
    }

    // Validation for nested location fields
    
    if (
        [lat, long, city, pin_code, state].some(
            (field) => field === undefined || field === null || field.toString().trim() === ""
        )
    ) {
        throw new ApiError(400, "All location fields are required");
    }
    if (lat < -90 || lat > 90) {
        throw new ApiError(400, "Latitude must be between -90 and 90");
    }
    if (long < -180 || long > 180) {

        throw new ApiError(400, "Longitude must be between -180 and 180");
    }

    // Specific validation for pin code length
    if (pin_code.toString().length !== 6) {

        throw new ApiError(400, "Pin code must be a 6-digit number");
    }

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
        name:name, profileImg: img.url, location: {
            lat: lat,
            long: long,
            city: city,
            state: state,
            pin_code: pin_code
        },phone:phone
    })

    const createdUser = await Client.findById(client._id)
    console.log(createdUser)
    if(!createdUser){
        throw new ApiError(500,"internal server error")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )
    res.end()
})
const createWorker = asyncHandler(async (req, res) => {
    console.log('create worker')
    console.log(req.body)
    res.end()
})

export { createClient, createWorker }