import { Environment } from "./environment"
import { Player } from "./player";
import { Position, Tile, TileType } from "./utils";
import { World } from "./world";

export class Interpreter {
    private __code: string;
    private __inputFunction: () => string;
    private __environment: Environment;

    constructor(code: string, inputFunction: () => string) {
        this.__code = code;
        this.__inputFunction = inputFunction;
        this.__environment = this.getEnvironment();
    }

    public get input(): string {
        return this.__environment.input;
    }

    public get output(): string {
        return this.__environment.output;
    }

    public raw() {
        return this.__environment.raw();
    }

    public reset() {
        this.__environment = this.getEnvironment();
    }

    public step(): boolean {
        return this.__environment.step();
    }

    public run(): string {
        while(this.step());
        return this.output;
    }

    public visualize() {
        let raw = this.raw();
        let grid = raw.grid;
        let pointers = raw.pointers;

        pointers.forEach(pointer => grid[pointer.position[1]][pointer.position[0]] = '@');

        grid.forEach(row => console.log(row.join('')));
        pointers.forEach(pointer => console.log(pointer.stack));
        console.log("Input:", this.input);
        console.log("Output:", this.output);
        console.log();
    }

    private getGrid(code: string): TileType[][] {
        return code.split('\n').map(row => row.trimEnd().replace('\t', ' ').split(''));
    }

    private getPlayerPositions(grid: TileType[][]) {
        let playerPositions: Position[] = [];

        grid.forEach((row, y) => row.forEach((tile, x) => {
            if(tile == Tile.PLAYER) playerPositions.push(new Position(x, y));
        }))

        return playerPositions;
    }

    private getEnvironment() {
        let grid = this.getGrid(this.__code);
        let playerPositions = this.getPlayerPositions(grid);

        let players: Player[] = playerPositions.map(position => {
            grid[position.y][position.x] = Tile.EMPTY;
            return new Player(position);
        });

        let world = new World(grid);

        return new Environment(players, world, this.__inputFunction);
    }
}
