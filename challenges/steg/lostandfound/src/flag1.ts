if (process.argv.length !== 4) {
  console.error(`${process.argv[1]} src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-54f1e31c38110fc3a81de08c63405862040acbcd
(async () => {
  const [SRC, DST] = process.argv.slice(2);
  const data = await fs.readFile(SRC);

  // erase the header
  for (let i = 0; i < 8; ++i) {
    data[i] = 0;
  }

  await fs.writeFile(DST, data);
})();
