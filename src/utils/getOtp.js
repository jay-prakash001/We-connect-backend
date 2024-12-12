import twilio from 'twilio';

 
 const  generateOTP =()=>{
    const otp =  Math.floor(100000 + Math.random()* 900000)
    return otp
}


// const sid = process.env.SID
// const token = process.env.TOKEN
// const phone = process.env.PHONE
// const client = twilio(sid, token)


const accountSid = process.env.SID
const authToken = process.env.TOKEN
const verifyServiceSid = process.env.SERVICE_ID

const client = twilio(accountSid, authToken)

export { client,verifyServiceSid}