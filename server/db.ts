import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { notes, type CreateNoteInput, type Note, type UpdateNoteInput } from "./schema";

function createDb(db: D1Database) {
  return drizzle(db, { schema: { notes } });
}

export type { CreateNoteInput, Note, UpdateNoteInput };

export async function listNotes(db: D1Database): Promise<Note[]> {
  const database = createDb(db);
  return database.query.notes.findMany({
    orderBy: (notes, { desc }) => [desc(notes.id)],
  });
}

export async function getNoteById(db: D1Database, id: number): Promise<Note | null> {
  const database = createDb(db);
  return (
    (await database.query.notes.findFirst({
      where: (notes, { eq }) => eq(notes.id, id),
    })) ?? null
  );
}

export async function createNote(db: D1Database, input: CreateNoteInput): Promise<Note> {
  const database = createDb(db);
  const result = await database
    .insert(notes)
    .values({
      title: input.title,
      content: input.content,
    })
    .run();

  // D1 会返回刚插入的行 ID
  const id = Number(result.meta.last_row_id);
  const note = await getNoteById(db, id);

  if (!note) {
    throw new Error("Created note not found");
  }

  return note;
}

// 更新一条记录：对应以前的 UPDATE ... WHERE id = ?
export async function updateNote(
  db: D1Database,
  id: number,
  input: UpdateNoteInput,
): Promise<Note | null> {
  const database = createDb(db);
  const current = await getNoteById(db, id);

  if (!current) {
    return null;
  }

  const title = input.title ?? current.title;
  const content = input.content ?? current.content;

  await database
    .update(notes)
    .set({
      title,
      content,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(notes.id, id))
    .run();

  return getNoteById(db, id);
}

export async function deleteNote(db: D1Database, id: number): Promise<boolean> {
  const database = createDb(db);
  const result = await database.delete(notes).where(eq(notes.id, id)).run();
  return result.meta.changes > 0;
}
