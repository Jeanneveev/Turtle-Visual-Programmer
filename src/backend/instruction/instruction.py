from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Generator
from src.core.action.action import IAction, Move, Rotate
from src.core.utils.utils import Direction

@dataclass(frozen=True)
class IInstruction(ABC):
    direction: str

    def __post_init__(self):
        if not isinstance(self.direction, str):
            raise TypeError(f"{self.__class__.__name__}.direction must be of type str")
        
    def __eq__(self, other):
        if not isinstance(other, self.__class__):
            return False
        
        if self.direction == other.direction:
            return True
        
        return False
        
    def to_action(self) -> Generator[IAction, None, None]:
        pass

@dataclass(frozen=True)
class MoveInstruction(IInstruction):
    direction: str

    def to_action(self) -> Generator[IAction, None, None]:
        yield Move(Direction(self.direction))
    
@dataclass(frozen=True)
class RotateInstruction(IInstruction):
    direction: str

    def to_action(self) -> Generator[IAction, None, None]:
        yield Rotate(Direction(self.direction))

@dataclass
class BlockInstruction():
    instructions: list[IInstruction]

    def __eq__(self, other):
        if not isinstance(other, BlockInstruction):
            return False
        
        if self.instructions == other.instructions:
            return True
        
        return False

    def to_actions(self) -> Generator[IAction, None, None]:
        for instruction in self.instructions:
            yield from instruction.to_action()