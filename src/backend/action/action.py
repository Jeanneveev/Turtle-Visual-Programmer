from abc import ABC, abstractmethod
from dataclasses import dataclass
from src.backend.context.context import IContext
from src.backend.utils.utils import Direction, State

@dataclass(frozen=True)
class IAction(ABC):
    """The interface for an action to be performed"""
    direction: Direction

    def __post_init__(self):
        if not isinstance(self.direction, Direction):
            raise TypeError(f"{self.__class__.__name__}.direction must be of type Direction")

    @abstractmethod
    def execute(self, context:IContext) -> State:
        pass

    def unexecute(self, context:IContext) -> State:
        pass

@dataclass(frozen=True)
class Move(IAction):
    direction: Direction
    
    def execute(self, context:IContext) -> State:
        state = context.move(self.direction)
        return state

    def unexecute(self, context:IContext) -> State:
        """Reverse the movement by moving in the opposite direction"""
        match self.direction:
            case Direction.UP:
                state = context.move(Direction.DOWN)
            case Direction.DOWN:
                state = context.move(Direction.UP)
            case Direction.LEFT:
                state = context.move(Direction.RIGHT)
            case Direction.RIGHT:
                state = context.move(Direction.LEFT)
        return state

@dataclass(frozen=True)
class Rotate(IAction):
    direction: Direction

    def __post_init__(self):
        super().__post_init__()
        if self.direction not in [Direction.RIGHT, Direction.LEFT]:
            raise ValueError("Can only rotate left or right")
    
    def execute(self, context:IContext) -> State:
        state = context.rotate(self.direction)
        return state

    def unexecute(self, context:IContext) -> State:
        """Reverse the rotation by rotating in the opposite direction"""
        match self.direction:
            case Direction.LEFT:
                state = context.rotate(Direction.RIGHT)
            case Direction.RIGHT:
                state = context.rotate(Direction.LEFT)
        return state
        