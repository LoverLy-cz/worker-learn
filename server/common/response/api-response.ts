import type { Context } from "hono";

export type HttpStatusCode = 200 | 201 | 400 | 404 | 500;

export type ApiResponseBody<T> = {
  code: HttpStatusCode;
  message: string;
  data: T;
};

export class ApiResponse {
  private static send<T>(
    c: Context,
    code: HttpStatusCode,
    message: string,
    data: T,
  ) {
    return c.json<ApiResponseBody<T>>(
      {
        code,
        message,
        data,
      },
      code,
    );
  }

  static ok<T>(c: Context, data: T, message = "ok") {
    return ApiResponse.send(c, 200, message, data);
  }

  static created<T>(c: Context, data: T, message = "created") {
    return ApiResponse.send(c, 201, message, data);
  }

  static fail<T>(c: Context, code: HttpStatusCode, message: string, data: T) {
    return ApiResponse.send(c, code, message, data);
  }
}
