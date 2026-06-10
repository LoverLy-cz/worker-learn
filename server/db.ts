export type Note = {
  id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type CreateNoteInput = {
  title: string
  content: string
}

export type UpdateNoteInput = {
  title?: string
  content?: string
}


const NOTE_COLUMNS = "id, title, content, created_at, updated_at";


export async function listNotes(db: D1Database): Promise<Note[]> {
  const result = await db
    .prepare(`SELECT ${ NOTE_COLUMNS }
              FROM notes
              ORDER BY id DESC`)
    .all<Note>();

  return result.results ?? [];
}


export async function getNoteById(db: D1Database, id: number): Promise<Note | null> {
  return await db.prepare(`SELECT ${ NOTE_COLUMNS }
                           FROM notes
                           WHERE id = ?`).bind(id).first<Note>() ?? null;
}


export async function createNote(db: D1Database, input: CreateNoteInput): Promise<Note> {
  const result = await db
    .prepare('INSERT INTO notes (title, content) VALUES (?, ?)')
    .bind(input.title, input.content)
    .run()

  const id = Number(result.meta.last_row_id)
  const note = await getNoteById(db, id)

  if (!note) {
    throw new Error('Created note not found')
  }

  return note
}

export async function updateNote(
  db: D1Database,
  id: number,
  input: UpdateNoteInput,
): Promise<Note | null> {
  const current = await getNoteById(db, id)

  if (!current) {
    return null
  }

  const title = input.title ?? current.title
  const content = input.content ?? current.content

  await db
    .prepare('UPDATE notes SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(title, content, id)
    .run()

  return getNoteById(db, id)
}

export async function deleteNote(db: D1Database, id: number): Promise<boolean> {
  const result = await db.prepare('DELETE FROM notes WHERE id = ?').bind(id).run()
  return result.meta.changes > 0
}
