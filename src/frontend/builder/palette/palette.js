const VALID_COMBOS = {
    "move": ["up", "down", "left", "right"],
    "rotate": ["left", "right"]
};

/**
 * The slots of the Workspace for each instruction
 */
class InstructionSlot {
    constructor(number=1) {
        this.number = number;
        this.type = null;
        this.direction = null;
        this.is_complete = false;
    }

    /**
     * Set the type and reset the direction, if any
     * @param {string} type 
     */
    set_type(type) {
        const VALID_TYPES = Object.keys(VALID_COMBOS);
        if (!VALID_TYPES.includes(type)) {
            throw new Error("Invalid slot type");
        }

        this.type = type;
        this.direction = null;
    }

    /**
     * Set the direction, as long as there is a set type
     * @param {string} direction 
     */
    set_direction(direction) {
        if (this.type === null) {
            throw new Error("Cannot set direction without type");
        }

        const VALID_DIRECTIONS = VALID_COMBOS[this.type];
        if (!VALID_DIRECTIONS.includes(direction)) {
            throw new Error("Invalid slot direction");
        }
        
        this.direction = direction;
        this.is_complete = true;
    }

    reset() {
        this.type = null;
        this.direction = null;
    }

    to_instruction() {
        if (!this.is_complete) {
            throw new Error("Slot must be complete to be converted into Instruction");
        }
        return new Instruction(this.type, this.direction);
    }
}

// const get_valid_directions = (type) => {
//     return VALID_COMBOS[type];
// }

// const get_invalid_directions = (type) => {
//     const valid = VALID_COMBOS[type];
//     return VALID_DIRECTIONS.filter(direction => !valid.includes(direction));
// }

class Instruction {
    constructor(type, direction) {
        const VALID_TYPES = Object.keys(VALID_COMBOS);
        const VALID_DIRECTIONS = [].concat(...Object.values(VALID_COMBOS));
        if (!VALID_TYPES.includes(type)) {
            throw new Error("Invalid instruction type");
        }
        if (!VALID_DIRECTIONS.includes(direction)) {
            throw new Error("Invalid instruction direction");
        }
        if (!VALID_COMBOS[type].includes(direction)) {
            throw new Error("Invalid instruction type/direction combination");
        }

        this.type = type;
        this.direction = direction;
    }

    to_json() {
        return {
            "type": this.type,
            "direction": this.direction
        }
    }
}

class Workspace {
    constructor() {
        this.slots = [new InstructionSlot()];
        this.curr_idx = 0;
    }

    get curr_slot() {
        if (this.slots.length !== 0) {
            return this.slots[this.curr_idx];
        }
        return null;
    }

    add_slot() {
        this.slots.push(new InstructionSlot());
    }

    delete_curr_slot() {
        this.slots.splice(this.curr_idx, 1);
    }

    reset_curr_slot() {
        this.curr_slot.reset();
    }

    to_instructions() {
        return this.slots.map(slot => slot.to_instruction());
    }

    to_json() {
        const instructions = this.to_instructions();
        return instructions.map(instruction => instruction.to_json());
    }
}

class WorkspaceController {
    constructor() {
        this.workspace = new Workspace();
    }

    add_slot() {
        this.workspace.add_slot();
        return this.workspace.slots.length - 1; // return index of new slot
    }

    delete_slot() {
        this.workspace.delete_curr_slot();

        // Update curr_idx if now out of bounds
        if (this.workspace.curr_idx > this.workspace.slots.length - 1) {
            this.workspace.curr_idx = this.workspace.slots.length - 1;
        }
    }

    set_index(index) {
        if (this.workspace.slots.length < index + 1) {
            throw Error("Slot index out of bounds");
        }
        this.workspace.curr_idx = index;
    }

    set_type(type) {
        this.workspace.curr_slot.set_type(type);
    }

    set_direction(direction) {
        this.workspace.curr_slot.set_direction(direction);
    }

    reset() {
        this.workspace.reset_curr_slot();
    }

    to_json() {
        return this.workspace.to_json();
    }
}

export { InstructionSlot, Instruction, Workspace, WorkspaceController, VALID_COMBOS };