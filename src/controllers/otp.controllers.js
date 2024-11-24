import { response } from "express"
import { Otp } from "../models/verification/otp.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { client, generateOTP, phone } from "../utils/getOtp.js"

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
    console.log(req.body)
    const { client_phone, otp } = req.body; 
    if (!client_phone || !otp) {
        return res.status(400).json({ success: false, error: "Phone number and OTP are required" });
    } else {
        console.log(req.body)

    }

    try {
        const otpRecieved = await Otp.findOne({ client_phone, otp })
        if (!otpRecieved) {
            console.log('not found')
            res.status(400).json({ success: false, error: 'not found' })
        } else {
            console.log('verified successfully')
            await Otp.deleteOne({ client_phone, otp })
            const message = await client.messages.create({
                to: "+91" + client_phone,
                from: phone,
                body: "Account verified successfully"
            })
            res.status(200).json({ success: true, message: 'verification successful' })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, messaage : error})
    }

    res.end()

})



export { getOtp, verifyOtp }