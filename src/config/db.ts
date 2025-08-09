import { neon } from "@neondatabase/serverless"; // on importe neon pour la connexion à la base de données
import dotenv from "dotenv"; // on importe dotenv pour charger les variables d'environnement

dotenv.config(); // on charge les variables d'environnement depuis le fichier .env

export const sql = neon(process.env.DB_URL as string); // on crée une instance de la connexion à la base de données en utilisant l'URL de connexion définie dans les variables d'environnement 