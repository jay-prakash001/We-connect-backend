import twilio from 'twilio';

 
 const  generateOTP =()=>{
    const otp =  Math.floor(100000 + Math.random()* 900000)
    return otp
}


const sid = process.env.SID
const token = process.env.TOKEN
const phone = process.env.PHONE
const client = twilio(sid, token)

export { sid, token, client, generateOTP,phone}