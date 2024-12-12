import asyncHandler from "../utils/asyncHandler.utils.js";
import jwt from "jsonwebtoken";
import {User} from "../models/users/user.models.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    // console.log(token);
    // try {

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // console.log(decodedToken);
        const user = await User.findOne({ username: decodedToken.username });
        if(user){
            
            req.user = user;
        }
        console.log(user);


        req.phone = decodedToken.phone;
        next()

    // } catch (err) {
    //     res.status(401).json({success: false, messaage: err})
    // }

})