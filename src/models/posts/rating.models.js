
import  mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
    transactionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        required: true
    },
    clientRating: {
        score: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    },
    workerRating: {
        score: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String
    }
}, { timestamps: true });

export const Rating = mongoose.model("Rating", ratingSchema);
