import express from 'express';
const app = express()

app.use(express.json())

import otpRouter from './routes/otp.route.js';

app.use("/api/v1/",otpRouter)


export default app;
