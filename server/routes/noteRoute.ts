import { Hono } from "hono";
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
  type CreateNoteInput,
  type UpdateNoteInput,
} from "../db";

const noteRoute = new Hono<{ Bindings: Env }>();

// GET /api/notes
// Return all notes.
noteRoute.get("/", async (c) => {
  const notes = await listNotes(c.env.DB);
  return c.json(notes);
});

// GET /api/notes/:id
// Return a single note by id.
noteRoute.get("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ message: "invalid note id" }, 400);
  }

  const note = await getNoteById(c.env.DB, id);

  if (!note) {
    return c.json({ message: "note not found" }, 404);
  }

  return c.json(note);
});

// POST /api/notes
// Create a new note.
noteRoute.post("/", async (c) => {
  const body = await c.req.json<CreateNoteInput>();

  // Basic validation before calling the database layer.
  if (!body.title?.trim() || !body.content?.trim()) {
    return c.json(
      {
        message: "title and content are required",
      },
      400,
    );
  }

  const note = await createNote(c.env.DB, {
    title: body.title.trim(),
    content: body.content.trim(),
  });

  return c.json(note, 201);
});

// PATCH /api/notes/:id
// Partially update a note.
noteRoute.patch("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ message: "invalid note id" }, 400);
  }

  const body = await c.req.json<UpdateNoteInput>();
  const payload: UpdateNoteInput = {};

  if (body.title !== undefined) {
    if (!body.title.trim()) {
      return c.json({ message: "title cannot be empty" }, 400);
    }
    payload.title = body.title.trim();
  }

  if (body.content !== undefined) {
    if (!body.content.trim()) {
      return c.json({ message: "content cannot be empty" }, 400);
    }
    payload.content = body.content.trim();
  }

  if (Object.keys(payload).length === 0) {
    return c.json(
      {
        message: "at least one field is required",
      },
      400,
    );
  }

  const note = await updateNote(c.env.DB, id, payload);

  if (!note) {
    return c.json({ message: "note not found" }, 404);
  }

  return c.json(note);
});

// DELETE /api/notes/:id
// Delete a note by id.
noteRoute.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (!Number.isInteger(id) || id <= 0) {
    return c.json({ message: "invalid note id" }, 400);
  }

  const deleted = await deleteNote(c.env.DB, id);

  if (!deleted) {
    return c.json({ message: "note not found" }, 404);
  }

  return c.json({ message: "deleted" }, 200);
});

export default noteRoute;
