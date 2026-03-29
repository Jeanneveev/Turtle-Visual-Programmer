import unittest
from src.core.context.context import init_context, IContext
from src.core.utils.utils import Direction

class TestContext(unittest.TestCase):
    def test_can_init_context(self):
        context = init_context()
        self.assertNotEqual(None, context)
        self.assertTrue(issubclass(type(context), IContext))

    def test_context_initalizes_with_location(self):
        context = init_context()
        self.assertEqual(context.state.x, 0)
        self.assertEqual(context.state.y, 0)

    def test_context_initalizes_with_direction(self):
        context = init_context()
        self.assertEqual(Direction.UP, context.state.direction)

class TestContextMove(unittest.TestCase):
    def test_can_move_up_facing_up(self):
        context = init_context()

        context.move(Direction.UP)

        self.assertEqual(0, context.state.x)
        self.assertEqual(1, context.state.y)
    
    def test_can_move_up_facing_down(self):
        context = init_context()
        context.state.direction = Direction.DOWN
        context.state.x = 0
        context.state.y = 7

        context.move(Direction.UP)

        self.assertEqual(0, context.state.x)
        self.assertEqual(6, context.state.y)
    
    def test_can_move_up_facing_left(self):
        context = init_context()
        context.state.direction = Direction.LEFT
        context.state.x = 3
        context.state.y = 8
        
        context.move(Direction.UP)

        self.assertEqual(2, context.state.x)
        self.assertEqual(8, context.state.y)

    def test_can_move_up_facing_right(self):
        context = init_context()
        context.state.direction = Direction.RIGHT
        context.state.x = 4
        context.state.y = 9
        
        context.move(Direction.UP)

        self.assertEqual(5, context.state.x)
        self.assertEqual(9, context.state.y)

    def test_cannot_move_up_facing_unknown_direction(self):
        context = init_context()
        context.state.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.move(Direction.UP)

        self.assertEqual("Invalid turtle direction: \"None\"", str(err.exception))

    def test_can_move_down_facing_up(self):
        context = init_context()
        context.state.x = 0
        context.state.y = 5

        context.move(Direction.DOWN)

        self.assertEqual(0, context.state.x)
        self.assertEqual(4, context.state.y)

    def test_can_move_down_facing_down(self):
        context = init_context()
        context.state.direction = Direction.DOWN
        context.state.x = 0
        context.state.y = 7

        context.move(Direction.DOWN)

        self.assertEqual(0, context.state.x)
        self.assertEqual(8, context.state.y)
    
    def test_can_move_down_facing_left(self):
        context = init_context()
        context.state.direction = Direction.LEFT
        context.state.x = 3
        context.state.y = 8
        
        context.move(Direction.DOWN)

        self.assertEqual(4, context.state.x)
        self.assertEqual(8, context.state.y)

    def test_can_move_down_facing_right(self):
        context = init_context()
        context.state.direction = Direction.RIGHT
        context.state.x = 4
        context.state.y = 9
        
        context.move(Direction.DOWN)

        self.assertEqual(3, context.state.x)
        self.assertEqual(9, context.state.y)

    def test_cannot_move_down_facing_unknown_direction(self):
        context = init_context()
        context.state.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.move(Direction.DOWN)

        self.assertEqual("Invalid turtle direction: \"None\"", str(err.exception))
    
    def test_can_move_left_facing_up(self):
        context = init_context()
        context.state.x = 1
        context.state.y = 2

        context.move(Direction.LEFT)

        self.assertEqual(0, context.state.x)
        self.assertEqual(2, context.state.y)

    def test_can_move_left_facing_down(self):
        context = init_context()
        context.state.direction = Direction.DOWN
        context.state.x = 1
        context.state.y = 2

        context.move(Direction.LEFT)

        self.assertEqual(2, context.state.x)
        self.assertEqual(2, context.state.y)

    def test_can_move_left_facing_left(self):
        context = init_context()
        context.state.direction = Direction.LEFT
        context.state.x = 3
        context.state.y = 8

        context.move(Direction.LEFT)

        self.assertEqual(3, context.state.x)
        self.assertEqual(7, context.state.y)

    def test_can_move_left_facing_right(self):
        context = init_context()
        context.state.direction = Direction.RIGHT
        context.state.x = 4
        context.state.y = 9
        
        context.move(Direction.LEFT)

        self.assertEqual(4, context.state.x)
        self.assertEqual(10, context.state.y)

    def test_cannot_move_left_facing_unknown_direction(self):
        context = init_context()
        context.state.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.move(Direction.LEFT)

        self.assertEqual("Invalid turtle direction: \"None\"", str(err.exception))

    def test_can_move_right_facing_up(self):
        context = init_context()
        context.state.x = 0
        context.state.y = 1
        
        context.move(Direction.RIGHT)

        self.assertEqual(1, context.state.x)
        self.assertEqual(1, context.state.y)

    def test_can_move_right_facing_down(self):
        context = init_context()
        context.state.direction = Direction.DOWN
        context.state.x = 2
        context.state.y = 7

        context.move(Direction.RIGHT)

        self.assertEqual(1, context.state.x)
        self.assertEqual(7, context.state.y)
    
    def test_can_move_right_facing_left(self):
        context = init_context()
        context.state.direction = Direction.LEFT
        context.state.x = 3
        context.state.y = 8
        
        context.move(Direction.RIGHT)

        self.assertEqual(3, context.state.x)
        self.assertEqual(9, context.state.y)

    def test_can_move_right_facing_right(self):
        context = init_context()
        context.state.direction = Direction.RIGHT
        context.state.x = 4
        context.state.y = 9
        
        context.move(Direction.RIGHT)

        self.assertEqual(4, context.state.x)
        self.assertEqual(8, context.state.y)

    def test_cannot_move_right_facing_unknown_direction(self):
        context = init_context()
        context.state.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.move(Direction.RIGHT)

        self.assertEqual("Invalid turtle direction: \"None\"", str(err.exception))

    def test_cannot_move_in_unknown_direction(self):
        context = init_context()

        with self.assertRaises(ValueError) as err:
            context.move(None)

        self.assertEqual("Movement direction \"None\" not found", str(err.exception))

