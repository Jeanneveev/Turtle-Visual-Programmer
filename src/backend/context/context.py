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

    @abstractmethod
    def rotate(self, direction:Direction):
        pass

@dataclass(frozen=False)
class Simulation(IContext):
    """The contextual data and commands of the turtle as a virtual simulation"""
    x: int = 0
    y: int = 0
    direction: Direction = Direction.UP

    def _move_up(self):
        """Move the turtle forwards and update its location dependent on the direction it's facing"""
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
                raise ValueError(f"Invalid turtle direction: \"{self.direction}\"")
            
    def _move_down(self):
        """Move the turtle backwards and update its location dependent on the direction it's facing"""
        match self.direction:
            case Direction.UP:
                self.y -= 1
            case Direction.DOWN:
                self.y += 1
            case Direction.LEFT:
                self.x += 1
            case Direction.RIGHT:
                self.x -= 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.direction}\"")
            
    def _move_left(self):
        """Move the turtle leftwards and update its location dependent on the direction it's facing"""
        match self.direction:
            case Direction.UP:
                self.x -= 1
            case Direction.DOWN:
                self.x += 1
            case Direction.LEFT:
                self.y -= 1
            case Direction.RIGHT:
                self.y += 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.direction}\"")
            
    def _move_right(self):
        """Move the turtle rightwards and update its location dependent on the direction it's facing"""
        match self.direction:
            case Direction.UP:
                self.x += 1
            case Direction.DOWN:
                self.x -= 1
            case Direction.LEFT:
                self.y += 1
            case Direction.RIGHT:
                self.y -= 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.direction}\"")

    def move(self, direction:Direction):
        """Move the turtle in the given direction"""
        match direction:
            case Direction.UP:
                self._move_up()
            case Direction.DOWN:
                self._move_down()
            case Direction.LEFT:
                self._move_left()
            case Direction.RIGHT:
                self._move_right()
            case _:
                raise ValueError(f"Movement direction \"{direction}\" not found")
            
    def _rotate_left(self):
        """Rotate the turtle counterclockwise"""
        match self.direction:
            case Direction.UP:
                self.direction = Direction.LEFT
            case Direction.DOWN:
                self.direction = Direction.RIGHT
            case Direction.LEFT:
                self.direction = Direction.DOWN
            case Direction.RIGHT:
                self.direction = Direction.UP
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.direction}\"")
            
    def _rotate_right(self):
        """Rotate the turtle clockwise"""
        match self.direction:
            case Direction.UP:
                self.direction = Direction.RIGHT
            case Direction.DOWN:
                self.direction = Direction.LEFT
            case Direction.LEFT:
                self.direction = Direction.UP
            case Direction.RIGHT:
                self.direction = Direction.DOWN
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.direction}\"")

    def rotate(self, direction:Direction):
        """Rotate the turtle in the given direction"""
        match direction:
            case Direction.LEFT:
                self._rotate_left()
            case Direction.RIGHT:
                self._rotate_right()
            case _:
                raise ValueError(f"Rotation direction \"{direction}\" not found")