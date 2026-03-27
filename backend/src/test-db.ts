import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT) || 3306,
    });
    const [rows] = await connection.query("SELECT NOW() as now");
    console.log(rows);
    await connection.end();
  } catch (err) {
    console.error("Erreur connexion DB:", err);
  }
}

test();