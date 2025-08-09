"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSong = exports.deleteAlbum = exports.addThumbnail = exports.addSong = exports.addAlbum = void 0;
const TryCatch_js_1 = __importDefault(require("./TryCatch.js"));
const dataUri_js_1 = __importDefault(require("./config/dataUri.js"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const db_js_1 = require("./config/db.js");
const index_js_1 = require("./index.js");
exports.addAlbum = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { title, description } = req.body;
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const fileBuffer = (0, dataUri_js_1.default)(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary_1.default.v2.uploader.upload(fileBuffer.content, {
        folder: "albums",
    });
    const result = await (0, db_js_1.sql) `
   INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
  `;
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("albums");
        console.log("Cache invalidated for albums");
    }
    res.json({
        message: "Album Created",
        album: result[0],
    });
});
exports.addSong = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { title, description, album } = req.body;
    const isAlbum = await (0, db_js_1.sql) `SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const fileBuffer = (0, dataUri_js_1.default)(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary_1.default.v2.uploader.upload(fileBuffer.content, {
        folder: "songs",
        resource_type: "video",
    });
    const result = await (0, db_js_1.sql) `
    INSERT INTO songs (title, description, audio, album_id) VALUES
    (${title}, ${description}, ${cloud.secure_url}, ${album})
  `;
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("songs");
        console.log("Cache invalidated for songs");
    }
    res.json({
        message: "Song Added",
    });
});
exports.addThumbnail = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const song = await (0, db_js_1.sql) `SELECT * FROM songs WHERE id = ${req.params.id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    const file = req.file;
    if (!file) {
        res.status(400).json({
            message: "No file to upload",
        });
        return;
    }
    const fileBuffer = (0, dataUri_js_1.default)(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.status(500).json({
            message: "Failed to generate file buffer",
        });
        return;
    }
    const cloud = await cloudinary_1.default.v2.uploader.upload(fileBuffer.content);
    const result = await (0, db_js_1.sql) `
    UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
  `;
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("songs");
        console.log("Cache invalidated for songs");
    }
    res.json({
        message: "Thumbnail added",
        song: result[0],
    });
});
exports.deleteAlbum = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { id } = req.params;
    const isAlbum = await (0, db_js_1.sql) `SELECT * FROM albums WHERE id = ${id}`;
    if (isAlbum.length === 0) {
        res.status(404).json({
            message: "No album with this id",
        });
        return;
    }
    await (0, db_js_1.sql) `DELETE FROM songs WHERE album_id = ${id}`;
    await (0, db_js_1.sql) `DELETE FROM albums WHERE id = ${id}`;
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("albums");
        console.log("Cache invalidated for albums");
    }
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("songs");
        console.log("Cache invalidated for songs");
    }
    res.json({
        message: "Album deleted successfully",
    });
});
exports.deleteSong = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        res.status(401).json({
            message: "You are not admin",
        });
        return;
    }
    const { id } = req.params;
    const song = await (0, db_js_1.sql) `SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
        res.status(404).json({
            message: "No song with this id",
        });
        return;
    }
    await (0, db_js_1.sql) `DELETE FROM  songs WHERE id = ${id}`;
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("songs");
        console.log("Cache invalidated for songs");
    }
    res.json({
        message: "Song deleted successfully",
    });
});
