import { drizzle } from "drizzle-orm/d1";

// 把 Cloudflare 的原生 D1Database 包装成带 schema 类型提示的 Drizzle 实例。
export function createD1Db<TSchema extends Record<string, unknown>>(
  db: D1Database,
  schema: TSchema,
) {
  return drizzle(db, { schema });
}
