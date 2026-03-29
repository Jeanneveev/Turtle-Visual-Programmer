from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from src.backend.utils.utils import Direction, State

def init_context():
    return Simulation()

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
    state:State = field(default_factory=State)

    def _move_up(self):
        """Move the turtle forwards and update its location dependent on the direction it's facing"""
        # print(f"Moving forwards")
        match self.state.direction:
            case Direction.UP:
                # print("Facing up")
                self.state.y += 1
            case Direction.DOWN:
                # print("Facing down")
                self.state.y -= 1
            case Direction.LEFT:
                # print("Facing left")
                self.state.x -= 1
            case Direction.RIGHT:
                # print("Facing right")
                self.state.x += 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.state.direction}\"")
            
    def _move_down(self):
        """Move the turtle backwards and update its location dependent on the direction it's facing"""
        match self.state.direction:
            case Direction.UP:
                self.state.y -= 1
            case Direction.DOWN:
                self.state.y += 1
            case Direction.LEFT:
                self.state.x += 1
            case Direction.RIGHT:
                self.state.x -= 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.state.direction}\"")
            
    def _move_left(self):
        """Move the turtle leftwards and update its location dependent on the direction it's facing"""
        match self.state.direction:
            case Direction.UP:
                self.state.x -= 1
            case Direction.DOWN:
                self.state.x += 1
            case Direction.LEFT:
                self.state.y -= 1
            case Direction.RIGHT:
                self.state.y += 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.state.direction}\"")
            
    def _move_right(self):
        """Move the turtle rightwards and update its location dependent on the direction it's facing"""
        match self.state.direction:
            case Direction.UP:
                self.state.x += 1
            case Direction.DOWN:
                self.state.x -= 1
            case Direction.LEFT:
                self.state.y += 1
            case Direction.RIGHT:
                self.state.y -= 1
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.state.direction}\"")

    def move(self, direction:Direction) -> State:
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
            
        return self.state
            
    def _rotate_left(self):
        """Rotate the turtle counterclockwise"""
        match self.state.direction:
            case Direction.UP:
                self.state.direction = Direction.LEFT
            case Direction.DOWN:
                self.state.direction = Direction.RIGHT
            case Direction.LEFT:
                self.state.direction = Direction.DOWN
            case Direction.RIGHT:
                self.state.direction = Direction.UP
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.state.direction}\"")
            
    def _rotate_right(self):
        """Rotate the turtle clockwise"""
        match self.state.direction:
            case Direction.UP:
                self.state.direction = Direction.RIGHT
            case Direction.DOWN:
                self.state.direction = Direction.LEFT
            case Direction.LEFT:
                self.state.direction = Direction.UP
            case Direction.RIGHT:
                self.state.direction = Direction.DOWN
            case _:
                raise ValueError(f"Invalid turtle direction: \"{self.state.direction}\"")

    def rotate(self, direction:Direction) -> State:
        """Rotate the turtle in the given direction"""
        match direction:
            case Direction.LEFT:
                self._rotate_left()
            case Direction.RIGHT:
                self._rotate_right()
            case _:
                raise ValueError(f"Rotation direction \"{direction}\" not found")
            
        return self.state