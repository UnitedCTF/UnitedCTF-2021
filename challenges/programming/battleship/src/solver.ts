import dotenv from "dotenv";
dotenv.config();

import net from "net";
import { Random } from "./random";

class FakeBoard {
  private _width: number;
  private _height: number;
  private _tiles: number[][];
  private _default_ships: {
    length: number;
    orientation: "N" | "E" | "S" | "W";
  }[] = [];
  private _ships: {
    length: number;
    orientation: "N" | "E" | "S" | "W";
    hits: number;
    coords: number[];
    tiles: number[][];
  }[] = [];
  private _rng: Random;

  constructor(random: Random) {
    this._rng = random;

    this._width = 8;
    this._height = 8;
    this._default_ships = [2, 3, 4, 5].map((length) => ({
      orientation: this._rng.pick(["N", "E", "S", "W"]),
      length,
    }));

    this.init();
  }

  public init() {
    this._ships = [];
    this._tiles = [...Array(this._height)].map((_) =>
      [...Array(this._width)].map((_) => 0)
    );

    for (
      let i = 0, z = 0, ship = this._default_ships[0];
      i < this._default_ships.length;
      ship = this._default_ships[++i]
    ) {
      while (true) {
        if (z > 25) {
          ship.orientation = this._rng.pick(["N", "E", "S", "W"]);
          z = 0;
        }
        z++;
        const x = ~~this._rng.nextRange(
          ship.orientation === "W" ? ship.length + 1 : 0,
          ship.orientation === "E" ? this._width - ship.length : this._width
        );

        const y = ~~this._rng.nextRange(
          ship.orientation === "N" ? ship.length + 1 : 0,
          ship.orientation === "S" ? this._height - ship.length : this._height
        );

        let ok = true;
        const ship_tiles: number[][] = [];
        for (let j = 0; j < ship.length; ++j) {
          switch (ship.orientation) {
            case "N":
              if (this._tiles[x][y - j] !== 0) ok = false;
              ship_tiles.push([x, y - j]);
              break;
            case "E":
              if (this._tiles[x + j][y] !== 0) ok = false;
              ship_tiles.push([x + j, y]);
              break;
            case "S":
              if (this._tiles[x][y + j] !== 0) ok = false;
              ship_tiles.push([x, y + j]);
              break;
            case "W":
              if (this._tiles[x - j][y] !== 0) ok = false;
              ship_tiles.push([x - j, y]);
              break;
          }
          if (!ok) break;
        }

        if (!ok) continue;
        ship_tiles.forEach(([x, y]) => (this._tiles[x][y] = 1));
        this._ships.push({
          ...ship,
          hits: 0,
          coords: [x, y],
          tiles: ship_tiles,
        });
        break;
      }
    }
  }

  public printBoard() {
    let output = "";
    output +=
      "#" + "- ".repeat(this._width).substr(0, this._width * 2 - 1) + "#\n";
    for (let i = 0; i < this._height; ++i) {
      output += "|";
      for (let j = 0; j < this._width; ++j) {
        switch (this._tiles[j][i]) {
          case 0:
            output += this._rng.roll(0.15) ? "~" : " ";
            break;
          case 1:
            if (true) output += "#";
            else output += this._rng.roll(0.15) ? "~" : " ";
            break;
          case 2:
            output += "X";
            break;
          case 3:
            output += "O";
            break;
        }
        if (j + 1 < this._width) output += " ";
      }
      output += "|\n";
    }
    output +=
      "#" + "- ".repeat(this._width).substr(0, this._width * 2 - 1) + "#\n";
    return output;
  }

  public clear() {
    this._ships = [];
  }

  public getShips() {
    return this._ships;
  }
}

class HeatMap {
  private _hits: number[][] = [];
  private _tiles: number[][];
  private _boards: FakeBoard[];

  constructor(boards: FakeBoard[]) {
    this._boards = boards;
    this.genmap();
  }

  reinit() {
    this._hits = [];
    for (let board of this._boards) board.init();
    this.genmap();
  }

  genmap() {
    this._tiles = [...Array(8)].map((_) => [...Array(8)].map((_) => 0));

    for (let board of this._boards)
      for (let ship of board.getShips())
        for (let tile of ship.tiles) this._tiles[tile[0]][tile[1]] += 1;
  }

  updateMap(x: number, y: number, hit: boolean): void {
    this._hits.push([x, y, hit ? 1 : 0]);

    for (let board of this._boards) {
      let ok = false;
      for (let ship of board.getShips()) {
        for (let tile of ship.tiles) {
          if (tile[0] === x && tile[1] === y) {
            ok = true;
            if (!hit) board.clear();
            break;
          }
        }
        if (ok) break;
      }
      if (!ok && hit) board.clear();
    }

    this._boards = this._boards.filter((b) => b.getShips().length > 0);
    this.genmap();
  }

  nextCoords(): number[] {
    let max = { x: 0, y: 0, c: -1 };
    for (let i = 0; i < this._tiles.length; ++i)
      for (let j = 0; j < this._tiles[i].length; ++j)
        if (this._hits.some((hit) => hit[0] === i && hit[1] === j)) continue;
        else if (this._tiles[i][j] > max.c)
          max = { x: i, y: j, c: this._tiles[i][j] };
    return [max.x, max.y];
  }

  getBoards() {
    return this._boards;
  }
}

const aw = (fn) => new Promise((resolve) => fn(resolve));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  let data = "";
  const socket = net
    .connect({
      host: "localhost",
      port: Number(process.env.PORT || 5000),
    })
    .on("data", (d) => (data += d.toString()))
    .once("error", () => process.exit(0));

  await aw(socket.once.bind(socket, "connect"));
  const now = Date.now();

  // flush headers
  await sleep(1000);
  data = "";

  const boards = [];
  const range = 5000;
  for (let i = -range; i < range; ++i)
    boards.push(new FakeBoard(new Random(now + i, now + i, now + i)));

  const map = new HeatMap(boards);
  while (true) {
    const [x, y] = map.nextCoords();

    await aw(socket.write.bind(socket, `shoot ${x} ${y}`));
    await sleep(250);
    console.log(data.substr(0, data.length - 2).trim());

    if (data.indexOf("won") !== -1 || data.indexOf("flag") !== -1) {
      data = "";
      map.reinit();
      continue;
    }

    map.updateMap(x, y, data.indexOf("miss") === -1);
    data = "";
  }
})();
