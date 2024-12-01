
import asyncHandler from "../utils/asyncHandler.utils.js";

const create_post = asyncHandler(async (req, res)=>{

    console.log(req.body)
    console.log(req.files)
    console.log(req.phone)

    
res.end()
})


export {create_post}