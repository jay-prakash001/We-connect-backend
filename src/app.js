import express from 'express';
const app = express()

app.use(express.json())

import otpRouter from './routes/otp.route.js';
import userRouter from './routes/user.route.js';
app.use("/api/v1/auth/",otpRouter)
app.use("/api/v1/user/",userRouter)


export default app; 
