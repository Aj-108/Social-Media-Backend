"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/.env' });
exports.dbConnect = mongoose_1.default.connect(process.env.DB_URL || " ", {
    dbName: ((_a = process.env.DB_NAME) === null || _a === void 0 ? void 0 : _a.toString()) || " "
    // dbName : db_name
}).then(() => {
    console.log("Connected to db");
}).catch(err => {
    console.log("Error in connecting to db ", err);
});
