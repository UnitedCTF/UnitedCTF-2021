if (process.argv.length !== 4) {
  console.error(`${process.argv[1]} src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-3121a5fddb7521dd8dcf8a71de0c5bf96f08fa8e
(async () => {
  const [SRC, DST] = process.argv.slice(2);
  const data = await fs.readFile(SRC);

  // erase the IDAT checksums AND length
  for (let i = 8; i < data.length; ) {
    const length = data.slice(i, (i += 4)).readUInt32BE(0);
    const header = data.slice(i, (i += 4)).toString();
    if (header === "IDAT") {
      // erase length
      data.writeUInt32BE(0, i - 8);
      // erase checksum
      data.writeUInt32BE(0, i + length);
    } 

    i += length + 4;
  }

  await fs.writeFile(DST, data);
})();
