import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const password = "8U32gkKK9l9vpbk7";
// Properly URL encode the password - encodeURIComponent handles most, but we need to ensure # and ! are encoded
// encodeURIComponent doesn't encode ! and # in some contexts, so we'll do it explicitly
let encoded = encodeURIComponent(password);
// Double-check: manually encode # and ! if they're still present (they shouldn't be after encodeURIComponent, but just in case)
encoded = encoded.replace(/#/g, "%23").replace(/!/g, "%21");

// Try session pooler connection (port 6543) with properly encoded password
const sessionPoolerUrl = `postgresql://postgres.dptubonksvipfnywalev:${encoded}@aws-1-us-west-1.pooler.supabase.com:6543/postgres`;

let content = fs.readFileSync(".env.local", "utf8");
content = content.replace(/DATABASE_URL=.*/g, `DATABASE_URL=${sessionPoolerUrl}`);
content = content.replace(/DB_HOST=.*/g, "DB_HOST=aws-1-us-west-1.pooler.supabase.com");
content = content.replace(/DB_PORT=.*/g, "DB_PORT=6543");
content = content.replace(/DB_USER=.*/g, "DB_USER=postgres.dptubonksvipfnywalev");

fs.writeFileSync(".env.local", content);

console.log("✅ Updated .env.local with session pooler connection (port 6543)");
console.log("Password encoded:", encoded);
console.log("Connection string (masked):", sessionPoolerUrl.replace(/:[^:@]+@/, ":****@"));

