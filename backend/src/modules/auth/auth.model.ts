// src/modules/auth/auth.model.ts
import db from "../../config/db";
import { RowDataPacket } from "mysql2/promise";

export interface User {
  id_user?: number;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role: "Admin" | "Finance" | "RH" | "Dev";
  date_creation?: Date;
}



// Requête typée avec RowDataPacket
export const findUserByEmail = async (email: string): Promise<User | null> => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM utilisateur WHERE email = ?",
    [email]
  );
  return rows.length ? (rows[0] as User) : null;
};

export const createUser = async (user: User) => {
  const [result] = await db.query(
    "INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role, date_creation) VALUES (?, ?, ?, ?, ?, NOW())",
    [user.nom, user.prenom, user.email, user.mot_de_passe, user.role]
  );
  return result;
};