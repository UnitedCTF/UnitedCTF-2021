if (process.argv.length !== 4) {
  console.error(`${process.argv[1]} src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-b0de49381751079643f0aaefdbcb9ee25be7f845
(async () => {
  const [SRC, DST] = process.argv.slice(2);
  const data = await fs.readFile(SRC);

  // set the dimensions to 1x1
  for (let i = 16; i < 16 + 8; i += 4) {
    data.writeUInt32BE(1, i);
  }

  await fs.writeFile(DST, data);
})();
