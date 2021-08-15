export type TileType = string;
export type PositionIndex = string;

export class Position {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public static from(index: PositionIndex): Position {
        let [x, y] = index.split(',').map(v => parseInt(v));
        return new Position(x, y);
    }

    public raw() {
        return [this.x, this.y];
    }

    public clone(): Position {
        return new Position(this.x, this.y);
    }

    public toString(): string {
        return `${this.x},${this.y}`;
    }
}

export enum Tile {
    EMPTY = ' ',
    PLAYER = '@',
    PRINT = '.',
    LEFT = '<',
    RIGHT = '>',
    UP = '^',
    DOWN = 'v',
    EQUAL = '=',
    POP = '!',
    COPY = '$',
    FLAG = '#',
    DROP = '_',
    SPACE = '?',
    ADD = '+',
    SUBTRACT = '-',
    INPUT = ','
}

export enum Direction {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}
