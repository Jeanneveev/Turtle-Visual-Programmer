import { Workspace, WorkspaceController } from "./palette/palette.js";
const controller = new WorkspaceController();
const workspace = controller.workspace;
const workspace_div = document.getElementById("workspace");

/* Click Events */
document.querySelectorAll("[data-type]").forEach(button => {
    button.addEventListener("click", () => {
        const type = button.dataset.type;
        controller.setType(type);
        rerender();
    });
});

document.querySelectorAll("[data-direction]").forEach(button => {
    button.addEventListener("click", () => {
        const direction = button.dataset.direction;
        controller.setDirection(direction);
        rerender();
    });
});

document.getElementById("add").addEventListener("click", () => {
    controller.add_slot();
    rerender();
});

/* Update UI to reflect workspace state */
const rerender = () => {
    // clear old workspace
    workspace_div.innerHTML = "";

    // add div for each instruction slot
    workspace.slots.forEach((slot, idx) => {
        const div = document.createElement("div");
        // fill in value of slot
        const type = slot.type || "";
        const direction = slot.direction || "";
        div.textContent = `${idx + 1}: ${type} ${direction}`;

        // if current slot, highlight
        if (idx === workspace.curr_idx) {
            div.style.border = "2px solid blue";
        }

        workspace_div.appendChild(div);
    });
};

/* Initial render */
rerender();