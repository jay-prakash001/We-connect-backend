import express from 'express';
import { generateOTP } from './utils/getOtp.js';

export const app = express()

app.use(express.json())


app.get('/',(req, res)=>{
    console.log('hello')
    res.send('hello')
    
})
app.get('/route',(req, res)=>{
    const otp = generateOTP()
    
    console.log(otp)
    console.log('route')
    res.send(`otp is : ${otp}`)
})

