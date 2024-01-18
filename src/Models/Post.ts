import mongoose,{Document,Schema,Types} from 'mongoose'

export interface commentModel {
    user : Types.ObjectId ,
    comment : String
}

export interface postModel extends  Document {
    caption : String ,
    image : Object ,
    owner : Types.ObjectId ,
    likes : Types.DocumentArray<Types.ObjectId>,
    comments : Types.DocumentArray<commentModel>,
    timestamps : Date ,
    createdAt : Date ,
    updatedAt : Date  
}

const postSchema : Schema = new mongoose.Schema ({
    caption : {
        type : String 
    },
    image : {
        public_id : String ,
        url : String
    },
    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User"
    },
    likes : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "User"
        }
    ],
    comments : [
        {
            user : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            },
            comment : {
                type : String ,
                required : true  
            }
        }
    ]
},{
    timestamps : true 
})

export default mongoose.model<postModel>('Post',postSchema)