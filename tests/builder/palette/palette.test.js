const { test, expect, describe } = require("@jest/globals")
const { InstructionSlot, Instruction, get_valid_directions, get_invalid_directions } = require("../../../src/builder/palette/palette.js")

describe("InstructionSlot", () => {
    test("Can create InstructionSlot", () => {
        const slot = new InstructionSlot();

        expect(slot).toHaveProperty("number");
        expect(slot).toHaveProperty("type");
        expect(slot).toHaveProperty("direction");
    });

    test("InstructionSlot initializes with only number", () => {
        const slot = new InstructionSlot();

        expect(slot.number).toBe(1);
        expect(slot.type).toBe(null);
        expect(slot.direction).toBe(null);
    });

    test("Can set type", () => {
        const slot = new InstructionSlot();

        slot.set_type("move");

        expect(slot.type).toBe("move");
    });

    test("Cannot set invalid type", () => {
        const slot = new InstructionSlot();

        expect(() => slot.set_type("other")).toThrow("Invalid slot type");
    });

    test("Can set direction", () => {
        const slot = new InstructionSlot();

        slot.set_type("move");
        slot.set_direction("up");

        expect(slot.direction).toBe("up");
    });

    test("Cannot set invalid direction", () => {
        const slot = new InstructionSlot();

        expect(() => {
            slot.set_type("move");
            slot.set_direction("incorrect");
        }).toThrow("Invalid slot direction");
    })

    test("Can only set direction after type", () => {
        const slot = new InstructionSlot();

        expect(() => slot.set_direction("up")).toThrow("Cannot set direction without type");
    });

    test("Resetting set type with set direction also resets direction", () => {
        const slot = new InstructionSlot();

        slot.set_type("move");
        slot.set_direction("up");

        slot.set_type("rotate");

        expect(slot.direction).toBe(null);
    });

    test("Can convert completed slot to Instruction", () => {
        const slot = new InstructionSlot();
        slot.set_type("move");
        slot.set_direction("up");

        expect(slot.to_instruction()).toEqual(new Instruction("move", "up"));
    });

    test("Cannot convert to Instruction if slot not completed", () => {
        const slot = new InstructionSlot();
        
        expect(() => slot.to_instruction()).toThrow("Slot must be complete to be converted into Instruction");

        slot.set_type("rotate");
        expect(() => slot.to_instruction()).toThrow("Slot must be complete to be converted into Instruction");
    });
});

test("Can get valid directions based on type", () => {
    const directions = get_valid_directions("move");
    expect(directions).toEqual(["up", "down", "left", "right"]);
});

test("Can get invalid directions based on type", () => {
    const directions_1 = get_invalid_directions("move");
    expect(directions_1).toEqual([]);

    const directions_2 = get_invalid_directions("rotate");
    expect(directions_2).toEqual(["up", "down"]);
});

describe("Instruction", () => {
    test("Can create Instruction", () => {
        const instruction = new Instruction("move", "up");

        expect(instruction).toHaveProperty("type");
    });

    test("Can convert Instruction to JSON", () => {
        const instruction = new Instruction("move", "up");

        expect(instruction.to_json()).toEqual({
            "type": "move", "direction": "up"
        });
    });

    test("Instruction throws error for invalid type", () => {
        expect(() => new Instruction("invalid", "up")).toThrow();
    });

    test("Instruction throws error for invalid direction", () => {
        expect(() => new Instruction("move", "invalid")).toThrow();
    });
});

// describe("Workspace", () => {
//     test("Can create Workspace object", () => {
//         const workspace = new Workspace();

//         expect(workspace).toHaveProperty("blocks");
//     });

//     test("Can create Workspace with no blocks", () => {
//         const workspace = new Workspace();

//         expect(workspace.blocks).toEqual([]);
//     });

//     test("Can create Workspace with blocks", () => {
//         const block_1 = new Instruction("move", "up");
//         const block_2 = new Instruction("rotate", "right");
//         const workspace = new Workspace([block_1, block_2]);

//         expect(workspace.blocks).toEqual([block_1, block_2]);
//     });

//     test("Can convert Workspace to JSON", () => {
//         const block_1 = new Instruction("move", "up");
//         const block_2 = new Instruction("rotate", "left");
//         const workspace = new Workspace([block_1, block_2]);

//         expect(workspace.to_json()).toEqual([
//             {"type": "move", "direction": "up"},
//             {"type": "rotate", "direction": "left"}
//         ]);
//     });

//     test("Can add blocks to Workspace after creation", () => {
//         const block_1 = new Instruction("move", "up");
//         const block_2 = new Instruction("rotate", "left");
//         const workspace = new Workspace();

//         workspace.add_block(block_1);
//         workspace.add_block(block_2);

//         expect(workspace.blocks).toEqual([block_1, block_2]);
//     });

//     test("Cannot add non-Instruction objects to Workspace", () => {
//         const workspace = new Workspace();

//         expect(() => workspace.add_block("invalid")).toThrow();
//     });
// });

// describe("InstructionState", () => {
//     test("Can create InstructionState object", () => {
//         const instruction = new InstructionState();

//         expect(instruction).toHaveProperty("order");
//         expect(instruction).toHaveProperty("type");
//         expect(instruction).toHaveProperty("direction");
//     });

//     test("InstructionState initial state is empty", () => {
//         const instruction = new InstructionState();

//         expect(instruction.order).toBe(null);
//         expect(instruction.type).toBe(null);
//         expect(instruction.direction).toBe(null);
//     });

//     test("Can set InstructionState type", () => {
//         const instruction = new InstructionState();
//         instruction.setType("move");

//         expect(instruction.type).toBe("move");
//     });

//     test("Can set InstructionState direction", () => {
//         const instruction = new InstructionState();
//         instruction.setDirection("up");

//         expect(instruction.direction).toBe("up");
//     });

//     test("Can validate valid type and direction", () => {
//         const instruction = 
//     })
// });

// describe("WorkspaceState", () => {
//     test("Can create WorkspaceState object", () => {
//         const state = new WorkspaceState();

//         expect(state).toHaveProperty("instructions");
//     });
// });