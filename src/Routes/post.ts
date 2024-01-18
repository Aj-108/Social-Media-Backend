import { Router, Request, Response } from "express";
import { errorHandler } from "../Middleware/errorMiddleware";
import { checkAuth } from "../Middleware/authMiddleware";
import { deletePost, updateLikes, uploadPost } from "../Controllers/post";

const router = Router()

router.post('/upload/:id',checkAuth,uploadPost) ;
router.get('/like/:id',checkAuth,updateLikes) ;
router.delete('/delete/:id',checkAuth,deletePost) ;

router.use(errorHandler) ;

export default router 