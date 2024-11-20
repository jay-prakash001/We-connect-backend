import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'
export const dbConnect = async () => {

try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
} catch (error) {
    
}
    


}