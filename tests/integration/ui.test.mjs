/**
 * @jest-environment jsdom
 */

import { test, expect, describe, jest, beforeAll, afterAll } from "@jest/globals";
const { VALID_COMBOS } = await import("../../src/frontend/builder/palette/palette.js");
const { init, get_enabled_directions, redirect_to } = await import("../../src/frontend/main.js");

const real_location = window.location;
beforeAll(() => {
    delete window.location;
    window.location = { ...real_location, assign: jest.fn(), href: "" };
});
afterAll(() => {
    window.location = real_location;
});

const example_dom = `
    <button data-type="move" id="type_ex"></button>
    <button data-type="rotate" id="type_ex_2"></button>
    <button data-direction="up" id="dir_ex"></button>
    <div id="workspace">
        <div class="slot curr_slot" style="border: 2px solid blue;">1:  </div>
    </div>
    <button id="reset"></button>
    <button id="add"></button>
    <button id="delete"></button>
    <button id="submit"></button>
`;

describe("Click events", () => {
    test("Clicking type button updates current slot", () => {
        // Setup fake dom
        document.body.innerHTML = example_dom;
        const workspace = document.getElementById("workspace");
        const type_btn = document.getElementById("type_ex");
        
        expect(workspace.textContent).not.toContain("move");

        init();
        type_btn.click();

        expect(workspace.textContent).toContain("move");
    });

    test("Clicking direction button updates current slot", () => {
        document.body.innerHTML = example_dom;
        const workspace = document.getElementById("workspace");
        const type_btn = document.getElementById("type_ex");
        const direction_btn = document.getElementById("dir_ex");

        expect(workspace.textContent).not.toContain("up");

        init();
        type_btn.click();
        direction_btn.click();

        expect(workspace.textContent).toContain("up");
    });

    test("Clicking add button adds new slot", () => {
        document.body.innerHTML = example_dom;
        const workspace = document.getElementById("workspace");
        const add_btn = document.getElementById("add");

        expect(workspace.textContent).not.toContain("2:");

        init();
        add_btn.click();

        expect(workspace.textContent).toContain("2:");
    });

    test("Clicking add button sets new slot as current slot", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const { workspace } = init();
        expect(workspace.curr_idx).toBe(0);

        add_btn.click();

        expect(workspace.curr_idx).toBe(1);
    });

    test("Clicking a slot sets it as current slot", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const { workspace } = init();
        add_btn.click();
        expect(workspace.curr_idx).toBe(1);

        let slots = document.querySelectorAll("div.slot");
        slots[0].click();

        expect(workspace.curr_idx).toBe(0);
    });

    test("Clicking delete button deletes current slot", () => {
        document.body.innerHTML = example_dom;
        const workspace = document.getElementById("workspace");
        const delete_btn = document.getElementById("delete");

        expect(workspace.textContent).toContain("1:");

        init();
        delete_btn.click();

        expect(workspace.textContent).not.toContain("1:");
    });

    test ("Clicking delete button sets next slot as current slot, if it exists", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const delete_btn = document.getElementById("delete");

        const { workspace } = init();
        add_btn.click();    // sets second slot as current slot
        add_btn.click();    // sets third slot as current slot
        let slots = document.querySelectorAll("div.slot");
        slots[1].click();   // sets second slot as current slot
        expect(workspace.curr_idx).toBe(1);
        
        delete_btn.click();

        slots = document.querySelectorAll("div.slot");
        expect(workspace.curr_idx).toBe(1);
    });

    test("Clicking delete button sets previous slot as current slot, if next slot doesn't exist", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const delete_btn = document.getElementById("delete");

        const { workspace } = init();
        add_btn.click();    // sets second slot as current slot
        add_btn.click();    // sets third slot as current slot
        expect(workspace.curr_idx).toBe(2);

        delete_btn.click();

        expect(workspace.curr_idx).toBe(1);
    });

    test("Clicking reset button deletes type and direction from current slot", () => {
        document.body.innerHTML = example_dom;
        const workspace = document.getElementById("workspace");
        const type_btn = document.getElementById("type_ex");
        const direction_btn = document.getElementById("dir_ex");
        const reset_btn = document.getElementById("reset");

        init();
        type_btn.click();
        direction_btn.click();
        expect(workspace.textContent).toContain("move");
        expect(workspace.textContent).toContain("up");
        reset_btn.click();

        expect(workspace.textContent).not.toContain("move");
        expect(workspace.textContent).not.toContain("up");
    });

    test("Clicking sumbit sends correct JSON to backend", () => {
        document.body.innerHTML = example_dom;
        global.fetch = jest.fn();
        const fetch_mock = jest.spyOn(global, "fetch").mockResolvedValue({
            json: () => Promise.resolve({ trace: "fake trace" })
        });
        // mock redirect_to to prevent actual redirection during test
        const mock_redirect = jest.spyOn({ redirect_to }, "redirect_to").mockImplementation(() => {});
        
        const submit_btn = document.getElementById("submit");
        const type_btn = document.getElementById("type_ex");
        const direction_btn = document.getElementById("dir_ex");

        init();

        type_btn.click();
        direction_btn.click();
        submit_btn.click();

        expect(fetch_mock).toHaveBeenCalledWith("/api/run", {
            body: JSON.stringify([{"type": "move", "direction": "up"}]),
            headers: { "Content-Type": "application/json" },
            method: "POST",
        });

        mock_redirect.mockRestore();
    });
});

describe("Direction Button Logic", () => {
    test("Can get enabled directions", () => {
        expect(get_enabled_directions("rotate", VALID_COMBOS)).toEqual(["left", "right"]);
    });

    test("Direction buttons can be disabled depending on type", () => {
        document.body.innerHTML = example_dom;
        const direction_btn = document.getElementById("dir_ex");
        expect(direction_btn.disabled).toBeFalsy();

        init();
        const type_btn = document.getElementById("type_ex_2");
        type_btn.click();

        expect(direction_btn.disabled).toBeTruthy();
    });
});