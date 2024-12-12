import { response } from "express"
import { User } from "../models/users/user.models.js"
import asyncHandler from "../utils/asyncHandler.utils.js"
import { client ,verifyServiceSid} from "../utils/getOtp.js"
import { ApiError } from '../utils/ApiError.utils.js';
import { ApiResponse } from '../utils/ApiResponse.utils.js';
import { profileImg } from "../utils/utils.js";





const generateAccessAndRefreshTokens = async (phone) => {
    
    try {
        const user = await User.findOne({phone})
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
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
    try { 
        
     
       client.verify.v2.services(verifyServiceSid)
     .verifications
     .create({
       to: `+91${client_phone}`,
       channel: 'sms', 
     })
     .then(verification => {
       console.log('Verification sent:', verification.status);
     })
     .catch(error => {
       console.error('Error sending OTP:', error);
     });
   
     res.status(200).json({success:true, message : 'otp sent'})
    } catch (error) {
        res.write(error) 
        res.status(400).json({success:false, message:error})
    }
    res.end()
})

const verifyOtp = asyncHandler(async (req, res) => {
  const { client_phone, otp } = req.body;

  if (!client_phone || !otp) {
    return res.status(400).json({ success: false, error: "Phone number and OTP are required" });
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks.create({
        to: `+91${client_phone}`,
        code: otp,
      });

    if (verificationCheck.status === 'approved') {
      console.log('OTP verified successfully!');

      let existingUser = await User.findOne({ phone: client_phone });
      if (!existingUser) {
        existingUser = await User.create({
          name: `${client_phone}@weconnect`,
          profileImg: profileImg,
          phone: client_phone,
          refreshToken: "",
        });
      }

      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(client_phone);

      const options = {
        httpOnly: true,
        secure: true,
      };

      existingUser.refreshToken = refreshToken;
      await existingUser.save({ validateBeforeSave: false });

      return res.status(201)
        // Uncomment cookies if needed
        // .cookie("accessToken", accessToken, options)
        // .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: existingUser, refreshToken, accessToken }, "User fetched successfully"));
    } else {
      console.log('OTP verification failed.');
      return res.status(400).json({ error: 'OTP verification failed.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ success: false, message: 'An error occurred during OTP verification.', error });
  }
});

const verifyOtp0 = asyncHandler(async(req, res) =>{

    const { client_phone, otp } = req.body; 
    if (!client_phone || !otp) {
        return res.status(400).json({ success: false, error: "Phone number and OTP are required" });
    }

    try {
        
      client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({
        to: `+91${client_phone}`,
        code: otp
      })
      .then(async verificationCheck => {
        if (verificationCheck.status === 'approved') {
          console.log('OTP verified successfully!');
    
          let existingUser = await User.findOne({ phone: client_phone });
          if (!existingUser) {
            existingUser = await User.create({
              name: `${client_phone}@weconnect`,
              profileImg: profileImg,
              phone: client_phone,
              refreshToken: ""
            });
          }
    
          const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(client_phone);
    
          const options = {
            httpOnly: true,
            secure: true
          };
    
          existingUser.refreshToken = refreshToken;
          await existingUser.save({ validateBeforeSave: false });
    
          return res.status(201)
            // .cookie("accessToken", accessToken, options)
            // .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, { user: existingUser, refreshToken, accessToken }, "User fetched successfully"));
        } else {
          console.log('OTP verification failed.');
          return res.status(400).json({ error: 'OTP verification failed.' });
        }
      })
      .catch(error => {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ error: 'An error occurred during OTP verification.' });
      });
    

    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, messaage : error})
    }

    res.end()

})
const testUserCreation = asyncHandler(async(req,res)=>{
  const {client_phone} = req.body

  const user = await User.create({
    name: `${client_phone}@weconnect`, profileImg: profileImg, phone: client_phone, refreshToken:"123"
  })

  console.log(user)
  const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(client_phone)
            
            // console.log(accessToken)
            // console.log("xxxxxxxxxxxxxxxx")
            // console.log(refreshToken)
            

            const options = {
                httpOnly: true, secure: true
            }

            user.refreshToken = refreshToken
            user.save({validateBeforeSave:false})
            console.log(user)

            return res.status(201).cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options).json(
                new ApiResponse(200, {user : user, refreshToken, accessToken}, "user fetched successfully")
            )

           
  res.end()
})
export { getOtp, verifyOtp,testUserCreation }