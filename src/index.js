import dotenv from 'dotenv';
import { dbConnect } from './db/db.js';
import { app } from './app.js';

dotenv.config({
    path:'./env'
})

dbConnect().then(()=>{
    app.listen(8000,()=>{
        console.log('app is running on port 8000')

    })
}).catch((error)=>{
    console.log('error',error)
})