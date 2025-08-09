"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const express_1 = __importDefault(require("express")); // on importe 
const dotenv_1 = __importDefault(require("dotenv"));
const db_js_1 = require("./config/db.js");
const route_js_1 = __importDefault(require("./route.js"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
exports.redisClient = (0, redis_1.createClient)({
    password: process.env.Redis_Password,
    socket: {
        host: process.env.Redis_Host,
        port: Number(process.env.Redis_Port),
    },
});
exports.redisClient
    .connect()
    .then(() => console.log("connected to redis"))
    .catch(console.error);
cloudinary_1.default.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key,
    api_secret: process.env.Cloud_Api_Secret,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
async function initDB() {
    try {
        await (0, db_js_1.sql) `
        CREATE TABLE IF NOT EXISTS albums(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        await (0, db_js_1.sql) `
        CREATE TABLE IF NOT EXISTS songs(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `;
        console.log("Database initialized successfully");
    }
    catch (error) {
        console.log("Error initDb", error);
    }
}
app.use("/api/v1", route_js_1.default);
const port = process.env.PORT;
initDB().then(() => {
    app.listen(port, () => {
        console.log(`server is running on port ${port}`);
    });
});
