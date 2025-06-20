/**
 * API成功レスポンスの型定義
 */
export interface APISuccessResponse<T = unknown> {
  success: true;
  data: T;
}

/**
 * APIエラーレスポンスの型定義
 */
export interface APIErrorResponse {
  success: false;
  error: string;
}

/**
 * APIレスポンスの型定義
 *
 * @description
 * `success`が`true`ならば成功レスポンス。`false`ならばエラーレスポンス。
 */
export type APIResponse<T = unknown> = APISuccessResponse<T> | APIErrorResponse;
