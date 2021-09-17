if (process.argv.length < 5) {
  console.error(`${process.argv[1]} [break|repair] src dst ...path?`);
  process.exit(1);
}

import * as fs from "fs/promises";
import * as zlib from "zlib";

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
  const [ACTION, SRC, DST] = process.argv.slice(2);
  if (ACTION[0] === "b") {
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

    const chunk_size = idat_chunks.reduce((a, b) => {
      if (b[2].length > a) return b[2].length;
      return a;
    }, 0);

    do {
      shuffle(idat_chunks);
    } while (
      // make sure the first and last block are not in the first or last position
      idat_chunks[0][2][0] === 0x78 ||
      idat_chunks[0][2].length === chunk_size ||
      idat_chunks[idat_chunks.length - 1][2].length !== chunk_size
    );
    const iend = chunks.pop();
    chunks.push(...idat_chunks);
    chunks.push(iend);

    let new_data = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    for (let i = 0; i < chunks.length; ++i) {
      new_data = Buffer.concat([new_data, ...chunks[i]]);
    }

    await fs.writeFile(DST, new_data);
  } else if (ACTION[0] === "r") {
    const orig_data = await fs.readFile(SRC);

    const chunks: Buffer[][] = [];
    const idat_chunks: Buffer[][] = [];

    // extract all the chunks
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

    // find the IDAT chunk size
    const chunk_size = idat_chunks.reduce((a, b) => {
      if (b[2].length > a) return b[2].length;
      return a;
    }, 0);

    // extract the first IDAT which starts with 0x78
    const fc = idat_chunks.splice(
      idat_chunks.findIndex((c) => c[2][0] === 0x78),
      1
    )[0];

    // extract the last IDAT which is of a different length
    const lc = idat_chunks.splice(
      idat_chunks.findIndex((c) => c[2].length !== chunk_size),
      1
    )[0];
    const iend = chunks.pop();

    // every time you call this script, you need to append the path which makes the image viewable
    const path = process.argv.slice(5).map(Number);
    const stop = path.length + 1;
    (async function reorder_idat(path: number[], idat_chunks: Buffer[][]) {
      if (path.length === stop || path.length > idat_chunks.length) {
        console.log("possible", path.join("-"));
        await fs.writeFile(
          DST + path.join("-") + ".png",
          Buffer.concat([
            Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
            ...chunks.reduce((a, b) => [...a, ...b], []),
            ...fc,
            ...path
              .map((i) => idat_chunks[i])
              .filter((s) => !!s)
              .reduce((a, b) => [...a, ...b], []),
            ...lc,
            ...iend,
          ])
        );
        return;
      }

      for (let i = 0; i < idat_chunks.length; ++i) {
        if (path.indexOf(i) !== -1) continue;
        try {
          const test = Buffer.concat([
            fc[2],
            ...path.map((i) => idat_chunks[i][2]),
            idat_chunks[i][2],
            lc[2],
          ]);
          zlib.inflateSync(test);
        } catch (e) {
          if (e.message === "unexpected end of file")
            await reorder_idat([...path, i], idat_chunks);
        }
      }
    })(path, idat_chunks);
  } else {
    console.error(`${process.argv[1]} [break|repair] src dst ok?`);
    process.exit(1);
  }
})();
