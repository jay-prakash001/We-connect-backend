import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken";

const otpSchema = new Schema({
client_phone:{
    type : String,
    required : true,
    unique:true
},
otp :{
    type : String,
    required : true,
},
createdAt :{
    type : Date,
    default :Date.now,
    expires:120
}
},{timestamps:true})

//
// otpSchema.methods.generateAccessToken = function () {
//     return jwt.sign({
//         _id : this._id
//     },process.env.ACCESS_TOKEN_SECRET,{
//         expiresIn : process.env.ACCESS_TOKEN_EXPIRY
//     })
// }
//
// otpSchema.methods.generateRefreshToken = function () {
//     return jwt.sign({
//         _id : this._id
//     },process.env.ACCESS_TOKEN_SECRET,{
//         expiresIn : process.env.ACCESS_TOKEN_EXPIRY
//     })
// }

otpSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { phone: this.client_phone },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // Example: '15m'
    );
};

otpSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { phone: this.client_phone  },
        process.env.REFRESH_TOKEN_SECRET, // Use a different secret for refresh tokens
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // Example: '7d'
    );
};
export const Otp = mongoose.model("Otp",otpSchema);