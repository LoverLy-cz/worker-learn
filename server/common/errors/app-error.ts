export class AppError extends Error {
  readonly code: number;

  constructor(code: number, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const badRequest = (message: string) => new AppError(400, message);
export const notFound = (message: string) => new AppError(404, message);
export const internalError = (message: string) => new AppError(500, message);

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
