if (process.argv.length !== 5) {
  console.error(`${process.argv[1]} [break|repair] src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-b0de49381751079643f0aaefdbcb9ee25be7f845
(async () => {
  const [ACTION, SRC, DST] = process.argv.slice(2);
  if (ACTION[0] === "b") {
    const data = await fs.readFile(SRC);
    data.writeUInt32BE(1, 16);
    data.writeUInt32BE(1, 20);
    await fs.writeFile(DST, data);
  } else if (ACTION[0] === "r") {
    const data = await fs.readFile(SRC);
    data.writeUInt32BE(2000, 16);
    data.writeUInt32BE(1333, 20);
    await fs.writeFile(DST, data);
  } else {
    console.error(`${process.argv[1]} [break|repair] src dst`);
    process.exit(1);
  }
})();
