import { eq } from "drizzle-orm";
import { createD1Db } from "../../shared/db/client";
import { materials } from "./material.schema";
import type { CreateMaterialInput, Material, UpdateMaterialInput } from "./material.types";

// 把 D1 包装成带 schema 的 Drizzle 实例，方便 repository 直接写查询。
function createMaterialsDb(db: D1Database) {
  return createD1Db(db, { materials });
}

export async function findMaterials(db: D1Database): Promise<Material[]> {
  const database = createMaterialsDb(db);
  return database.query.materials.findMany({
    orderBy: (table, { desc }) => [desc(table.id)],
  });
}

export async function findMaterialById(
  db: D1Database,
  id: number,
): Promise<Material | null> {
  const database = createMaterialsDb(db);
  return (
    (await database.query.materials.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    })) ?? null
  );
}

export async function insertMaterial(
  db: D1Database,
  input: CreateMaterialInput,
): Promise<Material> {
  const database = createMaterialsDb(db);
  const result = await database
    .insert(materials)
    .values({
      title: input.title,
      cover: input.cover,
      desc: input.desc ?? null,
      downloads: input.downloads ?? 0,
    })
    .run();

  const material = await findMaterialById(db, Number(result.meta.last_row_id));
  if (!material) {
    throw new Error("Created material not found");
  }

  return material;
}

export async function updateMaterialById(
  db: D1Database,
  id: number,
  input: UpdateMaterialInput,
): Promise<Material | null> {
  const database = createMaterialsDb(db);

  await database
    .update(materials)
    .set({
      ...input,
      desc: input.desc === undefined ? undefined : input.desc ?? null,
      downloads: input.downloads,
    })
    .where(eq(materials.id, id))
    .run();

  return findMaterialById(db, id);
}

export async function deleteMaterialById(db: D1Database, id: number): Promise<boolean> {
  const database = createMaterialsDb(db);
  const result = await database.delete(materials).where(eq(materials.id, id)).run();
  return result.meta.changes > 0;
}
