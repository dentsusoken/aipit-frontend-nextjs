"use server";

const OIDC_CONFIGURATION = "/.well-known/openid-configuration";

/**
 * IdPのサーバーメタデータを取得する。
 *
 * @returns IdPから取得したJSON形式のメタデータ
 */
export const getServerMetadata = async () => {
  try {
    const oidcServer = process.env.OIDC_SERVER || "";
    const response = await fetch(`${oidcServer}${OIDC_CONFIGURATION}`);
    return await response.json();
  } catch (e) {
    console.error(e);
    throw new Error("Fetch server metadata failed.");
  }
};
