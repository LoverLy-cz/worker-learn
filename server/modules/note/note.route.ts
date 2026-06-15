import { Hono } from "hono";
import {
  createNoteController,
  deleteNoteController,
  getNoteController,
  listNotesController,
  patchNoteController,
} from "./note.controller";

const noteRoute = new Hono<{ Bindings: Env }>().basePath("/notes");

noteRoute.get("/", listNotesController);
noteRoute.get("/:id", getNoteController);
noteRoute.post("/", createNoteController);
noteRoute.patch("/:id", patchNoteController);
noteRoute.delete("/:id", deleteNoteController);

export default noteRoute;
