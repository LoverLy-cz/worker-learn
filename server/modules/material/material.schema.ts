import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// material 表结构定义，repository/service 都通过它拿到完整类型信息。
export const materials = sqliteTable("materials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  cover: text("cover").notNull(),
  link: text("link").notNull(),
  desc: text("desc"),
  order: integer("order").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
});
