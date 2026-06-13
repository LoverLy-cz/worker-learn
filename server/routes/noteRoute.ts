import { Hono } from "hono";
import { createNote, deleteNote, getNoteById, listNotes, type CreateNoteInput } from "../db";

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
  const note = await getNoteById(c.env.DB, id);

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

  const note = await createNote(c.env.DB, body);
  return c.json(note, 201);
});

// DELETE /api/notes/:id
// Delete a note by id.
noteRoute.delete("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const deleted = await deleteNote(c.env.DB, id);

  if (!deleted) {
    return c.json(
      {
        message: "note not found",
      },
      404,
    );
  }

  return c.json(
    {
      message: "deleted",
    },
    200,
  );
});

export default noteRoute;
