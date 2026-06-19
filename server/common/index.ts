import { Context } from "hono";

export async function readJsonBody<T>(c: Context<{ Bindings: Env }>): Promise<T | null> {
  try {
    return await c.req.json<T>();
  } catch {
    return null;
  }
}
