import "dotenv/config";
import path from "node:path";

export default {
  earlyAccess: true,
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaPostgres } = await import("@prisma/adapter-postgres");
      const { Pool } = await import("pg");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      return new PrismaPostgres(pool);
    },
  },
};

