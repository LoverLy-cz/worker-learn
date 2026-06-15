import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // 统一扫描模块里的 schema，后续新增 user/auth 表时不需要再改这里。
  schema: "./server/modules/**/*.schema.ts",
  // 迁移文件输出目录，需要和 wrangler.jsonc 里的 migrations_dir 保持一致。
  out: "./drizzle/migrations",
  // Cloudflare D1 基于 SQLite，所以这里使用 sqlite 方言。
  dialect: "sqlite",
});