class TestContextRotate(unittest.TestCase):
    def test_can_rotate_left_facing_up(self):
        context = init_context()

        context.rotate(Direction.LEFT)

        self.assertEqual(Direction.LEFT, context.state.direction)

    def test_can_rotate_left_facing_down(self):
        context = init_context()
        context.state.direction = Direction.DOWN

        context.rotate(Direction.LEFT)

        self.assertEqual(Direction.RIGHT, context.state.direction)

    def test_can_rotate_left_facing_left(self):
        context = init_context()
        context.state.direction = Direction.LEFT

        context.rotate(Direction.LEFT)

        self.assertEqual(Direction.DOWN, context.state.direction)

    def test_can_rotate_left_facing_right(self):
        context = init_context()
        context.state.direction = Direction.RIGHT

        context.rotate(Direction.LEFT)

        self.assertEqual(Direction.UP, context.state.direction)

    def test_cannot_rotate_left_facing_unknown_direction(self):
        context = init_context()
        context.state.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.rotate(Direction.LEFT)

        self.assertEqual("Invalid turtle direction: \"None\"", str(err.exception))

    def test_can_rotate_right_facing_up(self):
        context = init_context()

        context.rotate(Direction.RIGHT)

        self.assertEqual(Direction.RIGHT, context.state.direction)

    def test_can_rotate_right_facing_down(self):
        context = init_context()
        context.state.direction = Direction.DOWN

        context.rotate(Direction.RIGHT)

        self.assertEqual(Direction.LEFT, context.state.direction)

    def test_can_rotate_right_facing_left(self):
        context = init_context()
        context.state.direction = Direction.LEFT

        context.rotate(Direction.RIGHT)

        self.assertEqual(Direction.UP, context.state.direction)

    def test_can_rotate_right_facing_right(self):
        context = init_context()
        context.state.direction = Direction.RIGHT

        context.rotate(Direction.RIGHT)

        self.assertEqual(Direction.DOWN, context.state.direction)

    def test_cannot_rotate_right_facing_unknown_direction(self):
        context = init_context()
        context.state.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.rotate(Direction.RIGHT)

        self.assertEqual("Invalid turtle direction: \"None\"", str(err.exception))

    def test_cannot_rotate_in_unknown_direction(self):
        context = init_context()

        with self.assertRaises(ValueError) as err:
            context.rotate(Direction.UP)

        self.assertEqual("Rotation direction \"Direction.UP\" not found", str(err.exception))

if __name__ == "__main__":
    unittest.main()