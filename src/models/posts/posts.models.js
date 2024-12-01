import mongoose from "mongoose";
import { locationSchema } from "../users/workers.models.js";

const postSchema = new mongoose.Schema({

    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: locationSchema, required: true },
    imagesUrl: [{ type: String, required: true }],
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isOpen: {
        type: Boolean,
        default: true
    },
    approaches: [{ type: mongoose.Schema.Types.ObjectId, ref: "Approach" }],


}, { timestamps: true })

export const Post = new mongoose.model("Post", postSchema)