import type { notes } from "./note.schema";

export type Note = typeof notes.$inferSelect;

export type CreateNoteInput = {
  title: string;
  content: string;
};

export type UpdateNoteInput = Partial<CreateNoteInput>;
