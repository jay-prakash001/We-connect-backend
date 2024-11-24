import { Router } from "express";
import { getOtp, verifyOtp } from "../controllers/otp.controllers.js";

const router = Router()

router.route('/get_otp').post(getOtp)

router.route('/verify_otp').post(verifyOtp)


export default router;