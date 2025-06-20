/**
 * @fileoverview プロキシ設定用
 *
 * @description HTTPプロキシが設定された環境のNode.jsでfetchなどを実行しようとするとエラーになる。その回避用設定。
 */
"use server";
import { setGlobalDispatcher, EnvHttpProxyAgent } from "undici";

if (typeof window === "undefined") {
  console.log("process.env.NO_PROXY :>> ", process.env.NO_PROXY);
  setGlobalDispatcher(
    new EnvHttpProxyAgent({
      httpProxy: process.env.HTTP_PROXY,
      httpsProxy: process.env.HTTPS_PROXY,
      noProxy: process.env.NO_PROXY,
    })
  );
}
