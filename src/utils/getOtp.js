import twilio from 'twilio';

 
 const  generateOTP =()=>{
    const otp =  Math.floor(100000 + Math.random()* 900000)
    return otp
}


const sid = process.env.sid
const token = process.env.token
const phone = process.env.phone
const client = twilio(sid, token)

export { sid, token, client, generateOTP,phone}