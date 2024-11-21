import mongoose from "mongoose";
import {locationSchema} from "../users/client.models.js";

const postSchema = new mongoose.Schema({

    title: {type: String, required: true},
    description: {type: String, required: true},
    location: {type: locationSchema, required: true},
    imagesUrl: [{type: String, required: true}],
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true},
    isOpen: {
        type: Boolean,
        default: false
    },
    approaches:[{type: mongoose.Schema.Types.ObjectId, ref: "Approach"}],


}, {timestamps: true})

export const Post = new mongoose.model("Post", postSchema)