import { test, expect, describe } from "@jest/globals";
import { InstructionSlot, Instruction, Workspace, WorkspaceController } from "../../../../src/frontend/builder/palette/palette.js";

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

// test("Can get valid directions based on type", () => {
//     const directions = get_valid_directions("move");
//     expect(directions).toEqual(["up", "down", "left", "right"]);
// });

// test("Can get invalid directions based on type", () => {
//     const directions_1 = get_invalid_directions("move");
//     expect(directions_1).toEqual([]);

//     const directions_2 = get_invalid_directions("rotate");
//     expect(directions_2).toEqual(["up", "down"]);
// });

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

    test("Instruction throws error for invalid type/direction combination", () => {
        expect(() => new Instruction("rotate", "up")).toThrow();
    });
});

describe("Workspace", () => {
    test("Can create Workspace object", () => {
        const workspace = new Workspace();

        expect(workspace).toHaveProperty("slots");
    });

    test("Workspace initializes with one slot", () => {
        const workspace = new Workspace();
        const slot = new InstructionSlot();

        expect(workspace.slots).toEqual([slot]);
    });

    test("Can get curr_slot property", () => {
        const workspace = new Workspace();
        workspace.slots[0].type = "move";
        workspace.slots[0].direction = "up";

        const slot = new InstructionSlot();
        slot.type = "move";
        slot.direction = "up";

        expect(workspace.curr_slot).toEqual(slot);
    });

    test("Can add slot", () => {
        const workspace = new Workspace();
        const slot = new InstructionSlot();

        workspace.add_slot();
        workspace.add_slot();

        expect(workspace.slots).toEqual([slot, slot, slot]);
    });

    test("Can remove slot", () => {
        const workspace = new Workspace();
        expect(workspace.slots).toEqual([new InstructionSlot()]);

        workspace.remove_slot();
        expect(workspace.slots).toEqual([]);
    });

    test("Remove slot removes current slot", () => {
        const workspace = new Workspace();
        workspace.slots.push(new InstructionSlot(), new InstructionSlot());
        workspace.slots[0].type = "move";
        workspace.slots[1].type = "rotate";
        workspace.slots[2].type = "move";
        workspace.curr_idx = 0;

        workspace.remove_slot();

        const expected = [new InstructionSlot(), new InstructionSlot()];
        expected[0].type = "rotate";
        expected[1].type = "move";
        expect(workspace.slots).toEqual(expected);
    })

    test("Can convert slots to instructions", () => {
        const workspace = new Workspace();
        workspace.slots[0].type = "move";
        workspace.slots[0].direction = "up";
        workspace.slots[0].is_complete = true;

        expect(workspace.to_instructions()).toEqual([new Instruction("move", "up")]);
    });

    test("Can convert Workspace to JSON", () => {
        const workspace = new Workspace();
        workspace.slots.push(new InstructionSlot());
        workspace.slots[0].type = "move";
        workspace.slots[0].direction = "up";
        workspace.slots[0].is_complete = true;
        workspace.slots[1].type = "rotate";
        workspace.slots[1].direction = "left";
        workspace.slots[1].is_complete = true;
        

        expect(workspace.to_json()).toEqual([
            {"type": "move", "direction": "up"},
            {"type": "rotate", "direction": "left"}
        ]);
    });
});

describe("WorkspaceController", () => {
    test("Can create WorkspaceController object", () => {
        const controller = new WorkspaceController();

        expect(controller).toHaveProperty("workspace");
    });

    test("Can set current slot index", () => {
        const controller = new WorkspaceController();
        controller.workspace.slots.push(new InstructionSlot());
        controller.workspace.slots[1].type = "move";
        controller.workspace.slots[1].direction = "up";

        controller.set_index(1);

        expect(controller.workspace.curr_idx).toBe(1);
    });

    test("Cannot set current slot index to an index that doesn't exist", () => {
        const controller = new WorkspaceController();

        expect(() => controller.set_index(1)).toThrow("Slot index out of bounds");
    });

    test("Can set type of current slot", () => {
        const controller = new WorkspaceController();

        controller.set_type("rotate");

        expect(controller.workspace.curr_slot.type).toEqual("rotate");
    });

    test("Can set direction of current slot", () => {
        const controller = new WorkspaceController();
        controller.workspace.curr_slot.type = "rotate";
        
        controller.set_direction("left");

        expect(controller.workspace.curr_slot.direction).toEqual("left");
    });

    test("Can add slot", () => {
        const controller = new WorkspaceController();
        expect(controller.workspace.slots).toEqual([new InstructionSlot()]);

        controller.add_slot();
        expect(controller.workspace.slots).toEqual([new InstructionSlot(), new InstructionSlot()]);
    });

    test("Adding slot returns new slot's index", () => {
        const controller = new WorkspaceController();

        const new_idx = controller.add_slot();

        expect(new_idx).toBe(1);
    });

    test("Can delete slot", () => {
        const controller = new WorkspaceController();
        expect(controller.workspace.slots).toEqual([new InstructionSlot()]);

        controller.remove_slot();
        expect(controller.workspace.slots).toEqual([]);
    });

    test("Deleting slot doesn't change curr_idx if it's in bounds", () => {
        const controller = new WorkspaceController();
        controller.workspace.slots.push(new InstructionSlot(), new InstructionSlot());
        controller.workspace.curr_idx = 1;

        controller.remove_slot();

        expect(controller.workspace.curr_idx).toBe(1);
    });

    test("Deleting slot changes curr_idx if it's out of bounds", () => {
        const controller = new WorkspaceController();
        controller.workspace.slots.push(new InstructionSlot());
        controller.workspace.curr_idx = 1;

        controller.remove_slot();

        expect(controller.workspace.curr_idx).toBe(0);
    });
});