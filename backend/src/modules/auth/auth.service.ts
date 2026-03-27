// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import { findUserByEmail, createUser } from "./auth.model";
import { User } from "./auth.model";

export const register = async (user: User) => {
  // Hash le mot de passe
  const hashedPassword = await bcrypt.hash(user.mot_de_passe, 10);
  user.mot_de_passe = hashedPassword;

  const result = await createUser(user);
  return result;
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.mot_de_passe);
  if (!valid) return null;

  return user; // ou générer un JWT
};