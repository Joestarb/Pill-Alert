import * as CryptoJS from "crypto-js";

export function hashPassword(password: string, secret: string): string {
  return CryptoJS.HmacSHA256(password, secret).toString(CryptoJS.enc.Hex);
}
