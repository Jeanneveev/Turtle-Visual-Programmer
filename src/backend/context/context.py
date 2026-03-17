from abc import ABC, abstractmethod
from dataclasses import dataclass
from enum import Enum

def init_context():
    return Simulation()

@dataclass(frozen=True)
class Direction(Enum):
    UP = "up"
    DOWN = "down"
    LEFT = "left"
    RIGHT = "right"

    def __eq__(self, other):
        if not isinstance(other, Direction):
            return False
        
        if (self.name == other.name) and (self.value == other.value):
            return True
        
        return False

@dataclass
class IContext(ABC):
    direction:Direction = None

    @abstractmethod
    def move(self, direction:Direction):
        pass

@dataclass(frozen=False)
class Simulation(IContext):
    x: int = 0
    y: int = 0
    direction: Direction = Direction.UP

    def _move_up(self):
        # print(f"Moving forwards")
        match self.direction:
            case Direction.UP:
                # print("Facing up")
                self.y += 1
            case Direction.DOWN:
                # print("Facing down")
                self.y -= 1
            case Direction.LEFT:
                # print("Facing left")
                self.x -= 1
            case Direction.RIGHT:
                # print("Facing right")
                self.x += 1
            case _:
                raise ValueError("Turtle direction not found")

    def move(self, direction:Direction):
        match direction:
            case Direction.UP:
                self._move_up()
            case _:
                raise ValueError("Movement direction not found")