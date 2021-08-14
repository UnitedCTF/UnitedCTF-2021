import string
from .player import Player
from .enums import Tile

from typing import List, Dict, Tuple, Set

class World:
    __grid: List[List[int]]
    __drops: Set[Tuple[int, int]]
    __update_queue: Dict[Tuple[int, int], int]
    __output: List[int]
    __input: List[int]
    new_players: List['Player']

    def __init__(self, grid: List[List[int]]):
        self.__grid = grid

        width = len(max(self.__grid, key=lambda x: len(x)))
        for row in self.__grid:
            row += [Tile.EMPTY.value] * width

        self.__drops = set()
        self.new_players = []
        self.__update_queue = {}
        self.__output = []
        self.__input = []

        for y, row in enumerate(grid):
            for x, c in enumerate(row):
                if c == Tile.DROP.value:
                    self.__drops.add((x, y))

    @property
    def input(self) -> bytes:
        return bytes(self.__input)

    @property
    def output(self) -> bytes:
        return bytes(self.__output)

    def get_tile(self, position: Tuple[int, int]) -> int:
        tile = self.__grid[position[1]][position[0]]

        return tile

    def put_tile(self, position: Tuple[int, int], tile: int):
        if tile == Tile.DROP.value:
            self.__drops.add(position)

        self.__update_queue[position] = tile
    
    def pop_tile(self, position: Tuple[int, int]):
        tile = self.get_tile(position)

        if self.__is_drop(position):
            self.delete_tile(position)

        return tile

    def delete_tile(self, position: Tuple[int, int]):
        self.put_tile(position, Tile.EMPTY.value)
    
    def step(self):
        self.__update_tiles()

    def raw(self) -> List[List[int]]:
        return [[c for c in row] for row in self.__grid]

    def print(self, c: int):
        self.__output.append(c)

    def push_input(self):
        inp = input("Enter: ").strip()

        if len(inp) == 0:
            self.__input.append(ord('0'))
            return

        self.__input += list(c for c in reversed(inp.encode('utf8')))

    def pop_input(self) -> int:
        return self.__input.pop()

    def input_empty(self) -> bool:
        return len(self.__input) == 0

    def __update_tiles(self):
        for position, tile in self.__update_queue.items():
            if tile == Tile.EMPTY.value and self.__is_drop(position):
                tile = Tile.DROP.value

            self.__set_tile(position, tile)

        self.__update_queue = {}
    
    def __is_drop(self, position: Tuple[int, int]) -> bool:
        return position in self.__drops

    def __set_tile(self, position: Tuple[int, int], val: int):
        self.__grid[position[1]][position[0]] = val
