import type { Context } from "hono";

// 当前项目统一支持的 HTTP 风格状态码。
export type HttpStatusCode = 200 | 201 | 400 | 404 | 500;

// 所有接口最终都收敛成 code / message / data 这一个响应结构。
export type ApiResponseBody<T> = {
  code: HttpStatusCode;
  message: string;
  data: T;
};

// 统一响应出口，避免每个 controller 手写重复的 c.json(...)。
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
