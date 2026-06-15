import { badRequest, notFound } from "../../common/errors/app-error";
import type { CreateNoteInput, Note, UpdateNoteInput } from "./note.types";
import {
  deleteNoteById,
  findNoteById,
  findNotes,
  insertNote,
  updateNoteById,
} from "./note.repository";

function normalizeId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest("invalid note id");
  }
  return id;
}

function normalizeCreateInput(input: CreateNoteInput): CreateNoteInput {
  const title = input.title.trim();
  const content = input.content.trim();

  if (!title || !content) {
    throw badRequest("title and content are required");
  }

  return { title, content };
}

function normalizePatchInput(input: UpdateNoteInput): UpdateNoteInput {
  const payload: UpdateNoteInput = {};

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) {
      throw badRequest("title cannot be empty");
    }
    payload.title = title;
  }

  if (input.content !== undefined) {
    const content = input.content.trim();
    if (!content) {
      throw badRequest("content cannot be empty");
    }
    payload.content = content;
  }

  if (Object.keys(payload).length === 0) {
    throw badRequest("at least one field is required");
  }

  return payload;
}

export async function listNotes(db: D1Database): Promise<Note[]> {
  return findNotes(db);
}

export async function getNoteById(db: D1Database, id: number): Promise<Note> {
  const noteId = normalizeId(id);
  const note = await findNoteById(db, noteId);

  if (!note) {
    throw notFound("note not found");
  }

  return note;
}

export async function createNote(db: D1Database, input: CreateNoteInput): Promise<Note> {
  return insertNote(db, normalizeCreateInput(input));
}

export async function patchNote(
  db: D1Database,
  id: number,
  input: UpdateNoteInput,
): Promise<Note> {
  const noteId = normalizeId(id);
  const payload = normalizePatchInput(input);
  const note = await updateNoteById(db, noteId, payload);

  if (!note) {
    throw notFound("note not found");
  }

  return note;
}

export async function removeNote(db: D1Database, id: number): Promise<{ deleted: true }> {
  const noteId = normalizeId(id);
  const deleted = await deleteNoteById(db, noteId);

  if (!deleted) {
    throw notFound("note not found");
  }

  return { deleted: true };
}
