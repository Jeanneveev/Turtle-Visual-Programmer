import { Workspace, WorkspaceController, VALID_COMBOS } from "./builder/palette/palette.js";
import { workspace_view_model } from "./builder/view_model/view_model.js";

const redirect_to = (url) => {
    window.location.href = url;
};

/**
 * Returns the event handlers for the buttons on the page
 * @param {WorkspaceController} controller WorkspaceController instance for this page
 * @param {Function} rerender The rerender function to call after handling an event
 * @returns {Object} An object containing the event handlers
 */
const get_event_handlers = (controller, rerender) => {
    return {
        type_click_evt: (type) => {
            controller.set_type(type);
            rerender();
        },

        direction_click_evt: (direction) => {
            controller.set_direction(direction);
            rerender();
        },

        reset_click_evt: () => {
            controller.reset();
            rerender();
        },

        add_click_evt: () => {
            const new_idx = controller.add_slot();
            controller.set_index(new_idx);
            rerender();
        },

        delete_click_evt: () => {
            controller.delete_slot();
            rerender();
        },

        submit_click_evt: () => {
            const json = controller.to_json();
            const json_str = JSON.stringify(json);
            // console.log(json);
            fetch("/api/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: json_str
            })
            .then(response => response.json())
            .then(async data => {
                // Store state trace in session storage
                sessionStorage.setItem("state_trace", JSON.stringify(data));
                // redirect to visualizer page
                redirect_to("../visualizer/visualizer.html");
            });
        },

        slot_click_evt: (idx) => {
            controller.set_index(idx);
            rerender();
        }
    };
};

/**
 * Add click event listeners to buttons on the page
 * @param {WorkspaceController} controller The WorkspaceController instance for this page
 * @param {Function} rerender The rerender function
 */
const add_event_listeners = (dom, handlers) => {
    dom.type_buttons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.dataset.type;
            handlers.type_click_evt(type);
        });
    });
    dom.direction_buttons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.dataset.direction;
            handlers.direction_click_evt(direction);
        });
    });

    dom.reset_button.addEventListener("click", handlers.reset_click_evt);
    dom.add_button.addEventListener("click", handlers.add_click_evt);
    dom.delete_button.addEventListener("click", handlers.delete_click_evt);
    dom.submit_button.addEventListener("click", handlers.submit_click_evt);
};

/**
 * Get all valid directions that should be enabled
 * @param {String} type 
 * @param {Object} VALID_COMBOS 
 * @returns {Array<String>}
 */
const get_enabled_directions = (type, VALID_COMBOS) => {
    return VALID_COMBOS[type] || [];
};
/**
 * Enable/disable direction buttons depending on current slot type
 * @param {Array<HTMLButtonElement>} buttons 
 * @param {Array<String>} enabled_directions 
 */
const update_direction_buttons = (buttons, enabled_directions) => {
    buttons.forEach(button => {
        if (enabled_directions.includes(button.dataset.direction)) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });
}

/**
 * Renders the workspace UI based on the view model
 * @param {Object} view_model The view model for the workspace, a dictionary of slot properties
 * @param {HTMLDivElement} workspace_div The div to render the workspace into
 * @param {Function} slot_click_evt The event handler for clicking an instruction slot
 */
const render_workspace = (view_model, workspace_div, slot_click_evt) => {
    // clear old workspace
    workspace_div.innerHTML = "";

    // add div for each instruction slot
    view_model.forEach(slot => {
        const div = document.createElement("div");
        div.classList.add("slot");
        // fill in value of slot
        div.textContent = slot.text;

        // if current slot, highlight
        if (slot.is_curr) {
            div.classList.add("curr_slot");
        }

        // on click, set as current slot
        div.addEventListener("click", () => {
            slot_click_evt(slot.index);
        });

        workspace_div.appendChild(div);
    });
};

/**
 * Rerenders the workspace and palette based on the current state of the workspace model object in the controller
 * @param {Workspace} workspace The workspace model object to be rendered
 * @param {Object} dom The DOM elements for the workspace
 * @param {Object} handlers The event handlers for the workspace
 */
const rerender = (workspace, dom, handlers) => {
    const view_model = workspace_view_model(workspace);
    render_workspace(view_model, dom.workspace_div, handlers.slot_click_evt);

    let enabled_directions = [];
    if (workspace.curr_slot) {  // If there's any existing slots
        enabled_directions = get_enabled_directions(workspace.curr_slot.type, VALID_COMBOS);
    }
    update_direction_buttons(dom.direction_buttons, enabled_directions);
}

/**
 * Initializes page. Orchestrator function
 */
const init = () => {
    const controller = new WorkspaceController();
    const workspace = controller.workspace;
    const dom = {   // relevant DOM elements
        workspace_div: document.getElementById("workspace"),
        type_buttons: document.querySelectorAll("[data-type]"),
        direction_buttons: document.querySelectorAll("[data-direction]"),
        reset_button: document.getElementById("reset"),
        add_button: document.getElementById("add"),
        delete_button: document.getElementById("delete"),
        submit_button: document.getElementById("submit")
    };

    const handlers = get_event_handlers(controller, () => rerender(workspace, dom, handlers));
    add_event_listeners(dom, handlers);
    rerender(workspace, dom, handlers);

    return { controller, workspace }    // for testing
};

export { redirect_to, add_event_listeners, get_enabled_directions, init };