import { Position, TileType, Tile, PositionIndex } from './utils';

function longestRow(grid: any[][]): number {
    let maxLength = 0;

    for(let row of grid) {
        maxLength = Math.max(maxLength, row.length);
    }

    return maxLength;
}

export class World {
    private __grid: TileType[][];
    private __drops: Set<PositionIndex>;
    private __updateQueue: { [key: string]: TileType };
    
    constructor(grid: TileType[][]) {
        this.__updateQueue = {};
        this.__grid = grid;

        this.__drops = new Set<PositionIndex>();
        this.__grid.forEach((row, y) => row.forEach((tile, x) => {
            if(tile == Tile.DROP) {
                this.__drops.add(new Position(x, y).toString());
            }
        }))

        let gridWidth = longestRow(this.__grid);
        this.__grid = this.__grid.map(row => [...row, ...new Array(gridWidth - row.length).fill(Tile.EMPTY)]);
    }

    public raw() {
        return this.__grid.map(row => row.map(tile => tile));
    }

    public step() {
        this.updateTiles();
    }

    public getTile(position: Position): TileType {
        return this.__grid[position.y][position.x];
    }

    public putTile(position: Position, tile: TileType) {
        if(tile == Tile.DROP) {
            this.__drops.add(position.toString());
        }

        this.__updateQueue[position.toString()] = tile;
    }

    public popTile(position: Position): TileType {
        let tile = this.getTile(position);

        if(this.isDrop(position)) this.deleteTile(position);

        return tile;
    }

    public deleteTile(position: Position) {
        this.putTile(position, Tile.EMPTY);
    }

    private updateTiles() {
        Object.entries(this.__updateQueue).forEach(([positionIndex, tile]) => {
            let position = Position.from(positionIndex);

            if(tile == Tile.EMPTY && this.isDrop(position)) tile = Tile.DROP;

            this.setTile(position, tile as TileType);
        });

        this.__updateQueue = {};
    }

    private setTile(position: Position, tile: TileType) {
        this.__grid[position.y][position.x] = tile;
    }

    private isDrop(position: Position): boolean {
        return this.__drops.has(position.toString());
    }
}
