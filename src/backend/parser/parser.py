import json
from jsonschema import validate
from src.backend.instruction.instruction import BlockInstruction, MoveInstruction, RotateInstruction


def validate_json(loaded_json:list[dict]):
    """Given some loaded JSON, validate that it's in the right format to be turned into a BlockInstruction"""
    schema = {
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "type": { "type": "string" },
                "direction": { "type": "string" }
            },
            "required": ["type", "direction"]
        }
    }

    try:
        validate(loaded_json, schema)
    except:
        # print("Not valid")
        return False
    
    # print("Valid")
    return True

def json_path_to_instructions(path) -> BlockInstruction:
    with open(path, "r") as f:
        data:list[dict[str, str]] = json.load(f)

    if not validate_json(data):
        raise ValueError("JSON not in correct format")
    
    instructions = []
    for raw_instruction in data:
        typ = raw_instruction["type"].lower()
        direction = raw_instruction["direction"].lower()

        match typ:
            case "move":
                instructions.append(MoveInstruction(direction))
            case "rotate":
                instructions.append(RotateInstruction(direction))
            case _:
                raise ValueError(f"Unknown instruction type \"{typ}\" encountered")

    return BlockInstruction(instructions)

def json_to_instructions(data:list[dict[str, str]]) -> BlockInstruction:
    if not validate_json(data):
        raise ValueError("JSON not in correct format")
    
    instructions = []
    for raw_instruction in data:
        typ = raw_instruction["type"].lower()
        direction = raw_instruction["direction"].lower()

        match typ:
            case "move":
                instructions.append(MoveInstruction(direction))
            case "rotate":
                instructions.append(RotateInstruction(direction))
            case _:
                raise ValueError(f"Unknown instruction type \"{typ}\" encountered")

    return BlockInstruction(instructions)