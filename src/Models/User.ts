import mongoose,{Document,Schema,Types} from 'mongoose'

export interface userModel extends Document {
    username : String ,
    email : String ,
    passwrod : String ,
    user_posts : Types.ObjectId[],
    followers : Types.ObjectId[],
    following : Types.ObjectId[],
}

const userSchema : Schema = new mongoose.Schema({
    username : {
        type : String ,
        required : true,
        unique : true 
    },
    email : {
        type : String ,
        required : true,
        unique : true
    },
    password : {
        type : String ,
        required : true,
        select : false  
    },
    user_posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    followers : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ],
    following : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Post"
        }
    ]
})


export default mongoose.model<userModel>('User',userSchema)