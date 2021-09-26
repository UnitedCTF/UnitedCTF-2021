import { Random } from "./random";

const CHANCE_FOR_WAVE = Number(process.env.CHANCE_FOR_WAVE || 0.15);

export interface Ship {
  length: number;
  orientation: "N" | "E" | "S" | "W";
}

export interface PlacedShip extends Ship {
  hits: number;
  coords: number[];
  tiles: number[][];
}

export enum ShootStatus {
  OUT_OF_BOUNDS,
  ALREADY_SHOT_THERE,
  GAME_ENDED,
  SHOT_HIT,
  SHOT_HIT_AND_SUNK,
  SHOT_MISS,
}

export enum BoardStatus {
  WON_THE_GAME,
  LOST_THE_GAME,
  GAME_IN_PROGRESS,
}

export enum Tile {
  EMPTY,
  SHIP,
  MISS_SHOT,
  HIT_SHOT,
}

class Board {
  private _status: BoardStatus = BoardStatus.GAME_IN_PROGRESS;

  private _width: number;
  private _height: number;
  private _tiles: number[][] = [];
  private _default_ships: Ship[] = [];
  private _max_shots: number = 0;
  private _ships: PlacedShip[] = [];
  private _shots_left: number = 0;
  private _shots_to_hit: number = 0;
  private _rng: Random;

  constructor(
    width: number,
    height: number,
    ships: number[],
    max_shots: number
  ) {
    this._rng = new Random();

    this._width = Math.max(width, 0) || 10;
    this._height = Math.max(height, 0) || 10;
    this._default_ships = ships.map((length) => ({
      orientation: this._rng.pick(["N", "E", "S", "W"]),
      length,
    }));
    this._max_shots = max_shots;

    this.init();
  }

  public init() {
    this._shots_left = this._max_shots;
    this._shots_to_hit = 0;
    this._status = BoardStatus.GAME_IN_PROGRESS;
    this._ships = [];
    this._tiles = [];

    for (let i = 0; i < this._width; ++i) {
      this._tiles.push([]);
      for (let j = 0; j < this._height; ++j)
        this._tiles[this._tiles.length - 1].push(Tile.EMPTY);
    }

    for (
      let i = 0, z = 0, ship = this._default_ships[0];
      i < this._default_ships.length;
      ship = this._default_ships[++i]
    ) {
      this._shots_to_hit += ship.length;
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
              if (this._tiles[x][y - j] !== Tile.EMPTY) ok = false;
              ship_tiles.push([x, y - j]);
              break;
            case "E":
              if (this._tiles[x + j][y] !== Tile.EMPTY) ok = false;
              ship_tiles.push([x + j, y]);
              break;
            case "S":
              if (this._tiles[x][y + j] !== Tile.EMPTY) ok = false;
              ship_tiles.push([x, y + j]);
              break;
            case "W":
              if (this._tiles[x - j][y] !== Tile.EMPTY) ok = false;
              ship_tiles.push([x - j, y]);
              break;
          }
          if (!ok) break;
        }

        if (!ok) continue;
        ship_tiles.forEach(([x, y]) => (this._tiles[x][y] = Tile.SHIP));
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

  public shoot(x: number, y: number): ShootStatus {
    if (this._status !== BoardStatus.GAME_IN_PROGRESS)
      return ShootStatus.GAME_ENDED;
    else if (x < 0 || x >= this._width || y < 0 || y >= this._height)
      return ShootStatus.OUT_OF_BOUNDS;
    switch (this._tiles[x][y]) {
      case Tile.EMPTY:
        this._tiles[x][y] = Tile.MISS_SHOT;
        this._shots_left--;
        if (this._shots_left === 0) this._status = BoardStatus.LOST_THE_GAME;
        return ShootStatus.SHOT_MISS;
      case Tile.SHIP:
        this._tiles[x][y] = Tile.HIT_SHOT;
        const ship_hit = this._ships.find((ship) =>
          ship.tiles.some(([sx, sy]) => sx === x && sy === y)
        );

        ship_hit.hits++;
        this._shots_left--;
        this._shots_to_hit--;

        if (this._shots_to_hit === 0) this._status = BoardStatus.WON_THE_GAME;
        else if (this._shots_left === 0 && this._shots_to_hit > 0)
          this._status = BoardStatus.LOST_THE_GAME;

        return ship_hit.hits === ship_hit.length
          ? ShootStatus.SHOT_HIT_AND_SUNK
          : ShootStatus.SHOT_HIT;
      case Tile.MISS_SHOT:
      case Tile.HIT_SHOT:
        return ShootStatus.ALREADY_SHOT_THERE;
    }
  }

  public getShotsToHit() {
    return this._shots_to_hit;
  }

  public getShotsLeft() {
    return this._shots_left;
  }

  public getStatus(): BoardStatus {
    return this._status;
  }

  public printBoard(withShips: boolean = false) {
    let output = "";
    output +=
      "#" + "- ".repeat(this._width).substr(0, this._width * 2 - 1) + "#\n";
    for (let i = 0; i < this._height; ++i) {
      output += "|";
      for (let j = 0; j < this._width; ++j) {
        switch (this._tiles[j][i]) {
          case Tile.EMPTY:
            output += this._rng.roll(CHANCE_FOR_WAVE) ? "~" : " ";
            break;
          case Tile.SHIP:
            if (withShips) output += "#";
            else output += this._rng.roll(CHANCE_FOR_WAVE) ? "~" : " ";
            break;
          case Tile.HIT_SHOT:
            output += "X";
            break;
          case Tile.MISS_SHOT:
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
}

export default Board;
