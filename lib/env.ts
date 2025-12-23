import { z } from "zod";

/**
 * Environment variable validation
 * Ensures all required configuration is present and valid
 */

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().or(z.string().startsWith("postgresql://")),
  DB_HOST: z.string().min(1).optional(),
  DB_PORT: z.string().regex(/^\d+$/).optional(),
  DB_USER: z.string().min(1).optional(),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().min(1).optional(),
  DB_SSL: z.enum(["true", "false"]).optional(),

  // Auth
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validated environment variables
 * Throws error if validation fails
 */
export function getEnv(): Env {
  try {
    return envSchema.parse({
      DATABASE_URL: process.env.DATABASE_URL,
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_NAME: process.env.DB_NAME,
      DB_SSL: process.env.DB_SSL,
      JWT_SECRET: process.env.JWT_SECRET,
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      NODE_ENV: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missing = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("\n");
      throw new Error(`Environment validation failed:\n${missing}`);
    }
    throw error;
  }
}

/**
 * Get environment variables (validated)
 * Use this instead of process.env directly
 * Lazy evaluation - only validates when accessed
 */
let cachedEnv: Env | null = null;

function getCachedEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = getEnv();
  }
  return cachedEnv;
}

// Export as object with lazy validation
export const env = new Proxy({} as Env, {
  get(_target, prop) {
    return getCachedEnv()[prop as keyof Env];
  },
});

