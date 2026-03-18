import unittest
from src.backend.action.action import IAction, Move, Rotate
from src.backend.context.context import init_context
from src.backend.utils.utils import Direction

# HELPERS
class MockAction(IAction):
    direction: Direction
    def execute(self, context):
        return None
    def unexecute(self, context):
        return None

# TESTS
class TestAction(unittest.TestCase):        
    def test_must_init_action_with_direction(self):
        with self.assertRaises(TypeError) as err:
            MockAction()
        
        self.assertEqual(
            "IAction.__init__() missing 1 required positional argument: 'direction'",
            str(err.exception)
        )

    def test_action_direction_must_be_of_type_direction(self):
        with self.assertRaises(TypeError) as err:
            MockAction("up")
        
        self.assertEqual(
            "MockAction.direction must be of type Direction",
            str(err.exception)
        )

class TestMoveAction(unittest.TestCase):
    def test_can_make_move_action(self):
        action = Move(Direction.UP)
        self.assertNotEqual(None, action)
        self.assertTrue(issubclass(type(action), IAction))

    def test_can_execute_move_up(self):
        context = init_context()
        move_action = Move(Direction.UP)

        move_action.execute(context)

        self.assertEqual(1, context.y)

    def test_can_execute_move_down(self):
        context = init_context()
        context.y = 3
        move_action = Move(Direction.DOWN)

        move_action.execute(context)

        self.assertEqual(2, context.y)

    def test_can_execute_move_left(self):
        context = init_context()
        context.x = 3
        move_action = Move(Direction.LEFT)

        move_action.execute(context)

        self.assertEqual(2, context.x)

    def test_can_execute_move_right(self):
        context = init_context()
        context.x = 3
        move_action = Move(Direction.RIGHT)

        move_action.execute(context)

        self.assertEqual(4, context.x)

    def test_can_unexecute_move_up(self):
        context = init_context()
        context.x = 2
        context.y = 4
        move_action = Move(Direction.UP)

        move_action.execute(context)
        self.assertEqual(5, context.y)
        
        move_action.unexecute(context)
        self.assertEqual(4, context.y)
    
    def test_can_unexecute_move_down(self):
        context = init_context()
        context.x = 2
        context.y = 4
        move_action = Move(Direction.DOWN)

        move_action.execute(context)
        self.assertEqual(3, context.y)
        
        move_action.unexecute(context)
        self.assertEqual(4, context.y)

    def test_can_unexecute_move_left(self):
        context = init_context()
        context.x = 2
        context.y = 4
        move_action = Move(Direction.LEFT)

        move_action.execute(context)
        self.assertEqual(1, context.x)
        
        move_action.unexecute(context)
        self.assertEqual(2, context.x)

    def test_can_unexecute_move_right(self):
        context = init_context()
        context.x = 2
        context.y = 4
        move_action = Move(Direction.RIGHT)

        move_action.execute(context)
        self.assertEqual(3, context.x)
        
        move_action.unexecute(context)
        self.assertEqual(2, context.x)

class TestRotateAction(unittest.TestCase):
    def test_can_make_rotate_action(self):
        self.assertNotEqual(None, Rotate(Direction.LEFT))

    def test_can_only_rotate_left_or_right(self):
        with self.assertRaises(ValueError) as err:
            Rotate(Direction.UP)
        
        self.assertEqual("Can only rotate left or right", str(err.exception))

    def test_can_execute_rotate_left(self):
        context = init_context()
        rotate_action = Rotate(Direction.LEFT)

        rotate_action.execute(context)

        self.assertEqual(Direction.LEFT, context.direction)

    def test_can_execute_rotate_right(self):
        context = init_context()
        rotate_action = Rotate(Direction.RIGHT)

        rotate_action.execute(context)

        self.assertEqual(Direction.RIGHT, context.direction)

    def test_can_unexecute_rotate_left(self):
        context = init_context()
        rotate_action = Rotate(Direction.LEFT)

        rotate_action.execute(context)
        self.assertEqual(Direction.LEFT, context.direction)

        rotate_action.unexecute(context)
        self.assertEqual(Direction.UP, context.direction)
        

    def test_can_unexecute_rotate_right(self):
        context = init_context()
        rotate_action = Rotate(Direction.RIGHT)

        rotate_action.execute(context)
        self.assertEqual(Direction.RIGHT, context.direction)

        rotate_action.unexecute(context)
        self.assertEqual(Direction.UP, context.direction)
        

if __name__ == "__main__":
    unittest.main()