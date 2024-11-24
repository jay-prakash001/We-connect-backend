import mongoose, {Schema} from "mongoose";

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
    expires:300
}
},{timestamps:true})

export const Otp = mongoose.model("Otp",otpSchema);