import { Router, Request, Response } from "express";
import { errorHandler } from "../Middleware/errorMiddleware";
import { checkAuth } from "../Middleware/authMiddleware";
import { deletePost, getPost, updateCaption, updateLikes, uploadPost, uploadComment} from "../Controllers/post";

const router = Router()

router.post('/upload/:id',checkAuth,uploadPost) ;
router.get('/like/:id',checkAuth,updateLikes) ;
router.delete('/delete/:id',checkAuth,deletePost) ;
router.put('/update/:id',checkAuth,updateCaption) ;
router.post('/comment/:id',uploadComment)
router.get('/:id',getPost) ;


router.use(errorHandler) ;

export default router 