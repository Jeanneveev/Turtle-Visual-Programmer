import unittest
import json
import os
from src.backend.instruction.instruction import BlockInstruction, MoveInstruction, RotateInstruction
from src.backend.parser.parser import json_path_to_instructions, validate_json, json_to_instructions

example_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "example.json")
bad_example_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "example_bad.json")

class TestValidate(unittest.TestCase):
    def test_can_validate_correct_json(self):
        with open(example_path, "r") as f:
            j = json.load(f)
        
        self.assertTrue(validate_json(j))

    def test_cannot_validate_incorrect_json(self):
        bad_json = {"wrong": "format"}

        self.assertFalse(validate_json(bad_json))

class TestParseFromPath(unittest.TestCase):
    def test_can_parse_json_to_block_instruction(self):
        self.maxDiff = None

        expected = BlockInstruction([
            MoveInstruction("up"), MoveInstruction("up"),
            RotateInstruction("right"),
            MoveInstruction("up")
        ])
        actual = json_path_to_instructions(example_path)

        self.assertEqual(expected, actual)

    def test_cannot_parse_instructions_of_unknown_type(self):
        with self.assertRaises(ValueError) as err:
            json_path_to_instructions(bad_example_path)

        self.assertEqual(
            "Unknown instruction type \"unknown\" encountered",
            str(err.exception)
        )

class TestParseFromData(unittest.TestCase):
    def test_can_parse_json_to_block_instruction(self):
        self.maxDiff = None

        expected = BlockInstruction([
            MoveInstruction("up"), MoveInstruction("up"),
            RotateInstruction("right"),
            MoveInstruction("up")
        ])

        with open(example_path, "r") as f:
            data:list[dict[str, str]] = json.load(f)

        actual = json_to_instructions(data)

        self.assertEqual(expected, actual)

    def test_cannot_parse_instructions_of_unknown_type(self):
        bad_json = [
            {"type": "move", "direction": "up"},
            {"type": "unknown", "direction": "right"}
        ]

        with self.assertRaises(ValueError) as err:
            json_to_instructions(bad_json)

        self.assertEqual(
            "Unknown instruction type \"unknown\" encountered",
            str(err.exception)
        )


if __name__ == "__main__":
    unittest.main()