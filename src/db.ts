import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ path: __dirname+'/.env' }) ;


export const  dbConnect =  mongoose.connect(process.env.DB_URL||" ",{
    dbName : process.env.DB_NAME?.toString() || " "
    // dbName : db_name
}).then(() => {
    console.log("Connected to db") ;
}).catch(err => {
    console.log("Error in connecting to db ",err) ;
})  
