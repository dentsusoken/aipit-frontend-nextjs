import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { APIResponse } from "./types/api";

const isApi = (path: string) => /^\/api.*$/.test(path);
const isCallback = (path: string) => /^\/callback$/.test(path);
const isLogedIn = (cookieStore: ReadonlyRequestCookies) =>
  !!cookieStore.get("access_token");

export const middleware = async (req: NextRequest) => {
  try {
    const { pathname, searchParams } = req.nextUrl;
    const cookieStore = await cookies();

    // ログイン済みの場合は、アクセスを許可する
    if (isLogedIn(cookieStore)) {
      return NextResponse.next();
    }

    // APIへのアクセスは許可する。（Route Handlersは別コンテナになるため開発用）
    if (isApi(pathname)) {
      return NextResponse.next();
    }

    // IdPからのcallback処理を実施し、ルートディレクトリにリダイレクトする。
    if (isCallback(pathname)) {
      const response = await fetch(`${process.env.BFF_BASE_URL}/api/auth/token`, {
        method: "POST",
        body: searchParams.toString(),
      });
      const json = (await response.json()) as APIResponse<{
        access_token: string;
      }>;
      if (json.success) {
        cookieStore.set("access_token", json.data.access_token);
        return NextResponse.redirect(`${process.env.FRONTEND_BASE_URL}`);
      }
      throw new Error(json.error);
    }

    // 上記以外の場合は、IdPにリダイレクトする。
    const response = await fetch(`${process.env.BFF_BASE_URL}/api/auth/signin`);
    // TODO zodなどを使用してparse/validateできるようにする。
    const json = (await response.json()) as APIResponse<{
      authorizationUrl: string;
    }>;
    if (json.success) {
      const { data } = json;
      return NextResponse.redirect(data.authorizationUrl);
    }
    throw new Error(json.error);
  } catch (e) {
    console.error((e as Error).message);
    return NextResponse.error();
  }
};
