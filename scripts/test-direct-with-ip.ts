import postgres from "postgres";
import * as dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config({ path: ".env.local" });

// Try to resolve the hostname to IP
const hostname = "db.dptubonksvipfnywalev.supabase.co";
let host = hostname;

try {
  console.log(`Resolving ${hostname}...`);
  // Try nslookup to get IP
  const result = execSync(`nslookup ${hostname}`, { encoding: "utf-8" });
  const ipMatch = result.match(/Address:\s+(\d+\.\d+\.\d+\.\d+)/);
  if (ipMatch && ipMatch[1]) {
    host = ipMatch[1];
    console.log(`✅ Resolved to IP: ${host}`);
  } else {
    console.log(`⚠️  Could not resolve to IPv4, using hostname`);
  }
} catch (err) {
  console.log(`⚠️  DNS resolution failed, using hostname`);
}

const password = "C0z1Kn0wSh!t";
const encoded = encodeURIComponent(password);
const directUrl = `postgresql://postgres:${encoded}@${host}:5432/postgres`;

console.log("\nTesting direct connection with resolved host...");
console.log("URL:", directUrl.replace(/:[^:@]+@/, ":****@"));

const sql = postgres(directUrl, {
  ssl: "require",
  max: 1,
});

sql`SELECT 1 as test, current_database() as db, current_user as user`
  .then((result) => {
    console.log("\n✅ Connection successful!");
    console.log("Database:", result[0].db);
    console.log("User:", result[0].user);
    console.log("\n💡 Update .env.local with this working connection string");
    process.exit(0);
  })
  .catch((err: Error) => {
    console.log("\n❌ Connection failed:");
    console.log("   Error:", err.message);
    process.exit(1);
  });

