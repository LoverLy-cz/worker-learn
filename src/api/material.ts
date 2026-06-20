import { requestData } from "./request";

export interface Material {
  id: number;
  title: string;
  cover: string;
  link: string;
  desc: string | null;
  order: number;
  downloads: number;
}

export interface MaterialInput {
  title: string;
  cover: string;
  link: string;
  desc?: string | null;
  order?: number;
  downloads?: number;
}

export function getMaterialList() {
  return requestData<Material[]>({
    url: "/materials",
    method: "GET",
  });
}

export function getMaterialById(id: number) {
  return requestData<Material>({
    url: `/materials/${id}`,
    method: "GET",
  });
}

export function createMaterial(input: MaterialInput) {
  return requestData<Material>({
    url: "/materials",
    method: "POST",
    data: input,
  });
}

export function updateMaterial(id: number, input: Partial<MaterialInput>) {
  return requestData<Material>({
    url: `/materials/${id}`,
    method: "PATCH",
    data: input,
  });
}

export function deleteMaterial(id: number) {
  return requestData<{ deleted: true }>({
    url: `/materials/${id}`,
    method: "DELETE",
  });
}
