import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();

const dbConnect = async () =>{
    try{
        await mongoose.connect(process.env.MONGODB_URI,{})
        console.log("DB connected succesfully");

    }catch(error){
        console.error("Error Connecting to DB");
        process.exit();
    }
}

export default dbConnect;