import { badRequest, notFound } from "../../common/errors/app-error";
import type { CreateMaterialInput, Material, UpdateMaterialInput } from "./material.types";
import {
  deleteMaterialById,
  findMaterialById,
  findMaterials,
  insertMaterial,
  updateMaterialById,
} from "./material.repository";

function normalizeId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw badRequest("invalid material id");
  }

  return id;
}

function normalizeCreateInput(input: CreateMaterialInput): CreateMaterialInput {
  const title = input.title.trim();
  const cover = input.cover.trim();
  const link = input.link.trim();

  if (!title || !cover || !link) {
    throw badRequest("title, cover and link are required");
  }

  const payload: CreateMaterialInput = {
    title,
    cover,
    link,
  };

  if (input.desc !== undefined) {
    const desc = input.desc?.trim();
    if (desc) {
      payload.desc = desc;
    }
  }

  if (input.order !== undefined) {
    if (!Number.isInteger(input.order) || input.order < 0) {
      throw badRequest("order must be a non-negative integer");
    }
    payload.order = input.order;
  }

  if (input.downloads !== undefined) {
    if (!Number.isInteger(input.downloads) || input.downloads < 0) {
      throw badRequest("downloads must be a non-negative integer");
    }
    payload.downloads = input.downloads;
  }

  return payload;
}

function normalizeUpdateInput(input: UpdateMaterialInput): UpdateMaterialInput {
  const payload: UpdateMaterialInput = {};

  if (input.title !== undefined) {
    const title = input.title.trim();
    if (!title) {
      throw badRequest("title cannot be empty");
    }
    payload.title = title;
  }

  if (input.cover !== undefined) {
    const cover = input.cover.trim();
    if (!cover) {
      throw badRequest("cover cannot be empty");
    }
    payload.cover = cover;
  }

  if (input.link !== undefined) {
    const link = input.link.trim();
    if (!link) {
      throw badRequest("link cannot be empty");
    }
    payload.link = link;
  }

  if (input.desc !== undefined) {
    const desc = input.desc?.trim();
    payload.desc = desc || null;
  }

  if (input.order !== undefined) {
    if (!Number.isInteger(input.order) || input.order < 0) {
      throw badRequest("order must be a non-negative integer");
    }
    payload.order = input.order;
  }

  if (input.downloads !== undefined) {
    if (!Number.isInteger(input.downloads) || input.downloads < 0) {
      throw badRequest("downloads must be a non-negative integer");
    }
    payload.downloads = input.downloads;
  }

  if (Object.keys(payload).length === 0) {
    throw badRequest("at least one field is required");
  }

  return payload;
}

export async function listMaterials(db: D1Database): Promise<Material[]> {
  return findMaterials(db);
}

export async function getMaterialById(db: D1Database, id: number): Promise<Material> {
  const materialId = normalizeId(id);
  const material = await findMaterialById(db, materialId);

  if (!material) {
    throw notFound("material not found");
  }

  return material;
}

export async function createMaterial(
  db: D1Database,
  input: CreateMaterialInput,
): Promise<Material> {
  return insertMaterial(db, normalizeCreateInput(input));
}

export async function patchMaterial(
  db: D1Database,
  id: number,
  input: UpdateMaterialInput,
): Promise<Material> {
  const materialId = normalizeId(id);
  const payload = normalizeUpdateInput(input);
  const material = await updateMaterialById(db, materialId, payload);

  if (!material) {
    throw notFound("material not found");
  }

  return material;
}

export async function removeMaterial(db: D1Database, id: number): Promise<{ deleted: true }> {
  const materialId = normalizeId(id);
  const deleted = await deleteMaterialById(db, materialId);

  if (!deleted) {
    throw notFound("material not found");
  }

  return { deleted: true };
}
