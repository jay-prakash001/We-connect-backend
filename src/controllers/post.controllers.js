import asyncHandler from "../utils/asyncHandler.utils.js";
import uploadOnCloudinary from "../utils/cloudinary.utils.js";
import {Post} from "../models/posts/posts.models.js";
import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.utils.js";


const create_post = asyncHandler(async (req, res) => {
    const {title, description, lat, long, city, state, pin_code} = req.body;
    console.log(req.body)
    const localImages = req.files?.postImg || []
    const paths = await Promise.all(
        localImages.map(async (localImage) => {
            const url = await uploadOnCloudinary(localImage.path);
            return url.url;
        })
    );

    const post = await Post.create({
        title,
        description,
        location: {
            lat,
            long,
            city,
            state,
            pin_code
        },
        imagesUrl: paths,
        client: new mongoose.Types.ObjectId(req.user._id)
    })
    console.log(post);
    res.end()
})


const deletePost = asyncHandler(async (req, res) => {

    const {id} = req.params;
    console.log(id);
    if (!id) {
        throw new ApiError(404, " post id is required");

    }


    const user = req.user;

    if (!user) {
        throw new ApiError(404, " Unauthorized access token");
    }
    const post = await Post.findByIdAndDelete(id)

    if (!post) {
        throw new ApiError(400, " post not found");
    }
    console.log(post);

    res.end()
})

const getPersonalPost = asyncHandler(async (req, res) => {
    const user = req.user;
    const posts = await Post.aggregate([
        {
            $match: {
                from :new mongoose.Types.ObjectId(req.user._id)
            }
        }
    ])

    console.log(posts);
    res.end(posts);

})
const getPostNearWorker = asyncHandler(async (req, res) => {


})
export {create_post, deletePost,getPostNearWorker,getPersonalPost};