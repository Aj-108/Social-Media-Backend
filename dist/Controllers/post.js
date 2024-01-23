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
exports.updateCaption = exports.updateLikes = exports.deletePost = exports.uploadPost = void 0;
const Post_1 = __importDefault(require("../Models/Post"));
const User_1 = __importDefault(require("../Models/User"));
const uploadPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.userId != req.params.id)
            res.status(400).json({ ok: false, message: "Cannot post on another account" });
        const newPostData = {
            caption: req.body.caption,
            owner: req.userId,
            image: {
                public_id: "image_id",
                url: "image_url"
            }
        };
        const newPost = yield new Post_1.default(newPostData);
        yield newPost.save();
        const user = yield User_1.default.findById(req.userId);
        // console.log(req.userId)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const userPosts = user.user_posts;
        user.user_posts.push(newPost._id);
        yield user.save();
        res.status(200).json({ ok: true, message: "post created successfully", newPost });
    }
    catch (err) {
        next(err);
    }
});
exports.uploadPost = uploadPost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (!post)
            return res.status(404).json({ ok: false, message: "Post is not found" });
        if ((post === null || post === void 0 ? void 0 : post.owner.toString()) !== ((_a = req.userId) === null || _a === void 0 ? void 0 : _a.toString()))
            return res.status(400).json({ ok: false, message: "Cannot delete post of other user" });
        const deletedPost = yield Post_1.default.findByIdAndDelete(req.params.id);
        const user = yield User_1.default.findById(req.userId);
        const index = user.user_posts.indexOf(req.params.id);
        user.user_posts.splice(index, 1);
        yield user.save();
        return res.status(200).json({ ok: true, message: "post deleted successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.deletePost = deletePost;
const updateLikes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield Post_1.default.findById(req.params.id);
        if (!post)
            res.status(404).json({ ok: false, message: "Post is not found" });
        if (post.likes.length > 0 && post.likes.includes(req.userId)) {
            const index = post.likes.indexOf(req.userId);
            post.likes.splice(index, 1);
            yield post.save();
            return res.status(200).json({ ok: false, message: "Post unliked" });
        }
        post.likes.push(req.userId);
        post.save();
        return res.status(200).json({ ok: true, message: "post liked successfully" });
    }
    catch (err) {
        next(err);
    }
});
exports.updateLikes = updateLikes;
const updateCaption = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const [updatedCaption] = req.body;
        const post = yield Post_1.default.findById(req.params.id);
        if (!post) {
            res.status(404).json({ ok: false, message: "Post not found" });
        }
        if ((post === null || post === void 0 ? void 0 : post.owner.toString()) !== ((_b = req.userId) === null || _b === void 0 ? void 0 : _b.toString()))
            res.status(400).json({ ok: false, message: "Cannot change post of other user" });
        post.caption = exports.updateCaption;
        yield post.save();
        res.status(200).json({ ok: false, message: "Caption Updated" });
    }
    catch (err) {
        next(err);
    }
});
exports.updateCaption = updateCaption;
