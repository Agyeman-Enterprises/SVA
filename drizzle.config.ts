import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// Use connection string if available, otherwise fall back to individual components
const connectionString = process.env.DATABASE_URL;

export default {
  schema: "./db/schema/*.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: connectionString
    ? {
        url: connectionString,
      }
    : {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT || "5432"),
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "sva_lms",
        ssl: process.env.DB_SSL === "true",
      },
} satisfies Config;

