import { desc, eq, sql } from "drizzle-orm";
import { createD1Db } from "../../shared/db/client";
import { notes } from "./note.schema";
import type { CreateNoteInput, Note, UpdateNoteInput } from "./note.types";

function createNotesDb(db: D1Database) {
  return createD1Db(db, { notes });
}

export async function findNotes(db: D1Database): Promise<Note[]> {
  const database = createNotesDb(db);
  return database.query.notes.findMany({
    orderBy: (notes, { desc }) => [desc(notes.id)],
  });
}

export async function findNoteById(db: D1Database, id: number): Promise<Note | null> {
  const database = createNotesDb(db);
  return (
    (await database.query.notes.findFirst({
      where: (notes, { eq }) => eq(notes.id, id),
    })) ?? null
  );
}

export async function insertNote(db: D1Database, input: CreateNoteInput): Promise<Note> {
  const database = createNotesDb(db);
  const result = await database
    .insert(notes)
    .values({
      title: input.title,
      content: input.content,
    })
    .run();

  const note = await findNoteById(db, Number(result.meta.last_row_id));
  if (!note) {
    throw new Error("Created note not found");
  }

  return note;
}

export async function updateNoteById(
  db: D1Database,
  id: number,
  input: UpdateNoteInput,
): Promise<Note | null> {
  const database = createNotesDb(db);

  await database
    .update(notes)
    .set({
      ...input,
      updated_at: sql`CURRENT_TIMESTAMP`,
    })
    .where(eq(notes.id, id))
    .run();

  return findNoteById(db, id);
}

export async function deleteNoteById(db: D1Database, id: number): Promise<boolean> {
  const database = createNotesDb(db);
  const result = await database.delete(notes).where(eq(notes.id, id)).run();
  return result.meta.changes > 0;
}
