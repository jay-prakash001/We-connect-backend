import dotenv from 'dotenv';
import { dbConnect } from './db/db.js';
import app from './app.js';

dotenv.config({
    path:'./env'
})
const port = process.env.PORT || 3000
dbConnect().then(()=>{
    app.listen(port,()=>{
        console.log('app is running on port ', port)

    })
}).catch((error)=>{
    console.log('error',error)
})