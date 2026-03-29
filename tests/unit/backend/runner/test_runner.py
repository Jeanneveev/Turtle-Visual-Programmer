import unittest
from src.backend.action.action import Move, Rotate
from src.backend.context.context import init_context
from src.backend.runner.runner import Runner
from src.backend.utils.utils import Direction, State

class TestRunner(unittest.TestCase):
    def test_can_create_runner(self):
        context = init_context()
        runner = Runner(context)
        self.assertIsNotNone(runner)

    def test_can_load_actions(self):
        context = init_context()
        runner = Runner(context)
        actions = [
            Move(Direction.UP),
            Rotate(Direction.LEFT)
        ]
        action_stream = (action for action in actions)

        runner.load_actions(action_stream)

        self.assertIsNotNone(runner.action_stream)
        self.assertEqual(runner.action_stream, action_stream)

    def test_can_get_state_trace(self):
        context = init_context()
        runner = Runner(context)
        actions = [
            Move(Direction.UP),
            Rotate(Direction.RIGHT),
            Move(Direction.DOWN)
        ]
        action_stream = (action for action in actions)
        runner.load_actions(action_stream)

        state_trace = runner.run()

        expected = [
            {"x": 0, "y": 0, "direction": "up"},
            {"x": 0, "y": 1, "direction": "up"},
            {"x": 0, "y": 1, "direction": "right"},
            {"x": -1, "y": 1, "direction": "right"}
        ]
        self.assertEqual(state_trace, expected)

if __name__ == "__main__":
    unittest.main()