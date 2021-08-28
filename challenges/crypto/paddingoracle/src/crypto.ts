import crypto from "crypto";

const KEY = crypto.randomBytes(16);

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-128-cbc", KEY, iv);
  return Buffer.concat([iv, cipher.update(text), cipher.final()]).toString(
    "hex"
  );
};

export const decrypt = (enc: string) => {
  const buffer = Buffer.from(enc, "hex");
  const iv = buffer.slice(0, 16);
  const cipher = crypto.createDecipheriv("aes-128-cbc", KEY, iv);
  return Buffer.concat([
    cipher.update(buffer.slice(16)),
    cipher.final(),
  ]).toString("utf-8");
};
