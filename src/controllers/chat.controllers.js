import { Approach } from "../models/posts/approaches.models.js";
import { Chat } from "../models/posts/chat.models.js";
import { User } from "../models/users/user.models.js";
import { ApiError } from "../utils/ApiError.utils.js";
import { ApiResponse } from "../utils/ApiResponse.utils.js";
import asyncHandler from "../utils/asyncHandler.utils.js";
import mongoose from "mongoose";
const sendChat = asyncHandler(async (req, res) => {

    console.log(req.body);
    try {
        const { senderId, recieverId, approachId, content } = req.body

        if (!senderId || !recieverId || !approachId || !content) {
            throw new ApiError(400, "all fields are required ")
        }
        const sender = await User.findById({ _id: new mongoose.Types.ObjectId(senderId) })

        const reciever = await User.findById({ _id: new mongoose.Types.ObjectId(recieverId) })

        // console.log(sender)
        // console.log("_-----------------_")

        // console.log(reciever)
        const approach = await Approach.findById({ _id: new mongoose.Types.ObjectId(approachId) })

        // console.log("----------------")
        // console.log(approach)

        if (!sender || !reciever || !approach) {
            throw new ApiError(400, "invalid details")
        }
        const chat = await Chat.create({
            senderId: sender._id, recieverId: reciever._id, approachId: approach._id, content: content
        })

        // console.log(chat)

        // const populatedChat = await Chat.find({ senderId: sender._id }).populate('senderId')       // Populate sender details
        //     .populate('recieverId')     // Populate receiver details
        //     .populate('approachId');
        // console.log(populatedChat)

        return res.status(201).json(new ApiResponse(200, chat, "message send successfully"))

    } catch (error) {
        console.log(error)
    }
    res.end()
})


const getChat = asyncHandler(async (req, res) => {

    const user = req.user
    console.log(user)
    const chats = await Chat.find({ 
        $or:[
            {recieverId : user._id},
            {senderId : user._id}
        ]


    })
    .populate('senderId')       // Populate sender details
        .populate('recieverId')     // Populate receiver details
        .populate('approachId');
    console.log(chats)

    return res.status(200).json(new ApiResponse(200, chats, "chats fetched successfully"))

    res.end()
})

export { sendChat, getChat }