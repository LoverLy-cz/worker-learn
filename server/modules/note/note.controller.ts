import type { Context } from "hono";
import { ApiResponse, type HttpStatusCode } from "../../common/response/api-response";
import { isAppError } from "../../common/errors/app-error";
import {
  createNote,
  getNoteById,
  listNotes,
  patchNote,
  removeNote,
} from "./note.service";
import type { CreateNoteInput, UpdateNoteInput } from "./note.types";

type NoteContext = Context<{ Bindings: Env }>;

async function readJsonBody<T>(c: NoteContext): Promise<T | null> {
  try {
    return await c.req.json<T>();
  } catch {
    return null;
  }
}

function handleError(c: NoteContext, error: unknown) {
  if (isAppError(error)) {
    return ApiResponse.fail(c, error.code as HttpStatusCode, error.message, null);
  }

  const message = error instanceof Error ? error.message : "internal server error";
  return ApiResponse.fail(c, 500, message, null);
}

export async function listNotesController(c: NoteContext) {
  try {
    const notes = await listNotes(c.env.DB);
    return ApiResponse.ok(c, notes);
  } catch (error) {
    return handleError(c, error);
  }
}

export async function getNoteController(c: NoteContext) {
  try {
    const id = Number(c.req.param("id"));
    const note = await getNoteById(c.env.DB, id);
    return ApiResponse.ok(c, note);
  } catch (error) {
    return handleError(c, error);
  }
}

export async function createNoteController(c: NoteContext) {
  const body = await readJsonBody<CreateNoteInput>(c);
  if (!body) {
    return ApiResponse.fail(c, 400, "invalid JSON body", null);
  }

  try {
    const note = await createNote(c.env.DB, body);
    return ApiResponse.created(c, note, "created");
  } catch (error) {
    return handleError(c, error);
  }
}

export async function patchNoteController(c: NoteContext) {
  const body = await readJsonBody<UpdateNoteInput>(c);
  if (!body) {
    return ApiResponse.fail(c, 400, "invalid JSON body", null);
  }

  try {
    const id = Number(c.req.param("id"));
    const note = await patchNote(c.env.DB, id, body);
    return ApiResponse.ok(c, note, "updated");
  } catch (error) {
    return handleError(c, error);
  }
}

export async function deleteNoteController(c: NoteContext) {
  try {
    const id = Number(c.req.param("id"));
    const result = await removeNote(c.env.DB, id);
    return ApiResponse.ok(c, result, "deleted");
  } catch (error) {
    return handleError(c, error);
  }
}
