"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("./db");
const user_1 = __importDefault(require("./Routes/user"));
const post_1 = __importDefault(require("./Routes/post"));
require('dotenv').config();
const app = (0, express_1.default)();
const PORT = 8000;
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use('/api/user', user_1.default);
app.use('/api/post', post_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
