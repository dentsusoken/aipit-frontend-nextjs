"use server";

/**
 *認可リクエスト用のURLを生成する
 *
 * TODO: state, nonce, pkce用パラメーターを生成し、DBに保存する。
 * TODO: state, nonce, code_challenge, code_challenge_methodをクエリパラメータに追加する。
 *
 * @param authorizationEndpoint 認可エンドポイントのURL
 * @returns 必要なクエリパラメータを含めた認可リクエスト用URL
 */
export const generateAuthorizationUrl = async (
  authorizationEndpoint: string
) => {
  const authorizationUrl = new URL(authorizationEndpoint);
  const serachParams = new URLSearchParams({
    client_id: process.env.OIDC_CLIENT_ID || "",
    redirect_uri: process.env.OIDC_REDIRECT_URI || "",
    response_type: "code",
    scope: "openid",
  });
  authorizationUrl.search = serachParams.toString();

  return authorizationUrl.toString();
};
