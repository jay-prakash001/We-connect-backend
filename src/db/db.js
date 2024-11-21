import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'
export const dbConnect = async () => {

try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`) 
    console.log('mongoDB connected Successfully.')
} catch (error) { 
    
    console.log('mongoDB connection failed.') 
    console.log(error)
}
 
}    