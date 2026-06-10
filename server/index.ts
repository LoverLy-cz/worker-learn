import { Hono } from "hono";
import noteRoute from "./routes/noteRoute";

const app = new Hono<{ Bindings: Env }>();

app.route('/api/notes', noteRoute);

export default app;
