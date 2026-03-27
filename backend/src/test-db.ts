// src/test-db.ts

import db from "./config/db";

async function testDB() {
  try {
    const [rows] = await db.query("SELECT 0");
    console.log("Connexion MySQL réussie :", rows);
  } catch (error) {
    console.error("Erreur connexion DB :", error);
  }
}

testDB();