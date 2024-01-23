"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAuth = (req, res, next) => {
    const authToken = req.cookies.authToken;
    const refreshToken = req.cookies.refreshToken;
    // console.log("authTOken",authToken)
    if (!authToken || !refreshToken) {
        return res.status(401).json({ message: " Authentication Failed : No authToken or refreshToken is provided " });
    }
    jsonwebtoken_1.default.verify(authToken, process.env.JWT_SECRET_KEY || "", (err, decode) => {
        if (err) {
            jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY || "", (refreshErr, refreshDecode) => {
                if (refreshErr) {
                    return res.status(401).json({ message: " Authentication Failed : Both tokens are invalid" });
                }
                else {
                    const newAuthToken = jsonwebtoken_1.default.sign({ userId: refreshDecode.userId }, process.env.JWT_SECRET_KEY || "", { expiresIn: '30m' });
                    const newRefreshToken = jsonwebtoken_1.default.sign({ userId: refreshDecode.userId }, process.env.JWT_REFRESH_SECRET_KEY || "", { expiresIn: '2h' });
                    res.cookie('authToken', newAuthToken, { httpOnly: true });
                    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
                    console.log(refreshDecode.userId, "liasd");
                    // Object.assign(req,{userId:refreshDecode?.userId})
                    req.userId = refreshDecode.userId;
                    next();
                }
            });
        }
        else {
            req.userId = decode.userId;
            next();
        }
    });
};
exports.checkAuth = checkAuth;
