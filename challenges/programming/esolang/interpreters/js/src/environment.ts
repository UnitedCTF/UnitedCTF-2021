import { parseOperator } from './operator';
import { Player } from './player';
import { TileType } from './utils';
import { World } from './world';

export class Environment {
    private __input: string;
    private __output: string;
    private __players: Player[];
    private __world: World;
    private __newPlayers: Player[];
    private __inputFunction: () => string;

    constructor(players: Player[], world: World, inputFunction: () => string) {
        this.__players = players;
        this.__world = world;
        this.__newPlayers = [];
        this.__input = "";
        this.__output = "";
        this.__inputFunction = inputFunction;
    }

    public get input() {
        return this.__input;
    }

    public get output() {
        return this.__output;
    }

    public get world() {
        return this.__world;
    }

    public raw() {
        return {
            grid: this.world.raw(),
            pointers: this.__players.filter(player => player.alive).map(player => player.raw())
        }
    }

    public step(): boolean {
        if(this.__players.every(player => !player.alive)) return false;

        this.__players.forEach(player => {
            if(player.step()) {
                parseOperator(player, this);
            }
        });

        this.__world.step();
        this.__players = [...this.__players, ...this.__newPlayers];
        this.__newPlayers = [];

        return true;
    }

    public addPlayer(player: Player) {
        this.__newPlayers.push(player);
    }

    public print(data: string) {
        this.__output += data;
    }

    public popInput(): TileType {
        if(this.__input.length == 0) {
            this.__input = this.__inputFunction();
        }

        if(this.__input.length == 0) {
            this.__input = "\x00";
        }

        let nextChar = this.__input[0];

        this.__input = this.__input.substring(1);

        return nextChar;
    }

    public isInputEmpty(): boolean {
        return this.__input.length == 0;
    }
}
