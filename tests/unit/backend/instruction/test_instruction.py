import unittest
from src.backend.action.action import Move, Rotate
from src.backend.instruction.instruction import IInstruction, MoveInstruction, RotateInstruction, BlockInstruction
from src.backend.utils.utils import Direction

# HELPERS
class MockInstruction(IInstruction):
    direction: str
    def to_action(self):
        return None

class TestInstruction(unittest.TestCase):
    def test_must_init_instruction_with_direction(self):
        with self.assertRaises(TypeError) as err:
            MockInstruction()

        self.assertEqual(
            "IInstruction.__init__() missing 1 required positional argument: 'direction'",
            str(err.exception)
        )

    def test_instruction_direction_must_be_string(self):
        with self.assertRaises(TypeError) as err:
            MockInstruction(2)

        self.assertEqual(
            "MockInstruction.direction must be of type str",
            str(err.exception)
        )

class TestMoveInstruction(unittest.TestCase):
    def test_can_make_move_instruction(self):
        instruction = MoveInstruction("up")
        self.assertNotEqual(None, instruction)
        self.assertTrue(issubclass(type(instruction), IInstruction))

    def test_can_translate_move_instruction_to_move_action(self):
        instruction = MoveInstruction("up")

        action, = instruction.to_action()

        self.assertTrue(isinstance(action, Move))
        self.assertEqual(Direction.UP, action.direction)

class TestRotateInstruction(unittest.TestCase):
    def test_can_make_rotate_instruction(self):
        instruction = RotateInstruction("left")
        self.assertNotEqual(None, instruction)
        self.assertTrue(issubclass(type(instruction), IInstruction))

    def test_can_translate_rotate_instruction_to_rotate_action(self):
        instruction = RotateInstruction("left")

        action, = instruction.to_action()

        self.assertTrue(isinstance(action, Rotate))
        self.assertEqual(Direction.LEFT, action.direction)

class TestBlockInstruction(unittest.TestCase):
    def test_can_make_block_instruction(self):
        block = BlockInstruction([])
        self.assertNotEqual(None, block)

    def test_can_translate_all_instructions_in_block_to_actions(self):
        block = BlockInstruction([MoveInstruction("up"), MoveInstruction("up"), RotateInstruction("right")])

        actions = list(block.to_actions())

        self.assertEqual(
            [Move(Direction.UP), Move(Direction.UP), Rotate(Direction.RIGHT)],
            actions
        )

if __name__ == "__main__":
    unittest.main()