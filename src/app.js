import express from 'express';
import { Post } from './models/posts/posts.models.js';
import twilio from 'twilio';
import { Otp } from './models/verification/otp.models.js';

export const app = express()

app.use(express.json())
const sid = process.env.sid
const token = process.env.token
const phone = process.env.phone
const client = twilio(sid, token)


app.post('/create_post', async (req, res) => {

    const post = await Post.create(req.body)
    console.log(req.body)
    console.log(post)
    res.send(post)
})

const generate = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/getotp', async (req, res) => {
    const { client_phone } = req.body

    if (!client_phone) {
        return res.status(400).json({ success: false, error: "Phone number is required." })
    }
    const otp = generate()
    try {
    const otpSend = await Otp.create({ client_phone, otp })
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



app.post("/verifyotp", async (req, res) => {

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

});