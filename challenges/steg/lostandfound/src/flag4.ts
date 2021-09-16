if (process.argv.length !== 5) {
  console.error(`${process.argv[1]} [break|repair] src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

const crc32 = (() => {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table.push(c);
  }

  return (buf: Buffer, crc: number = 0) => {
    crc = crc ^ -1;
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
    }
    crc = crc ^ -1;
    return crc >>> 0;
  };
})();

// FLAG-3121a5fddb7521dd8dcf8a71de0c5bf96f08fa8e
(async () => {
  const [ACTION, SRC, DST] = process.argv.slice(2);
  if (ACTION[0] === "b") {
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
  } else if (ACTION === "r") {
    const data = await fs.readFile(SRC);

    // erase the IDAT checksums AND length
    for (let i = 8; i < data.length; ) {
      let length = data.slice(i, (i += 4)).readUInt32BE(0);
      const header = data.slice(i, (i += 4)).toString();

      if (header === "IDAT") {
        // length is invalid, read until next IDAT or IEND
        while (true) {
          const r = data.readUInt32BE(i + length);
          if (r === 0x49454e44 || r === 0x49444154) break;
          length++;
        }
        length -= 8; // backtrack header and checksum
        // rewrite length
        data.writeUInt32BE(length, i - 8);
        // rewrite checksum
        const checksum = crc32(data.slice(i - 4, i + length));
        data.writeUInt32BE(checksum, i + length);
      }

      i += length + 4;
    }

    await fs.writeFile(DST, data);
  } else {
    console.error(`${process.argv[1]} [break|repair] src dst`);
    process.exit(1);
  }
})();
