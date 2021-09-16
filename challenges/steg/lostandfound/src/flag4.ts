if (process.argv.length !== 4) {
  console.error(`${process.argv[1]} src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-3121a5fddb7521dd8dcf8a71de0c5bf96f08fa8e
(async () => {
  const [SRC, DST] = process.argv.slice(2);
  const data = await fs.readFile(SRC);

  // erase the IDAT checksums
  for (let i = 8; i < data.length; ) {
    const length = data.slice(i, (i += 4)).readUInt32BE(0);
    const header = data.slice(i, (i += 4)).toString();
    i += length + 4; // skip checksum
    if (header === "IDAT") {
      for (let j = i - 4; j < i; ++j) {
        data[j] = 0;
      }
    }
  }

  await fs.writeFile(DST, data);
})();
