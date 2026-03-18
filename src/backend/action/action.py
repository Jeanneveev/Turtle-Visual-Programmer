from abc import ABC, abstractmethod
from dataclasses import dataclass
from src.backend.context.context import IContext
from src.backend.utils.utils import Direction

@dataclass(frozen=True)
class IAction(ABC):
    """The interface for an action to be performed"""
    direction: Direction

    def __post_init__(self):
        if not isinstance(self.direction, Direction):
            raise TypeError(f"{self.__class__.__name__}.direction must be of type Direction")

    @abstractmethod
    def execute(self, context:IContext):
        pass

    def unexecute(self, context:IContext):
        pass

@dataclass(frozen=True)
class Move(IAction):
    direction: Direction
    
    def execute(self, context:IContext):
        context.move(self.direction)

    def unexecute(self, context:IContext):
        """Reverse the movement by moving in the opposite direction"""
        match self.direction:
            case Direction.UP:
                context.move(Direction.DOWN)
            case Direction.DOWN:
                context.move(Direction.UP)
            case Direction.LEFT:
                context.move(Direction.RIGHT)
            case Direction.RIGHT:
                context.move(Direction.LEFT)

@dataclass(frozen=True)
class Rotate(IAction):
    direction: Direction

    def __post_init__(self):
        super().__post_init__()
        if self.direction not in [Direction.RIGHT, Direction.LEFT]:
            raise ValueError("Can only rotate left or right")
    
    def execute(self, context:IContext):
        context.rotate(self.direction)

    def unexecute(self, context:IContext):
        """Reverse the rotation by rotating in the opposite direction"""
        match self.direction:
            case Direction.LEFT:
                context.rotate(Direction.RIGHT)
            case Direction.RIGHT:
                context.rotate(Direction.LEFT)
        