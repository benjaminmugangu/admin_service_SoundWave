"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please Login",
            });
            return;
        }
        const { data } = await axios_1.default.get(`${process.env.User_URL}/api/v1/user/me`, {
            headers: {
                token,
            },
        });
        req.user = data; // Assurez-vous que data est de type IUser
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please Login",
        });
    }
};
exports.isAuth = isAuth;
//multer setup
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const uploadFile = (0, multer_1.default)({ storage }).single("file");
exports.default = uploadFile;
