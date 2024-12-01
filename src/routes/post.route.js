import {Router} from "express";
import { create_post } from "../controllers/post.controllers.js";
import { upload } from '../middlewares/multer.middleware.js';
import {verifyJwt} from "../middlewares/verifyJwt.middleware.js";

const router = Router()

router.route('/create_post').post(upload.fields(
    [{
        name:"postImg",
        maxCount:5
    }]
),verifyJwt, create_post)


export default router   