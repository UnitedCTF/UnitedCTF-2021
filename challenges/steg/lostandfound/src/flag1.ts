if (process.argv.length !== 5) {
  console.error(`${process.argv[1]} [break|repair] src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-54f1e31c38110fc3a81de08c63405862040acbcd
(async () => {
  const [ACTION, SRC, DST] = process.argv.slice(2);
  if (ACTION[0] === "b") {
    const data = await fs.readFile(SRC);
    data.writeBigUInt64BE(BigInt(0));
    await fs.writeFile(DST, data);
  } else if (ACTION[0] === "r") {
    const data = await fs.readFile(SRC);
    data.writeBigUInt64BE(BigInt("0x89504e470d0a1a0a"));
    await fs.writeFile(DST, data);
  } else {
    console.error(`${process.argv[1]} [break|repair] src dst`);
    process.exit(1);
  }
})();
