import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log("❌ DATABASE_URL not found in .env.local");
  process.exit(1);
}

console.log("Testing pooler connection...");
console.log("URL:", connectionString.replace(/:[^:@]+@/, ":****@"));

const sql = postgres(connectionString, {
  ssl: "require",
  max: 1,
});

sql`SELECT 1 as test, current_database() as db, current_user as user`
  .then((result) => {
    console.log("✅ Connection successful!");
    console.log("Database:", result[0].db);
    console.log("User:", result[0].user);
    process.exit(0);
  })
  .catch((err: Error) => {
    console.log("❌ Connection failed:");
    console.log("   Error:", err.message);
    if (err.message.includes("password")) {
      console.log("");
      console.log("💡 Password authentication failed. Possible issues:");
      console.log("   1. Password in connection string might be incorrect");
      console.log("   2. Pooler connection might need different credentials");
      console.log("   3. Try using the direct connection string instead");
      console.log("");
      console.log("Get the correct connection string from:");
      console.log("   Supabase Dashboard → Settings → Database → Connection string");
    }
    process.exit(1);
  });

