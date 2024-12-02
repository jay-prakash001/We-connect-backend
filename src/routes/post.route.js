import {Router} from "express";
import {create_post, deletePost, getPersonalPost, getPostNearWorker} from "../controllers/post.controllers.js";
import { upload } from '../middlewares/multer.middleware.js';
import {verifyJwt} from "../middlewares/verifyJwt.middleware.js";

const router = Router()

router.route('/create_post').post(upload.fields(
    [{
        name:"postImg",
        maxCount:5
    }]
),verifyJwt, create_post)

router.route('/delete_post/:id').delete(verifyJwt,deletePost)


router.route("/get_user_posts").get(verifyJwt, getPersonalPost)

export default router   