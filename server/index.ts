import { Hono } from "hono";
import noteRoute from "./modules/note/note.route";

const app = new Hono<{ Bindings: Env }>().basePath("/api");

app.route("/", noteRoute);

export default app;
