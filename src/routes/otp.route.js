import { Router } from "express";
import { getOtp, verifyOtp,testUserCreation } from "../controllers/otp.controllers.js";
import twilio from 'twilio';
import {User} from '../models/users/user.models.js'
import {verifyJwt} from "../middlewares/verifyJwt.middleware.js";


const router = Router()

router.route('/get_otp').post(getOtp)
 
router.route('/verify_otp').post(verifyOtp)


router.route('/user_create_test').post(testUserCreation)

router.route('/test_tokens').get(verifyJwt,(req, res)=>{
    console.log(req.user)
    res.end()
})

export default router;