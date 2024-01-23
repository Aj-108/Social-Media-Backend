"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUserProfile = exports.getMyProfile = exports.deleteUser = exports.updateUser = exports.updatePassword = exports.logout = exports.getFollowersPost = exports.unfollow = exports.follow = exports.login = exports.register = void 0;
const User_1 = __importDefault(require("../Models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Post_1 = __importDefault(require("../Models/Post"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        const existingUser = yield User_1.default.findOne({ email: email });
        if (existingUser)
            res.status(400).json({ ok: false, message: "User already exists" });
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedpassword = bcrypt_1.default.hashSync(password, salt);
        const newUser = yield new User_1.default({
            username, email, password: hashedpassword
        });
        yield newUser.save();
        res.status(200).json({ ok: true, message: "User registered successfully", newUser });
    }
    catch (err) {
        next(err);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.default.findOne({ email: email }).select("+password");
        if (!user) {
            return res.status(400).json({ ok: false, message: "Invalid Credentials" });
        }
        const comparePassword = yield bcrypt_1.default.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({ ok: false, message: "Invalid Credentials" });
        }
        const authToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET_KEY || " ", { expiresIn: '30m' });
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY || " ", { expiresIn: '2h' });
        res.cookie('authToken', authToken, ({ httpOnly: true }));
        res.cookie('refreshToken', refreshToken, ({ httpOnly: true }));
        res.status(200).json({ ok: true, message: "User logged in successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.login = login;
const follow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userToFollow = yield User_1.default.findById(req.params.id);
        const loggedUser = yield User_1.default.findById(req.userId);
        if (!userToFollow)
            res.status(404).json({ ok: false, message: "User not found" });
        if (userToFollow === null || userToFollow === void 0 ? void 0 : userToFollow.followers.includes(loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser._id))
            res.status(400).json({ ok: false, message: "Already Following" });
        loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.following.push(userToFollow === null || userToFollow === void 0 ? void 0 : userToFollow._id);
        userToFollow === null || userToFollow === void 0 ? void 0 : userToFollow.followers.push(loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser._id);
        yield (loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.save());
        yield (userToFollow === null || userToFollow === void 0 ? void 0 : userToFollow.save());
        res.status(201).json({ ok: true, message: "User followed" });
    }
    catch (err) {
        next(err);
    }
});
exports.follow = follow;
const unfollow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unfollowUser = yield User_1.default.findById(req.params.id);
        const loggedUser = yield User_1.default.findById(req.userId);
        if (!unfollowUser)
            res.status(404).json({ ok: false, message: "User not found" });
        if (!(unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser.followers.includes(loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser._id)))
            res.status(400).json({ ok: false, message: "Not following user already" });
        const indexFollowing = loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.following.indexOf(unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser._id);
        const indexFollower = unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser.followers.indexOf(loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser._id);
        loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.following.splice(indexFollowing, 1);
        unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser.followers.splice(indexFollower, 1);
        yield (loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.save());
        yield (unfollowUser === null || unfollowUser === void 0 ? void 0 : unfollowUser.save());
        res.status(201).json({ ok: true, message: "User unfollowed" });
    }
    catch (err) {
        next(err);
    }
});
exports.unfollow = unfollow;
const getFollowersPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.userId);
        const posts = yield Post_1.default.find({
            owner: {
                $in: user === null || user === void 0 ? void 0 : user.following
            }
        });
        res.status(200).json({ ok: true, posts });
    }
    catch (err) {
        next(err);
    }
});
exports.getFollowersPost = getFollowersPost;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('authToken');
        res.clearCookie('refreshToken');
        return res.status(200).json({ ok: true, message: "User has been logged out" });
    }
    catch (err) {
        next(err);
    }
});
exports.logout = logout;
const updatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password, new_password } = req.body;
        if (!password || !new_password)
            return res.status(400).json({ ok: false, message: "Please provide password" });
        if (req.userId != req.params.id)
            return res.status(400).json({ ok: false, message: "Cannot change details of other users" });
        const user = yield User_1.default.findById(req.userId).select("+password");
        const comparePassword = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
        if (!comparePassword) {
            return res.status(400).json({ ok: false, message: "Invalid Credentials" });
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hashedpassword = bcrypt_1.default.hashSync(new_password, salt);
        user.password = new_password;
        yield user.save();
        res.status(201).json({ ok: true, messsage: "Password updated Successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.updatePassword = updatePassword;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO AVATAR
        const { name } = req.body;
        if (req.userId != req.params.id)
            return res.status(400).json({ ok: false, message: "Cannot change details of other users" });
        const user = yield User_1.default.findById(req.userId);
        if (name)
            user.username = name;
        res.status(200).json({ ok: true, message: "Profile Successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId !== req.params.id)
            return res.status(400).json({ ok: false, message: "Cannot delete other users" });
        const user = yield User_1.default.findById(req.userId);
        const userPosts = user === null || user === void 0 ? void 0 : user.user_posts;
        const userFollwing = user === null || user === void 0 ? void 0 : user.following;
        // delete user posts 
        userPosts.array.forEach((post) => __awaiter(void 0, void 0, void 0, function* () {
            yield (Post_1.default === null || Post_1.default === void 0 ? void 0 : Post_1.default.findByIdAndDelete(post));
        }));
        // removing user following from followers
        userFollwing.forEach((userFollowers) => __awaiter(void 0, void 0, void 0, function* () {
            const following = yield User_1.default.findById(userFollowers);
            const index = following.followers.indexOf(user._id);
            const indexFollowing = following.following.indexOf(user._id);
            following === null || following === void 0 ? void 0 : following.followers.splice(index, 1);
            following === null || following === void 0 ? void 0 : following.following.splice(index, 1);
            yield following.save();
        }));
        yield (user === null || user === void 0 ? void 0 : user.remove());
        // Logging out user after deleteing id 
        res.clearCookie('authToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ ok: true, message: "User deleted" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.userId);
        res.status(200).json({ ok: true, user });
    }
    catch (err) {
        next(err);
    }
});
exports.getMyProfile = getMyProfile;
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (!user)
            res.status(400).json({ ok: false, message: "User profile not found" });
        res.status(200).json({ ok: true, user });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserProfile = getUserProfile;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.find();
        res.status(200).json({ ok: true, user });
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
