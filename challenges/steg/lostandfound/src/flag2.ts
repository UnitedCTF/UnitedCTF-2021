if (process.argv.length !== 4) {
  console.error(`${process.argv[1]} src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

// FLAG-05e03c712aca474128f237d74d86cc0f225df863
(async () => {
  const [SRC, DST] = process.argv.slice(2);
  const orig_data = await fs.readFile(SRC);
  const new_data = Buffer.alloc(orig_data.length);

  // inverse the png
  for (let i = 0; i < orig_data.length; ++i) {
    new_data[new_data.length - 1 - i] = orig_data[i];
  }

  await fs.writeFile(DST, new_data);
})();
