from dataclasses import dataclass
from enum import Enum

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