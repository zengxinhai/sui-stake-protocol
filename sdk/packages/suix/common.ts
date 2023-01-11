import dotenv from "dotenv";
import { Ed25519Keypair, JsonRpcProvider, RawSigner } from "@mysten/sui.js";
dotenv.config();


const seed = process.env.seed || '';
const seedArr = _getSeedFromBase64String(seed);
const keypair = Ed25519Keypair.fromSeed(seedArr);
export const provider = new JsonRpcProvider();
export const signer = new RawSigner(keypair, provider);
console.log(signer.getAddress());

// Sui stores key like this:
// base64解析出65位数据
// 第0位代表加密类型
// 1到32位代表public key
// 33到64位代表secret key
function _getSeedFromBase64String(b64: string) {
  return Uint8Array.prototype.slice.call(Buffer.from(b64, "base64"), 33);
}
