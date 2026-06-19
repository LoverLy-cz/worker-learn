import { materials } from "./material.schema";

// 从 schema 直接推导出 material 的查询返回类型。
export type Material = typeof materials.$inferSelect;

// 创建 material 时需要的字段，downloads 由业务层默认处理。
export type CreateMaterialInput = {
  title: string;
  cover: string;
  desc?: string | null;
  downloads?: number;
};

// 更新时只允许传部分字段。
export type UpdateMaterialInput = Partial<CreateMaterialInput>;
