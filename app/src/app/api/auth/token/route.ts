import "@/lib/dev/proxy-setup";
import { getServerMetadata } from "@/lib/auth/get-server-metadata";
import { NextRequest, NextResponse } from "next/server";
import { issueToken } from "@/lib/auth/issue-token";
import { APIErrorResponse, APISuccessResponse } from "@/types/api";

/**
 * トークン発行API
 *
 * @description
 * 認可リクエスト後callbackで呼び出される。
 * リクエストパラメーターに認可コードを受け取り、トークンを発行する。
 */
export async function POST(req: NextRequest) {
  try {
    const parameters = await req.text();
    const { token_endpoint } = await getServerMetadata();

    const json = await issueToken(token_endpoint, parameters);

    return NextResponse.json<APISuccessResponse<{ access_token: string }>>({
      data: { access_token: json.access_token },
      success: true,
    });
  } catch (e) {
    return NextResponse.json<APIErrorResponse>({
      error: (e as Error).message,
      success: false,
    });
  }
}
