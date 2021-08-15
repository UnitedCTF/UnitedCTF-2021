from .world import World
from .player import Player
from .enums import Tile, Direction

from abc import ABC
import copy
import string

class Operator(ABC):
    @classmethod
    def get_tile(cls, player: Player, world: World):
        return world.get_tile(player.position)

    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return False

    @classmethod
    def parse(cls, player: Player, world: World):
        for operator in cls.__subclasses__():
            if operator.can_parse(cls.get_tile(player, world)):
                return operator.parse(player, world)

class Flag(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.FLAG.value

    @classmethod
    def parse(cls, player: Player, world: World):
        player.alive = False

class Push(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        if tile < 10: return True

        try:
            tile = chr(tile)
        except: return False

        return tile in string.ascii_uppercase + string.digits

    @classmethod
    def parse(cls, player: Player, world: World):
        player.backpack.push(world.pop_tile(player.position))

class Space(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.SPACE.value

    @classmethod
    def parse(cls, player: Player, world: World):
        world.pop_tile(player.position)
        player.backpack.push(ord(' '))

class Turn(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile in [Tile.LEFT.value, Tile.RIGHT.value, Tile.UP.value, Tile.DOWN.value]

    @classmethod
    def parse(cls, player: Player, world: World):
        tile = cls.get_tile(player, world)

        for tile_type in Tile:
            if tile == tile_type.value:
                tile = tile_type
                break
        else: raise "Direction should be good now?"

        player.direction = Direction[tile.name]

class Copy(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.COPY.value

    @classmethod
    def parse(cls, player: Player, world: World):
        player.backpack.push(player.backpack.peek())

class Drop(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.DROP.value

    @classmethod
    def parse(cls, player: Player, world: World):
        if player.backpack.empty(): return

        tile = player.backpack.pop()

        if tile == Tile.PLAYER.value:
            new_player = copy.deepcopy(player)
            new_player.direction = Direction.RIGHT
            world.new_players.append(new_player)
            return

        world.put_tile(player.position, tile)

class Pop(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.POP.value

    @classmethod
    def parse(cls, player: Player, world: World):
        if not player.backpack.empty():
            player.backpack.pop()

class Print(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.PRINT.value

    @classmethod
    def parse(cls, player: Player, world: World):
        world.print(player.backpack.pop())

class Equal(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.EQUAL.value

    @classmethod
    def parse(cls, player: Player, world: World):
        if player.backpack.size() >= 2 and player.backpack.peek(0) == player.backpack.peek(1):
            player.step()

class Add(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.ADD.value

    @classmethod
    def parse(cls, player: Player, world: World):
        player.backpack.push(player.backpack.pop() + player.backpack.pop())

class Subtract(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.SUBTRACT.value

    @classmethod
    def parse(cls, player: Player, world: World):
        v1, v2 = player.backpack.pop(), player.backpack.pop()
        player.backpack.push(v2 - v1)

class Input(Operator):
    @classmethod
    def can_parse(cls, tile: int) -> bool:
        return tile == Tile.INPUT.value

    @classmethod
    def parse(cls, player: Player, world: World):
        if world.input_empty():
            world.push_input()

        if world.input_empty(): 
            player.backpack.push(b'0')
        else: 
            player.backpack.push(world.pop_input())
