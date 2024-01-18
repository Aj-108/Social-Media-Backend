import { Router, Request, Response } from "express";
import { errorHandler } from "../Middleware/errorMiddleware";
import { register,login, follow, unfollow } from "../Controllers/user";
import { checkAuth } from "../Middleware/authMiddleware";

const router = Router()

router.post('/register',register)
router.post('/login',login)
router.get('/follow/:id',checkAuth,follow) ;
router.get('/unfollow/:id',checkAuth,unfollow) ;

router.use(errorHandler) ;
 



export default router 