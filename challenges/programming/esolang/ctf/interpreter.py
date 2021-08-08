from .player import Player
from .world import World
from .enums import Tile
from .operator import Operator

from typing import List

class Interpreter:
    __players: List[Player]
    __world: World

    def __init__(self, code: bytes):
        self.__players = []

        grid = [[c for c in row.rstrip().replace(b'\t', b' ')] for row in code.split(b'\n')]
        player_pos = []

        for y, row in enumerate(grid):
            for x, v in enumerate(row):
                if v == Tile.PLAYER.value:
                    player_pos.append((x, y))

        for pos in player_pos:
            self.__players.append(Player(pos))
            grid[pos[1]][pos[0]] = Tile.EMPTY.value
        
        self.__world = World(grid)

    @property
    def input(self) -> str:
        return self.__world.input

    @property
    def output(self) -> str:
        return self.__world.output

    def step(self) -> bool:
        for player in self.__players:
            if player.alive: break
        else: return False

        for player in self.__players:
            if player.step():
                Operator.parse(player, self.__world)

        self.__world.step()

        for player in self.__world.new_players:
            self.__players.append(player)

        self.__world.new_players = []

        return True

    def visualize(self):
        grid = self.__world.raw()

        for player in self.__players:
            if player.alive:
                grid[player.position[1]][player.position[0]] = Tile.PLAYER.value

        for row in grid:
            print(bytes(row).decode('utf8'))

        print()

        for player in self.__players:
            if player.alive:
                print(player)

        print("Input:", self.__world.input)
        print("Output:", self.__world.output, '\n')
