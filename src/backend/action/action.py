from abc import ABC, abstractmethod
from dataclasses import dataclass
from src.backend.context.context import IContext, Direction

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