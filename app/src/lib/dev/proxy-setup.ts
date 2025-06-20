/**
 * @fileoverview プロキシ設定用
 *
 * @description HTTPプロキシが設定された環境のNode.jsでfetchなどを実行しようとするとエラーになる。その回避用設定。
 */
import { setGlobalDispatcher, EnvHttpProxyAgent } from "undici";

if (typeof window === "undefined") {
  setGlobalDispatcher(new EnvHttpProxyAgent());
}
