import type { notes } from "./note.schema";

// 从 Drizzle schema 反推出“查询结果长什么样”。
export type Note = typeof notes.$inferSelect;

// 创建时必须传完整字段。
export type CreateNoteInput = {
  title: string;
  content: string;
};

// 更新时允许只传部分字段，所以这里用 Partial。
export type UpdateNoteInput = Partial<CreateNoteInput>;
