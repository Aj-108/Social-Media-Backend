"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    console.log(err);
    res.status(500).json({
        ok: false,
        message: "Internal server error",
        error: err.message,
    });
};
exports.errorHandler = errorHandler;
