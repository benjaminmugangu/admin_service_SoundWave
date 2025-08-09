"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sql = void 0;
const serverless_1 = require("@neondatabase/serverless"); // on importe neon pour la connexion à la base de données
const dotenv_1 = __importDefault(require("dotenv")); // on importe dotenv pour charger les variables d'environnement
dotenv_1.default.config(); // on charge les variables d'environnement depuis le fichier .env
exports.sql = (0, serverless_1.neon)(process.env.DB_URL); // on crée une instance de la connexion à la base de données en utilisant l'URL de connexion définie dans les variables d'environnement 
