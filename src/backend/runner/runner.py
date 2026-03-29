from typing import Generator
from src.backend.action.action import IAction
from src.backend.context.context import IContext
from src.backend.utils.utils import State

class Runner:
    def __init__(self, context:IContext):
        self.context = context
        self.action_stream: Generator[IAction, None, None] | None = None

    def load_actions(self, action_stream: Generator[IAction, None, None]):
        self.action_stream = action_stream

    def run(self):
        turtle_state = {
            "x": 0,
            "y": 0,
            "direction": "up"
        }
        state_trace = [turtle_state.copy()]

        for action in self.action_stream:
            state:State = action.execute(self.context)

            turtle_state["x"] = state.x
            turtle_state["y"] = state.y
            turtle_state["direction"] = state.direction.value
            state_trace.append(turtle_state.copy())
        
        return state_trace