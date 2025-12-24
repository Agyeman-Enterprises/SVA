import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log("Testing connection to:", process.env.DB_HOST);
console.log("");

const sql = postgres(connectionString, {
  ssl: process.env.DB_SSL === "true" ? "require" : false,
  max: 1,
});

sql`SELECT 1 as test`
  .then(() => {
    console.log("✅ Connection successful!");
    process.exit(0);
  })
  .catch((err: Error) => {
    console.log("❌ Connection failed:");
    console.log("   Error:", err.message);
    console.log("");
    console.log("Possible issues:");
    console.log("   1. Project reference might be incorrect");
    console.log("   2. Supabase project might not be fully provisioned");
    console.log("   3. Network/DNS issue");
    console.log("");
    console.log("Verify in Supabase Dashboard:");
    console.log("   - Project Settings → Database → Connection string");
    process.exit(1);
  });

