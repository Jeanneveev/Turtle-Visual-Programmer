/**
 * @jest-environment jsdom
 */

import { test, expect, describe, jest } from "@jest/globals";
const { WorkspaceController, VALID_COMBOS } = await import("../../src/frontend/builder/palette/palette.js");
const { init, add_event_listeners, get_enabled_directions } = await import("../../src/frontend/builder/main.js");

const example_dom = `
    <button data-type="move" id="type_ex"></button>
    <button data-type="rotate" id="type_ex_2"></button>
    <button data-direction="up" id="dir_ex"></button>
    <div id="workspace">
        <div class="slot curr_slot" style="border: 2px solid blue;">1:  </div>
    </div>
    <button id="add"></button>
    <button id="remove"></button>
    <button id="submit"></button>
`
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
        let slots = document.querySelectorAll("div.slot");
        const add_btn = document.getElementById("add");
        expect(slots[0].classList.contains("curr_slot")).toBeTruthy();

        init();
        add_btn.click();

        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
    });

    test("Clicking a slot sets it as current slot", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");

        init();
        add_btn.click();
        let slots = document.querySelectorAll("div.slot");
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
        
        slots[0].click();

        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeTruthy();
        expect(slots[1].classList.contains("curr_slot")).toBeFalsy();
    });

    test("Clicking remove button removes current slot", () => {
        document.body.innerHTML = example_dom;
        const workspace = document.getElementById("workspace");
        const remove_btn = document.getElementById("remove");

        expect(workspace.textContent).toContain("1:");

        init();
        remove_btn.click();

        expect(workspace.textContent).not.toContain("1:");
    });

    test ("Clicking remove button sets next slot as current slot, if it exists", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const remove_btn = document.getElementById("remove");

        init();
        add_btn.click();    // sets second slot as current slot
        add_btn.click();    // sets third slot as current slot
        let slots = document.querySelectorAll("div.slot");
        slots[1].click();   // sets second slot as current slot
        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
        expect(slots[2].classList.contains("curr_slot")).toBeFalsy();
        
        remove_btn.click();

        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
    });

    test("Clicking remove button sets previous slot as current slot, if next slot doesn't exist", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const remove_btn = document.getElementById("remove");

        init();
        add_btn.click();    // sets second slot as current slot
        add_btn.click();    // sets third slot as current slot
        let slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[2].classList.contains("curr_slot")).toBeTruthy();

        remove_btn.click();

        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
    });

    test("Clicking submit logs JSON", () => {
        document.body.innerHTML = example_dom;
        const spy = jest.spyOn(console, "log");
        const submit_btn = document.getElementById("submit");
        const type_btn = document.getElementById("type_ex");
        const direction_btn = document.getElementById("dir_ex");

        init();

        type_btn.click();
        direction_btn.click();
        submit_btn.click();

        expect(spy).toHaveBeenCalledWith([
            { "type": "move", "direction": "up" }
        ]);
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