import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// notes 表结构定义，后续 repository / service 都基于它推导类型。
export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // D1 里用 CURRENT_TIMESTAMP 生成默认创建时间。
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  // 初始写入时先给默认值，更新时再由业务层手动覆盖。
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
