import { Workspace, WorkspaceController, VALID_COMBOS } from "./palette/palette.js";
const controller = new WorkspaceController();
const workspace = controller.workspace;
const workspace_div = document.getElementById("workspace");

/* Click Events */
const add_event_listeners = () => {
    document.querySelectorAll("[data-type]").forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;
            controller.set_type(type);
            rerender();
        });
    });

    document.querySelectorAll("[data-direction]").forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.dataset.direction;
            controller.set_direction(direction);
            rerender();
        });
    });

    document.getElementById("add").addEventListener("click", () => {
        const new_idx = controller.add_slot();
        controller.set_index(new_idx);
        rerender();
    });

    document.getElementById("submit").addEventListener("click", () => {
        const json = controller.to_json();
        console.log(json);
        // TODO: send json to backend
    });
};

/**
 * Disable directions based on current slot type, if any
 */
const update_direction_buttons = () => {
    const curr_type = workspace.curr_slot.type;
    const VALID_DIRECTIONS = VALID_COMBOS[curr_type] || [];
    document.querySelectorAll("[data-direction]").forEach(button => {
        const direction = button.dataset.direction;
        if (VALID_DIRECTIONS.includes(direction)) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

/**
 * Update UI to reflect workspace state
 */
const rerender = () => {
    // clear old workspace
    workspace_div.innerHTML = "";

    // add div for each instruction slot
    workspace.slots.forEach((slot, idx) => {
        const div = document.createElement("div");
        div.classList.add("slot");
        // fill in value of slot
        const type = slot.type || "";
        const direction = slot.direction || "";
        div.textContent = `${idx + 1}: ${type} ${direction}`;

        // if current slot, highlight
        if (idx === workspace.curr_idx) {
            div.style.border = "2px solid blue";
        }

        // on click, set as current slot
        div.addEventListener("click", () => {
            controller.set_index(idx);
            rerender();
        });

        workspace_div.appendChild(div);
    });

    // enable/disable direction buttons based on current slot type
    update_direction_buttons();
};

/**
 * Initialize workspace and event listeners. Called on page load
 */
const init = () => {
    // Setup event listeners and initial render
    add_event_listeners();
    rerender();
};

export { add_event_listeners, init };