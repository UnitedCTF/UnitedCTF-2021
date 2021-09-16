import { Player } from './player';
import { Direction, Tile, TileType } from './utils';
import { World } from './world';
import { Environment } from './environment';

function getTile(player: Player, world: World): TileType {
    return world.getTile(player.position);
}

abstract class Operator {
    public abstract canParse(tile: TileType): boolean;
    public abstract parse(player: Player, environment: Environment): void;
}

class Flag extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.FLAG;
    }

    public parse(player: Player, environment: Environment) {
        player.alive = false;
    }
}

class Push extends Operator {
    public canParse(tile: TileType): boolean {
        return /[A-Z0-9]/.test(tile);
    }

    public parse(player: Player, environment: Environment) {
        player.backpack.push(environment.world.popTile(player.position));
    }
}

class Space extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.SPACE;
    }

    public parse(player: Player, environment: Environment) {
        environment.world.popTile(player.position);
        player.backpack.push(' ');
    }
}

class Turn extends Operator {
    public canParse(tile: TileType): boolean {
        return [Tile.LEFT, Tile.RIGHT, Tile.UP, Tile.DOWN].find(direction => direction == tile) != null;
    }

    private getDirection(tile: TileType): Direction {
        switch(tile) {
            case Tile.LEFT:
                return Direction.LEFT;
            case Tile.RIGHT:
                return Direction.RIGHT;
            case Tile.UP:
                return Direction.UP;
            case Tile.DOWN:
                return Direction.DOWN;
            default:
                throw "Unknown tile direction";
        }
    }

    public parse(player: Player, environment: Environment) {
        let tile = getTile(player, environment.world);
        player.direction = this.getDirection(tile);
    }
}

class Copy extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.COPY;
    }

    public parse(player: Player, environment: Environment) {
        player.backpack.push(player.backpack.peek());
    }
}

class Drop extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.DROP;
    }

    public parse(player: Player, environment: Environment) {
        if(player.backpack.empty()) return;

        let tile = player.backpack.pop();
        switch(tile) {
            case Tile.PLAYER:
                let newPlayer = player.clone();
                newPlayer.direction = Direction.RIGHT;
                environment.addPlayer(newPlayer);
                break;
            default:
                environment.world.putTile(player.position, tile);
        }
    }
}

class Pop extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.POP;
    }

    public parse(player: Player, environment: Environment) {
        if(player.backpack.empty()) return;

        player.backpack.pop();
    }
}

class Print extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.PRINT;
    }

    public parse(player: Player, environment: Environment) {
        environment.print(player.backpack.pop());
    }
}

class Equal extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.EQUAL;
    }

    public parse(player: Player, environment: Environment) {
        if (player.backpack.size() < 2) return;
        if (player.backpack.peek(0) != player.backpack.peek(1)) return;

        player.step();
    }
}

class Add extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.ADD;
    }

    public parse(player: Player, environment: Environment) {
        let a = player.backpack.pop().charCodeAt(0);
        let b = player.backpack.pop().charCodeAt(0);

        player.backpack.push(String.fromCharCode(a + b));
    }
}

class Subtract extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.SUBTRACT;
    }

    public parse(player: Player, environment: Environment) {
        let a = player.backpack.pop().charCodeAt(0);
        let b = player.backpack.pop().charCodeAt(0);

        player.backpack.push(String.fromCharCode(b - a));
    }
}

class Input extends Operator {
    public canParse(tile: TileType): boolean {
        return tile == Tile.INPUT;
    }

    public parse(player: Player, environment: Environment) {
        player.backpack.push(environment.popInput());
    }
}

const OPERATORS: Operator[] = [
    new Flag(), 
    new Push(),
    new Space(),
    new Turn(),
    new Copy(),
    new Drop(),
    new Pop(),
    new Print(),
    new Equal(),
    new Add(),
    new Subtract(),
    new Input(),
];

export function parseOperator(player: Player, environment: Environment) {
    let tile = getTile(player, environment.world);
    let operator = OPERATORS.find(operator => operator.canParse(tile));

    if (operator == undefined) return;

    operator.parse(player, environment);
}
