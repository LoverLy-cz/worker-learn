import { Hono } from "hono";
import {
  addMaterialController,
  deleteMaterialController,
  getMaterialController,
  getMaterialsController,
  updateMaterialController,
} from "./material.controller";

const materialRoute = new Hono<{ Bindings: Env }>().basePath("/materials");

materialRoute.get("/", getMaterialsController);
materialRoute.get("/:id", getMaterialController);
materialRoute.post("/", addMaterialController);
materialRoute.patch("/:id", updateMaterialController);
materialRoute.delete("/:id", deleteMaterialController);

export default materialRoute;
