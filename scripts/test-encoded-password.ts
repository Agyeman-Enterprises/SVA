import postgres from "postgres";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log("❌ DATABASE_URL not found");
  process.exit(1);
}

console.log("Testing connection with encoded password...");
console.log("Connection string (masked):", connectionString.replace(/:[^:@]+@/, ":****@"));

// The postgres library should automatically decode URL-encoded passwords
const sql = postgres(connectionString, {
  ssl: "require",
  max: 1,
});

sql`SELECT 1 as test, current_database() as db, current_user as user`
  .then((result) => {
    console.log("\n✅ Connection successful!");
    console.log("Database:", result[0].db);
    console.log("User:", result[0].user);
    process.exit(0);
  })
  .catch((err: Error) => {
    console.log("\n❌ Connection failed:");
    console.log("   Error:", err.message);
    console.log("\n💡 The password encoding is correct, but authentication is failing.");
    console.log("   This suggests the password in Supabase doesn't match.");
    console.log("   Verify in Supabase Dashboard → Settings → Database");
    process.exit(1);
  });

