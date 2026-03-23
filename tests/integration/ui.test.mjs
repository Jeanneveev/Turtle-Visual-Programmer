/**
 * @jest-environment jsdom
 */

import { test, expect, describe } from "@jest/globals";
const { WorkspaceController } = await import("../../src/frontend/builder/palette/palette.js");
const { add_event_listeners } = await import("../../src/frontend/builder/main.js");

describe("Click events", () => {
    test("Clicking type button updates current slot", () => {
        document.body.innerHTML = `
            <div id="workspace"></div>
            <button data-type="move">Move</button>
            <button data-direction="up">Up</button>
            <button id="add">Add</button>
            <button id="submit">Submit</button>
        `;
        add_event_listeners();

        const controller = new WorkspaceController();
        const button = document.querySelector("[data-type='move']");
        button.click();

        const curr_type = controller.workspace.curr_slot.type;
        expect(curr_type).toBe("move");
    });


    // test("Clicking direction button updates current slot", () => {

    // });

    // test("Clicking add button adds new slot", () => {

    // });

    // test("Clicking add button sets new slot as current slot", () => {

    // });

    // test("Clicking submit button logs JSON", () => {

    // });
});
