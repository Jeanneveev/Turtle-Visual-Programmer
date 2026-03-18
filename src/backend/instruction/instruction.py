from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Generator
from src.backend.action.action import IAction, Move, Rotate
from src.backend.lib.utils import Direction

@dataclass(frozen=True)
class IInstruction(ABC):
    direction: str

    def __post_init__(self):
        if not isinstance(self.direction, str):
            raise TypeError(f"{self.__class__.__name__}.direction must be of type str")
        
    def to_action(self) -> Generator[IAction, None, None]:
        pass

class MoveInstruction(IInstruction):
    direction: str

    def to_action(self) -> Generator[IAction, None, None]:
        yield Move(Direction(self.direction))
    
class RotateInstruction(IInstruction):
    direction: str

    def to_action(self) -> Generator[IAction, None, None]:
        yield Rotate(Direction(self.direction))
