import crypto from "crypto";

const KEY = crypto.randomBytes(16);

const SLEEP_TIME = Number(process.env.SLEEP_TIME || 0);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const sign = (text: string) =>
  crypto.createHash("sha512").update(text).digest("hex").slice(0, 16);

export const encrypt = async (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-128-cbc", KEY, iv);
  return Buffer.concat([
    iv,
    cipher.update(text),
    cipher.update(sign(text)),
    cipher.final(),
  ]).toString("hex");
};

export const decrypt = async (enc: string) => {
  const buffer = Buffer.from(enc, "hex");
  const iv = buffer.slice(0, 16);
  const cipher = crypto.createDecipheriv("aes-128-cbc", KEY, iv);
  const check = Buffer.concat([
    cipher.update(buffer.slice(16)),
    cipher.final(),
  ]);

  const sig = check.slice(-16).toString("utf-8");
  const plaintext = check.slice(0, -16).toString("utf-8");

  if (sig === sign(plaintext)) return plaintext;

  // simulate hard work
  await sleep(SLEEP_TIME);

  throw new Error("bad check");
};
