import type { Context } from "hono";
import { isAppError } from "../../common/errors/app-error";
import { readJsonBody } from "../../common";
import { ApiResponse, type HttpStatusCode } from "../../common/response/api-response";
import type { CreateMaterialInput, UpdateMaterialInput } from "./material.types";
import {
  createMaterial,
  getMaterialById,
  listMaterials,
  patchMaterial,
  removeMaterial,
} from "./material.service";

type MaterialContext = Context<{ Bindings: Env }>;

function handleError(c: MaterialContext, error: unknown) {
  if (isAppError(error)) {
    return ApiResponse.fail(c, error.code as HttpStatusCode, error.message, null);
  }

  const message = error instanceof Error ? error.message : "internal server error";
  return ApiResponse.fail(c, 500, message, null);
}

export async function getMaterialsController(c: MaterialContext) {
  try {
    const materials = await listMaterials(c.env.DB);
    return ApiResponse.ok(c, materials);
  } catch (error) {
    return handleError(c, error);
  }
}

export async function getMaterialController(c: MaterialContext) {
  try {
    const id = Number(c.req.param("id"));
    const material = await getMaterialById(c.env.DB, id);
    return ApiResponse.ok(c, material);
  } catch (error) {
    return handleError(c, error);
  }
}

export async function addMaterialController(c: MaterialContext) {
  const body = await readJsonBody<CreateMaterialInput>(c);
  if (!body) {
    return ApiResponse.fail(c, 400, "invalid JSON body", null);
  }

  try {
    const material = await createMaterial(c.env.DB, body);
    return ApiResponse.created(c, material, "created");
  } catch (error) {
    return handleError(c, error);
  }
}

export async function updateMaterialController(c: MaterialContext) {
  const body = await readJsonBody<UpdateMaterialInput>(c);
  if (!body) {
    return ApiResponse.fail(c, 400, "invalid JSON body", null);
  }

  try {
    const id = Number(c.req.param("id"));
    const material = await patchMaterial(c.env.DB, id, body);
    return ApiResponse.ok(c, material, "updated");
  } catch (error) {
    return handleError(c, error);
  }
}

export async function deleteMaterialController(c: MaterialContext) {
  try {
    const id = Number(c.req.param("id"));
    const result = await removeMaterial(c.env.DB, id);
    return ApiResponse.ok(c, result, "deleted");
  } catch (error) {
    return handleError(c, error);
  }
}
