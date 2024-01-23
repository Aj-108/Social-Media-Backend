import {RequestHandler} from 'express'
import User from '../Models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Post from '../Models/Post'

export const register : RequestHandler = async (req,res,next) => {
    try{
        const {username,email,password} = req.body ;

        const existingUser = await User.findOne({email:email}) ;

        if(existingUser) res.status(400).json({ok:false,message:"User already exists"}) ;

            const salt = bcrypt.genSaltSync(10);
            const hashedpassword =  bcrypt.hashSync(password, salt);

        const newUser =await new User({
            username,email,password:hashedpassword
        }) ;

        await newUser.save() ;
        res.status(200).json({ok:true,message:"User registered successfully",newUser}) ;
    }
    catch(err){
        next(err) ;
    }
}

export const login : RequestHandler = async (req,res,next) => {
    try{
        const {email,password} = req.body ;

        const user:any = await User.findOne({email:email}).select("+password");

        if(!user){
            return res.status(400).json({ok:false,message:"Invalid Credentials"}); 
        }

        const comparePassword = await bcrypt.compare(password,user.password) ;
        if(!comparePassword){
            return res.status(400).json({ok:false,message:"Invalid Credentials"}); 
        }

        const authToken = jwt.sign({userId : user._id},process.env.JWT_SECRET_KEY||" ",{expiresIn : '30m'}) ;
        const refreshToken = jwt.sign({userId : user._id},process.env.JWT_REFRESH_SECRET_KEY||" ",{expiresIn : '2h'}) ;

        res.cookie('authToken',authToken,({httpOnly : true})) ;
        res.cookie('refreshToken',refreshToken,({httpOnly:true})) ;

        res.status(200).json({ok:true,message:"User logged in successfully"}) ;
    }
    catch(err){
        next(err) ;
    }
}

export const follow : RequestHandler = async (req,res,next) => {
    try{
        const userToFollow = await User.findById(req.params.id) ;
        const loggedUser = await User.findById(req.userId) ;

        if(!userToFollow) res.status(404).json({ok:false,message:"User not found"}) ;

        if(userToFollow?.followers.includes(loggedUser?._id)) res.status(400).json({ok:false,message:"Already Following"}) ;

        loggedUser?.following.push(userToFollow?._id) ;
        userToFollow?.followers.push(loggedUser?._id) ;

        await loggedUser?.save() ;
        await userToFollow?.save() ;

        res.status(201).json({ok:true,message:"User followed"}) ;
    }
    catch(err){
        next(err) ;
    }
}

export const unfollow : RequestHandler = async (req,res,next) => {
    try{
        const unfollowUser = await User.findById(req.params.id) ;
        const loggedUser = await User.findById(req.userId) ;

        if(!unfollowUser) res.status(404).json({ok:false,message:"User not found"}) ;

        if(!unfollowUser?.followers.includes(loggedUser?._id)) res.status(400).json({ok:false,message:"Not following user already"}) ;

        const indexFollowing : any = loggedUser?.following.indexOf(unfollowUser?._id) ;
        const indexFollower :any  = unfollowUser?.followers.indexOf(loggedUser?._id) ;

        loggedUser?.following.splice(indexFollowing,1) ;
        unfollowUser?.followers.splice(indexFollower,1) ;

        await loggedUser?.save() ;
        await unfollowUser?.save() ;

        res.status(201).json({ok:true,message:"User unfollowed"}) ;
    }
    catch(err){
        next(err) ;
    }
}

export const getFollowersPost : RequestHandler = async (req,res,next) => {
    try{
        const user = await User.findById(req.userId) ;
        const posts = await Post.find({
            owner : {
                $in : user?.following
            }
        })

        res.status(200).json({ok:true,posts}) ;
    }
    catch(err){
        next(err) ;
    }
}

export const logout : RequestHandler = async (req,res,next) => {
    try{
        res.clearCookie('authToken') ;
        res.clearCookie('refreshToken') ;
        
        return res.status(200).json({ok:true,message:"User has been logged out"}) ;
    }
    catch(err){
        next(err) ;
    }
} 

export const updatePassword : RequestHandler = async (req,res,next) => {
    try {
        const {password,new_password} = req.body ;

        if(!password || !new_password) return res.status(400).json({ok:false,message:"Please provide password"}) ;

        if(req.userId != req.params.id) return res.status(400).json({ok:false,message:"Cannot change details of other users"}) ;

        const user:any = await User.findById(req.userId).select("+password") ;

        const comparePassword = await bcrypt.compare(password,user?.password) ;
        if(!comparePassword){
            return res.status(400).json({ok:false,message:"Invalid Credentials"}); 
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedpassword =  bcrypt.hashSync(new_password, salt);

        user.password = hashedpassword ;
        await user.save() ;

        res.status(201).json({ok:true,messsage:"Password updated Successfully"}) ;

    }
    catch(err){
        next(err) ;
    }
}

export const updateUser  :RequestHandler = async (req,res,next) => {
    try{
        // TODO AVATAR
        const {name} = req.body ;
        if(req.userId != req.params.id) return res.status(400).json({ok:false,message:"Cannot change details of other users"}) ;
        if(!name) return res.status(400).json({ok:false,message:"Please provide user details"}) ;

        const user:any =await  User.findById(req.userId) ;

        if(name) user.username = name  ;
        await user.save() ;

        res.status(200).json({ok:true,message:"Profile Updated Successfully"})

    }
    catch(err){
        next(err) ;
    } 
}

export const deleteUser : RequestHandler = async(req,res,next) => {
    try{
        if(req.userId !== req.params.id) return res.status(400).json({ok:false,message:"Cannot delete other users"}) ;

        const user:any =await  User.findById(req.userId) ;

        const userPosts = user?.user_posts ;     
        const userFollwing = user?.following ;    

        // delete user posts 
        userPosts.forEach(async (post:any) => {
            console.log(post);
            await Post?.findByIdAndDelete(post) ;
        });


        // removing user following from followers
        userFollwing.forEach(async (userFollowers:any) => {
            const following:any = await User.findById(userFollowers) ;
            const index = following.followers.indexOf(user._id) ;
            const indexFollowing = following.following.indexOf(user._id) ;
            following?.followers.splice(index,1) ;
            following?.following.splice(index,1) ;

            await following.save() ;
        })


        await User.findByIdAndDelete(req.userId) ;

        // Logging out user after deleteing id 
        res.clearCookie('authToken') ;
        res.clearCookie('refreshToken') ;

        res.status(200).json({ok:true,message:"User deleted"})


    }
    catch(err){
        next(err) ;
    }
}


export const getMyProfile : RequestHandler = async (req,res,next) => {
    try{
        const user = await User.findById(req.userId) ;
        res.status(200).json({ok:true,user}) ;
    }
    catch(err){
        next(err) ;
    }
}

export const getUserProfile : RequestHandler = async (req,res,next) => {
    try{
        const user = await User.findById(req.params.id) ;
        if(!user) res.status(400).json({ok:false,message:"User profile not found"}) ;
        res.status(200).json({ok:true,user}) ;
    }
    catch(err){
        next(err) ;
    }
}


export const getAllUsers : RequestHandler = async (req,res,next) => {
    try{
        const user = await User.find() ;
        res.status(200).json({ok:true,user}) ;
    }
    catch(err){
        next(err) ;
    }
}


