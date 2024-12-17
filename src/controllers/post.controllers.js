import asyncHandler from "../utils/asyncHandler.utils.js";
import  { uploadImagesToCloudinary } from "../utils/cloudinary.utils.js";
import { Post } from "../models/posts/posts.models.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";




const create_post = asyncHandler(async (req, res) => {
    const { title, description, lat, long, city, state, pin_code } = req.body;

    const localImages = req.files?.postImg || []

    if (!title || !description || !lat || !long || !city || !state || !pin_code) {
        throw new ApiError(400, "all fields are required")
    }
    try {
       
      const paths=  await uploadImagesToCloudinary(localImages);

        if (paths.length === 0) {
            throw new ApiError(500, "something went wrong ")
        }
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
        return res.status(201).json(
            new ApiResponse(201, { post }, "post created successfully")
        )
    } catch (error) {
        throw new ApiError(500, "something went wrong ", error)
    }
})


const deletePost = asyncHandler(async (req, res) => {

    const { id } = req.params;
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
    const client = req.user._id; // Extract client ID from the authenticated user
    try {
        // Use aggregation pipeline to filter posts
        const posts = await Post.aggregate([
            {
                $match: {
                    client: new mongoose.Types.ObjectId(client), // Match client field to user ID
                },
            },
        ]);

        console.log("Fetched posts:", posts);

        // Send successful response
        return res.status(200).json({
            status: 200,
            data: posts,
            message: "Posts fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching posts via aggregate:", error);

        // Send error response
        return res.status(500).json({
            status: 500,
            message: "Failed to fetch posts",
            error: error.message,
        });
    }
});

const getPersonalPost0 = asyncHandler(async (req, res) => {


    const user = req.user;


    const client = req.user._id
    try {
        const posts = await Post.find({ client })
        console.log(posts);
    } catch (error) {
        console.error("Aggregation error:", error);
    }
    res.end()

})
const getPostNearWorker = asyncHandler(async (req, res) => {
    const client = req.user._id; // Extract client ID from the authenticated user
    const { lat, long, city, pin_code, distance } = req.body;

    try {
        // Define location filter for geospatial query
        let locationFilter = {};

        // If lat and long are provided, filter posts based on proximity
        if (lat && long) {
            locationFilter['location.coordinates'] = {
                $geoWithin: {
                    $centerSphere: [
                        [parseFloat(long), parseFloat(lat)], // Longitude, Latitude
                        distance / 6378.1 // 20 km radius, converted to radians
                    ]
                }
            };
        }

        // Use aggregation pipeline to filter posts
        const posts = await Post.aggregate([
            {
                $match: {
                    client: new mongoose.Types.ObjectId(client), // Match client field to user ID
                },
            },
            {
                $match: locationFilter // Apply location filter if lat and long are provided
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'client'
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    location: 1,
                    imagesUrl: 1,
                    client: {
                        name: 1,
                        phone: 1,
                        profileImg: 1
                    },
                    isOpen: 1,
                    approaches: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        console.log("Fetched posts:", posts);

        // Send successful response
        return res.status(200).json({
            status: 200,
            data: posts,
            message: "Posts fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching posts via aggregate:", error);

        // Send error response
        return res.status(500).json({
            status: 500,
            message: "Failed to fetch posts",
            error: error.message,
        });
    }

})
export { create_post, deletePost, getPostNearWorker, getPersonalPost };