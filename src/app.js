import express from 'express';
import cors from 'cors';
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: true }))
import otpRouter from './routes/otp.route.js';
import userRouter from './routes/user.route.js';
import postRouter from './routes/post.route.js';
import approachRouter from './routes/approach.route.js'
import cookieParser from "cookie-parser";

import chatRouter from './routes/chat.route.js'
app.use("/api/v1/auth/",otpRouter) // all work done


// verify jwt tokens 

app.use("/api/v1/user/",userRouter)
app.use("/api/v1/post/",postRouter)
app.use("/api/v1/approach",approachRouter)
app.use("/api/v1/chat", chatRouter)

app.get("/",(req, res)=>{

    return res.status(200).json("hello")
})

 
export default app; 
