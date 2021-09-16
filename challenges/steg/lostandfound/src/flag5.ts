if (process.argv.length !== 4) {
  console.error(`${process.argv[1]} src dst`);
  process.exit(1);
}

import * as fs from "fs/promises";

function shuffle(array: any[]): any[] {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// FLAG-ebe32162102a7d4a54e33b23ee08e949d6a91841
(async () => {
  const [SRC, DST] = process.argv.slice(2);
  const orig_data = await fs.readFile(SRC);

  const chunks: Buffer[][] = [];
  const idat_chunks: Buffer[][] = [];

  // scramble IDAT segments
  for (let i = 8; i < orig_data.length; ) {
    const length = orig_data.slice(i, (i += 4));
    const header = orig_data.slice(i, (i += 4));
    const data = orig_data.slice(i, (i += length.readUInt32BE(0)));
    const checksum = orig_data.slice(i, (i += 4));

    const str_header = header.toString();
    (str_header !== "IDAT" ? chunks : idat_chunks).push([
      length,
      header,
      data,
      checksum,
    ]);
  }

  const chunk_size = idat_chunks[1][2].length;
  do {
    shuffle(idat_chunks);
  } while (
    // make sure the first and last block are not in the first or last position
    idat_chunks[0][2][0] !== 0x78 ||
    idat_chunks[0][2].length !== chunk_size ||
    idat_chunks[idat_chunks.length - 1][2].length !== chunk_size
  );
  const iend = chunks.pop();
  chunks.push(...idat_chunks);
  chunks.push(iend);

  let new_data = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  for (let i = 0; i < chunks.length; ++i) {
    new_data = Buffer.concat([new_data, ...chunks[i]]);
  }

  await fs.writeFile(DST, new_data);
})();
