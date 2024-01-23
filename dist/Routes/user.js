"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorMiddleware_1 = require("../Middleware/errorMiddleware");
const user_1 = require("../Controllers/user");
const authMiddleware_1 = require("../Middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', user_1.register);
router.post('/login', user_1.login);
router.put('/changepassword/:id', authMiddleware_1.checkAuth, user_1.updatePassword);
router.put('/updateuser/:id', authMiddleware_1.checkAuth, user_1.updateUser);
router.delete('/deleteuser/:id', authMiddleware_1.checkAuth, user_1.deleteUser);
router.get('/logout', user_1.logout);
router.get('/follow/:id', authMiddleware_1.checkAuth, user_1.follow);
router.get('/unfollow/:id', authMiddleware_1.checkAuth, user_1.unfollow);
router.get('/userlisting', user_1.getAllUsers);
router.get('/profile/:id', user_1.getUserProfile);
router.get('/profile', authMiddleware_1.checkAuth, user_1.getMyProfile);
router.use(errorMiddleware_1.errorHandler);
exports.default = router;