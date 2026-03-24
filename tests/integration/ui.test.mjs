/**
 * @jest-environment jsdom
 */

import { test, expect, describe, jest } from "@jest/globals";
const { VALID_COMBOS } = await import("../../src/frontend/builder/palette/palette.js");
const { init, get_enabled_directions } = await import("../../src/frontend/builder/main.js");

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

        init();
        add_btn.click();    // sets second slot as current slot
        add_btn.click();    // sets third slot as current slot
        let slots = document.querySelectorAll("div.slot");
        slots[1].click();   // sets second slot as current slot
        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
        expect(slots[2].classList.contains("curr_slot")).toBeFalsy();
        
        delete_btn.click();

        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
    });

    test("Clicking delete button sets previous slot as current slot, if next slot doesn't exist", () => {
        document.body.innerHTML = example_dom;
        const add_btn = document.getElementById("add");
        const delete_btn = document.getElementById("delete");

        init();
        add_btn.click();    // sets second slot as current slot
        add_btn.click();    // sets third slot as current slot
        let slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[2].classList.contains("curr_slot")).toBeTruthy();

        delete_btn.click();

        slots = document.querySelectorAll("div.slot");
        expect(slots[0].classList.contains("curr_slot")).toBeFalsy();
        expect(slots[1].classList.contains("curr_slot")).toBeTruthy();
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