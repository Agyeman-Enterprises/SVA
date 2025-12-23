import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Database connection with lazy initialization
// Disable prefetch as it is not supported for "Transaction" pool mode
const connectionString = process.env.DATABASE_URL;

let client: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

if (connectionString) {
  client = postgres(connectionString, { prepare: false });
  dbInstance = drizzle(client, { schema });
}

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    if (!dbInstance) {
      throw new Error(
        "Database not initialized. DATABASE_URL environment variable is required."
      );
    }
    return (dbInstance as any)[prop];
  },
});

export type Database = typeof db;

