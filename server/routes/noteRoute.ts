import { Hono } from "hono";
import { createNote, CreateNoteInput, getNoteById, listNotes } from "../db";

const noteRoute = new Hono<{ Bindings: Env }>();
noteRoute.get("/", async (c) => {
  let notes = await listNotes(c.env.DB);
  return c.json(notes);
})

noteRoute.get("/:id", async (c) => {
  let note = await getNoteById(c.env.DB, Number(c.req.param("id")));

  return c.json(note);
})


noteRoute.post("/", async (c) => {
  const body = await c.req.json<{ title: string; content: string }>();
  if (!body.title?.trim() || !body.content?.trim()) {
    return c.json({
      message: "title and content are required"
    }, 400)
  }

  let note = await createNote(c.env.DB, body);
  return c.json(note, 201);
})
export default noteRoute;
