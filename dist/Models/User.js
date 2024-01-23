"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    user_posts: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    followers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post"
        }
    ],
    following: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});
exports.default = mongoose_1.default.model('User', userSchema);