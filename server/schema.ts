import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 这里专门定义 notes 表结构。
// 后面所有数据库操作都围绕这份 schema 来写。
export const notes = sqliteTable("notes", {
  // 主键，自增 ID
  id: integer("id").primaryKey({ autoIncrement: true }),

  // 笔记标题，不能为空
  title: text("title").notNull(),

  // 笔记内容，不能为空
  content: text("content").notNull(),

  // 创建时间，默认使用数据库当前时间
  created_at: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),

  // 更新时间，默认使用数据库当前时间
  updated_at: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// 读取数据时的类型，直接从表结构推导出来
export type Note = typeof notes.$inferSelect;

// 新增数据时允许传入的字段，只保留 title 和 content
export type CreateNoteInput = Pick<typeof notes.$inferInsert, "title" | "content">;

// 更新时允许部分字段传入
export type UpdateNoteInput = Partial<CreateNoteInput>;
