import db from "../../config/db";

export const getUsers = async () => {
  const [rows] = await db.query("SELECT * FROM utilisateur");
  return rows;
};
