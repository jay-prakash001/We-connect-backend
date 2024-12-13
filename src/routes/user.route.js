import { Router } from "express";
import { createWorker, setUserDetails,logOut,get_user_details,get_worker_details,update_profileImg} from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js';
import {verifyJwt} from "../middlewares/verifyJwt.middleware.js";

const  router = Router()

router.route('/create_client').patch(
    upload.fields(
        [{
            name: "profileImg",
            maxCount: 1
        }]
    ),
    verifyJwt,setUserDetails)

router.route('/create_worker').patch(
    upload.single("profileImg"),verifyJwt,
    createWorker)

router.route('/get_user_details').get(verifyJwt,get_user_details)
router.route('/get_worker_details').get(verifyJwt,get_worker_details)

router.route('/update_profileImg').patch(
    upload.single("profileImg")
,verifyJwt,update_profileImg)
router.route('/logout').post(verifyJwt,logOut)
export default router