// 业务层主动抛出的可控错误，controller 会把它转换成统一响应。
export class AppError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// 这些工厂函数用于快速创建常见 HTTP 语义错误。
export const badRequest = (message: string) => new AppError(400, message);
export const notFound = (message: string) => new AppError(404, message);
export const internalError = (message: string) => new AppError(500, message);

// 用类型守卫区分“业务错误”和“真正的未知异常”。
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
