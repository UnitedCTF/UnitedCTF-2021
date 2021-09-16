from enum import Enum

class Tile(Enum):
    EMPTY = ord(' ')
    PLAYER = ord('@')
    PRINT = ord('.')
    LEFT = ord('<')
    RIGHT = ord('>')
    UP = ord('^')
    DOWN = ord('v')
    EQUAL = ord('=')
    POP = ord('!')
    COPY = ord('$')
    FLAG = ord('#')
    DROP = ord('_')
    SPACE = ord('?')
    ADD = ord('+')
    SUBTRACT = ord('-')
    INPUT = ord(',')

class Direction(Enum):
    LEFT = 0
    RIGHT = 1
    UP = 2
    DOWN = 3
