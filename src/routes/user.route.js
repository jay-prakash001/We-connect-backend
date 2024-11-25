import { Router } from "express";
import { createClient, createWorker } from "../controllers/user.controller.js";
import { upload } from '../middlewares/multer.middleware.js';

const router = Router()

router.route('/create_client').post(
    upload.fields(
        [{
            name: "profileImg",
            maxCount: 1
        }]
    ),
    createClient)
router.route('/create_worker').post(upload.fields(
    [{
        name: "profileImg",
        maxCount: 1
    }]
), createWorker)

export default router