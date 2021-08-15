import { Position, Direction, TileType } from './utils';

export class Backpack {
    private stack: TileType[];

    constructor(stack: TileType[] = []) {
        this.stack = [...stack];
    }

    public clone(): Backpack {
        return new Backpack(this.stack);
    }

    public push(tile: TileType) {
        this.stack.push(tile);
    }

    public pop(): TileType {
        let tile = this.stack.pop();

        if (tile == undefined) throw "Empty Stack";

        return tile;
    }

    public peek(depth: number = 0): TileType {
        return this.stack[this.stack.length - depth - 1];
    }

    public empty(): boolean {
        return this.stack.length == 0;
    }

    public size(): number {
        return this.stack.length;
    }

    public raw(): TileType[] {
        return [...this.stack];
    }
}

export class Player {
    public direction: Direction;
    public alive: boolean;

    private __position: Position;
    private __backpack: Backpack;
    
    constructor(position: Position) {
        this.__position = position.clone();
        this.__backpack = new Backpack();
        this.direction = Direction.RIGHT;
        this.alive = true;
    }

    public get position(): Position {
        return this.__position.clone();
    }

    public get backpack(): Backpack {
        return this.__backpack;
    }

    public raw() {
        return {
            position: this.__position.raw(),
            direction: this.direction,
            stack: this.__backpack.raw()
        }
    }

    public clone(): Player {
        let newPlayer = new Player(this.position);
        newPlayer.__backpack = this.__backpack.clone();
        newPlayer.direction = this.direction;
        newPlayer.alive = this.alive;

        return newPlayer;
    }

    public step(): boolean {
        if(!this.alive) return false;

        switch(this.direction) {
            case Direction.LEFT:
            case Direction.RIGHT:
                this.__position.x += this.direction * 2 - 1;
                break;
            case Direction.UP:
            case Direction.DOWN:
                this.__position.y += (this.direction - 2) * 2 - 1;
                break;
        }

        return true;
    }
}
