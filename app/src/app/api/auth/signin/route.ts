import { generateAuthorizationUrl } from "@/lib/auth/generate-authorization-url";
import { getServerMetadata } from "@/lib/auth/get-server-metadata";
import "@/lib/dev/proxy-setup";
import { APIErrorResponse, APISuccessResponse } from "@/types/api";
import { NextResponse } from "next/server";

/**
 * 認可リクエスト用URL生成API
 *
 * @description
 * フロントエンドが認可リクエストでIdPにリダイレクトするためのURLを生成する。
 */
export async function GET() {
  try {
    const { authorization_endpoint } = await getServerMetadata();
    const authorizationUrl = await generateAuthorizationUrl(
      authorization_endpoint
    );

    return NextResponse.json<APISuccessResponse>({
      success: true,
      data: { authorizationUrl },
    });
  } catch (e) {
    return NextResponse.json<APIErrorResponse>({
      success: false,
      error: (e as Error).message,
    });
  }
}
