"use server";

/**
 * トークンを発行する
 *
 * TODO: パラメーターからstateを取得しDBに保存されているstateと一致するか比較する
 * TODO: トークン発行リクエストのパラメーターにDBに保存されているcode_verifierを追加する
 * TODO: トークン発行後、トークンの署名を検証する
 * TODO: トークン発行後、IDトークンからnonceを取得しDBに保存されているnonceと一致するか比較する
 *
 * @param tokenEndpoint トークンエンドポイントのURL
 * @param parameters リクエストパラメーターで受け取ったパラメーター
 * @returns 発行されたアクセストークン、IDトークン、リフレッシュトークン
 */
export const issueToken = async (tokenEndpoint: string, parameters: string) => {
  const serachParams = new URLSearchParams(parameters);
  const code = serachParams.get("code") || "";

  const response = await fetch(
    (tokenEndpoint as string).replace("localhost", "keycloak"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: process.env.OIDC_CLIENT_ID || "",
        redirect_uri: process.env.OIDC_REDIRECT_URI || "",
      }).toString(),
    }
  );
  const json = await response.json();

  return json;
};
