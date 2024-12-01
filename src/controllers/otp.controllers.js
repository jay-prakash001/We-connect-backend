import { response } from "express"
import { Otp } from "../models/verification/otp.models.js"
import { User } from "../models/users/user.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { client, generateOTP, phone } from "../utils/getOtp.js"
import { ApiError } from '../utils/ApiError.utils.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import { profileImg } from "../utils/utils.js";

const generateAccessAndRefreshTokens = async (client_phone) => {

    try {
        const otp = await Otp.findOne({client_phone})
        const accessToken = otp.generateAccessToken();
        const refreshToken = otp.generateRefreshToken();
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }

}
const getOtp = asyncHandler(async (req, res) => {

    const { client_phone } = req.body

    if (!client_phone) {
        return res.status(400).json({ success: false, error: "Phone number is required." })
    }
    const otp = generateOTP()
    try { 
    const otpSend = await Otp.create({ client_phone, otp })

    console.log(otpSend)
    const message = await client.messages.create({
        to: "+91" + client_phone,
        from: phone,
        body: "Your Otp for " + client_phone + " is " + otp
    })
   
    res.status(200).json({success:true, message : 'otp sent'})
    } catch (error) {
        res.write(error)
        res.status(400).json({success:false, message:error})
    }
    res.end()
})
const verifyOtp = asyncHandler(async(req, res) =>{
    // console.log(req.body)
    const { client_phone, otp } = req.body; 
    if (!client_phone || !otp) {
        return res.status(400).json({ success: false, error: "Phone number and OTP are required" });
    }

    try {
        const otpRecieved = await Otp.findOne({ client_phone, otp })
        if (!otpRecieved) {
            console.log('not found')
            res.status(400).json({ success: false, error: 'not found' })
        } else {
            const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(client_phone)
            let existingUser = await User.findOne({phone: client_phone })

            await Otp.deleteOne({ client_phone, otp })
            const message = await client.messages.create({
                to: "+91" + client_phone,
                from: phone,
                body: "Account verified successfully"
            })

            const options = {
                httpOnly: true, secure: true
            }
            if (!existingUser) {
                 existingUser = await User.create({
                    name: `${client_phone}@weconnect`, profileImg: profileImg, phone: client_phone,refreshToken: refreshToken
                })

            }

            existingUser.refreshToken = refreshToken
            existingUser.save({validateBeforeSave:false})
            return res.status(201).cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options).json(
                new ApiResponse(200, {user : existingUser, refreshToken, accessToken}, "user fetched successfully")
            )

        }

    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, messaage : error})
    }

    res.end()

})

export { getOtp, verifyOtp }