import { Router, Request, Response } from "express";
import { errorHandler } from "../Middleware/errorMiddleware";
import { register,login, follow, unfollow, logout, updatePassword, updateUser, deleteUser, getAllUsers, getUserProfile, getMyProfile } from "../Controllers/user";
import { checkAuth } from "../Middleware/authMiddleware";

const router = Router()

router.post('/register',register)
router.post('/login',login)
router.put('/changepassword/:id',checkAuth,updatePassword)  
router.put('/updateuser/:id',checkAuth,updateUser)
router.delete('/deleteuser/:id',checkAuth,deleteUser)
router.get('/logout',logout) ;
router.get('/follow/:id',checkAuth,follow) ;
router.get('/unfollow/:id',checkAuth,unfollow) ;
router.get('/userlisting',getAllUsers) ;
router.get('/profile/:id',getUserProfile) ;
router.get('/profile',checkAuth,getMyProfile);

router.use(errorHandler) ;
 



export default router 