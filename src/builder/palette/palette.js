VALID_TYPES = ["move", "rotate"];
VALID_DIRECTIONS = ["up", "down", "left", "right"];
VALID_DIRECTIONS_BY_TYPE = {
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

        if (!VALID_DIRECTIONS.includes(direction)) {
            throw new Error("Invalid slot direction");
        }
        
        this.direction = direction;
        this.is_complete = true;
    }

    to_instruction() {
        if (!this.is_complete) {
            throw new Error("Slot must be complete to be converted into Instruction");
        }
        return new Instruction(this.type, this.direction);
    }
}

const get_valid_directions = (type) => {
    return VALID_DIRECTIONS_BY_TYPE[type];
}

const get_invalid_directions = (type) => {
    const valid = VALID_DIRECTIONS_BY_TYPE[type];
    return VALID_DIRECTIONS.filter(direction => !valid.includes(direction));
}

class Instruction {
    constructor(type, direction) {
        if (!VALID_TYPES.includes(type)) {
            throw new Error("Invalid instruction type");
        }
        if (!VALID_DIRECTIONS.includes(direction)) {
            throw new Error("Invalid instruction direction");
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

// class Workspace {
//     constructor(blocks = []) {
//         this.blocks = blocks;
//     }

//     add_block(instruction) {
//         if (!(instruction instanceof Instruction)) {
//             throw new Error("Can only add Blocks to Workspace");
//         }

//         this.blocks.push(instruction);
//     }

//     to_json() {
//         return this.blocks.map(instruction => instruction.to_json());
//     }
// }

// class InstructionState {
//     constructor(order=1) {
//         this.order = order;
//         this.type = null;
//         this.direction = null;
//     }

//     setType(type) {
//         if (!VALID_TYPES.includes(type)) {
//             throw new Error("Invalid type");
//         }
//         this.type = type;
//     }

//     setDirection(direction) {
//         if (!VALID_DIRECTIONS.includes(direction)) {

//         }
//         this.direction = direction;
//     }
// }

// class WorkspaceState {
//     constructor(instructions = []) {
//         this.instructions = instructions;
//     }
// }

module.exports = { InstructionSlot, Instruction, get_valid_directions, get_invalid_directions };