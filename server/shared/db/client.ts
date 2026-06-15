import { drizzle } from "drizzle-orm/d1";

export function createD1Db<TSchema extends Record<string, unknown>>(
  db: D1Database,
  schema: TSchema,
) {
  return drizzle(db, { schema });
}
