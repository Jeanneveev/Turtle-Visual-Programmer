import unittest
from src.backend.context.context import init_context, IContext, Direction

class TestContext(unittest.TestCase):
    def test_can_init_context(self):
        context = init_context()
        self.assertNotEqual(None, context)
        self.assertTrue(issubclass(type(context), IContext))

    def test_context_initalizes_with_location(self):
        context = init_context()
        self.assertEqual(context.x, 0)
        self.assertEqual(context.y, 0)

    def test_context_initalizes_with_direction(self):
        context = init_context()
        self.assertEqual(Direction.UP, context.direction)

class TestContextMove(unittest.TestCase):
    def test_can_move_up_facing_up(self):
        context = init_context()
        context.move(Direction.UP)
        self.assertEqual(0, context.x)
        self.assertEqual(1, context.y)
    
    def test_can_move_up_facing_down(self):
        context = init_context()
        context.direction = Direction.DOWN
        context.y = 7

        context.move(Direction.UP)

        self.assertEqual(0, context.x)
        self.assertEqual(6, context.y)
    
    def test_can_move_up_facing_left(self):
        context = init_context()
        context.direction = Direction.LEFT
        context.x = 3
        context.y = 8
        
        context.move(Direction.UP)

        self.assertEqual(2, context.x)
        self.assertEqual(8, context.y)

    def test_can_move_up_facing_right(self):
        context = init_context()
        context.direction = Direction.RIGHT
        context.x = 4
        context.y = 9
        
        context.move(Direction.UP)

        self.assertEqual(5, context.x)
        self.assertEqual(9, context.y)

    def test_cannot_move_up_facing_unknown_direction(self):
        context = init_context()
        context.direction = None
        
        with self.assertRaises(ValueError) as err:
            context.move(Direction.UP)

        self.assertEqual("Turtle direction not found", str(err.exception))

    # def test_can_move_down_facing_up(self):
    #     context = init_context()
    #     context.y = 5

    #     context.move(Direction.DOWN)
    #     self.assertEqual(0, context.x)
    #     self.assertEqual(4, context.y)

    # def test_can_move_down_contextually(self):
    #     ...
    
    # def test_can_move_left_contextually(self):
    #     ...

    # def test_can_move_right_contextually(self):
    #     ...

    def test_cannot_move_in_unknown_direction(self):
        context = init_context()

        with self.assertRaises(ValueError) as err:
            context.move(None)

        self.assertEqual("Movement direction not found", str(err.exception))

if __name__ == "__main__":
    unittest.main()