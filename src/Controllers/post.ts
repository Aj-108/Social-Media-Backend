import {RequestHandler} from 'express'
import Post from '../Models/Post';
import User from '../Models/User';

export const uploadPost : RequestHandler =async (req,res,next) => {
    try{
        if(req.userId != req.params.id) res.status(400).json({ok:false,message:"Cannot post on another account"}) ;

        const newPostData = {
            caption : req.body.caption,
            owner : req.userId,
            image : {
                public_id : "image_id" ,
                url : "image_url"
            }
        }

        const newPost = await new Post(newPostData) ;
        await newPost.save() ;

        const user:any =await User.findById(req.userId) ;
        // console.log(req.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userPosts = user.user_posts;
        user.user_posts.push(newPost._id) ;
        await user.save() ;
        res.status(200).json({ok:true,message:"post created successfully",newPost}) ;

    }
    catch(err){
        next(err) ;
    }
}

export const deletePost:RequestHandler = async (req,res,next) => {
    try{
        const post:any = await Post.findById(req.params.id) ;
        if(!post) return res.status(404).json({ok:false,message:"Post is not found"}) ;

        if(post?.owner.toString() !== req.userId?.toString() )return  res.status(400).json({ok:false,message:"Cannot delete post of other user"}) ;
        const deletedPost = await Post.findByIdAndDelete(req.params.id) ;
        
        const user:any = await User.findById(req.userId) ;

        const index = user.user_posts.indexOf(req.params.id) ;
        user.user_posts.splice(index,1) ;
        await user.save() ;

        return res.status(200).json({ok:true,message:"post deleted successfully"}) ;
    }
    catch(err){
        next(err) ;
    }
}


export const updateLikes : RequestHandler =async (req,res,next) => {
    try{
        const post : any =await Post.findById(req.params.id) ;
        if(!post) res.status(404).json({ok:false,message:"Post is not found"}) ;


        if( post.likes.length > 0 && post.likes.includes(req.userId)){
            const index = post.likes.indexOf(req.userId) ;
            post.likes.splice(index,1) ;
            await post.save() ;
            return res.status(200).json({ok:false,message:"Post unliked"})
        }

        post.likes.push(req.userId) ;
        post.save() ;
        return res.status(200).json({ok:true,message:"post liked successfully"}) ;

    }
    catch(err){
        next(err) ;
    }
}