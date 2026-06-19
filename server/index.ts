import { Hono } from "hono";
import materialRoute from "./modules/material/material.route";
import noteRoute from "./modules/note/note.route";

// 所有后端接口统一挂在 /api 前缀下，方便和前端静态资源分开。
const app = new Hono<{ Bindings: Env }>().basePath("/api");

app.route("/", noteRoute);
app.route("/", materialRoute);

export default app;
