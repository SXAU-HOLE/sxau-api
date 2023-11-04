import Crypto from "crypto-js"

const keyStr = "qzkj1kjghd=876&*"
export function encrypt(input: string) {
  const key = Crypto.enc.Utf8.parse(keyStr)

  const enpwd = Crypto.AES.encrypt(input, key, {
    mode: Crypto.mode.ECB,
    padding: Crypto.pad.Pkcs7,
  }).toString()

  return global.btoa(enpwd)
}
