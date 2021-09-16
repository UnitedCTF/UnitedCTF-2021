from .enums import Direction

from typing import List, Tuple

class Backpack:
    __stack: List[int]
    
    def __init__(self, stack: List[int] = None):
        if stack == None:
            self.__stack = []
        else:
            self.__stack = stack

    def push(self, val: int):
        self.__stack.append(val)

    def pop(self) -> int:
        return self.__stack.pop()

    def peek(self, depth: int = 0) -> int:
        return self.__stack[-depth - 1]

    def empty(self) -> bool:
        return len(self.__stack) == 0

    def size(self) -> int:
        return len(self.__stack)

    def __str__(self) -> str:
        return str([bytes([c]) for c in list(reversed(self.__stack))])

class Player:
    __position: Tuple[int, int]
    direction: Direction
    __backpack: Backpack
    alive: bool

    def __init__(self, position: Tuple[int, int]):
        self.__position = position
        self.direction = Direction.RIGHT
        self.__backpack = Backpack()
        self.alive = True

    def step(self) -> bool:
        if not self.alive: return False

        if self.direction.value < 2:
            self.__position = (self.__position[0] + self.direction.value * 2 - 1, self.__position[1])
        else:
            self.__position = (self.__position[0], self.__position[1] + (self.direction.value - 2) * 2 - 1)

        return True

    @property
    def position(self) -> Tuple[int, int]:
        return self.__position

    @property
    def backpack(self) -> Backpack:
        return self.__backpack

    def __str__(self) -> str:
        return f"Player {self.__position}: {self.__backpack}"
