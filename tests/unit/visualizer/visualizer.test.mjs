/**
 * @jest-environment jsdom
 */

const { test, expect, describe, jest, beforeAll, afterAll, beforeEach } = await import("@jest/globals");
const { translate_direction, init, draw_state } = await import("../../../src/frontend/visualizer/visualizer.js");

const real_location = window.location;
beforeAll(() => {
    delete window.location;
    window.location = { ...real_location, assign: jest.fn(), href: "" };
});
afterAll(() => {
    window.location = real_location;
});

const example_dom = `
    <button id="back"></button>
    <canvas id="canvas" width="400" height="400"></canvas>
    <button id="redo"></button>
    <button id="step_back"></button>
    <button id="step_forward"></button>
`;

describe("Visualizer Utils", () => {
    test("Can translate up string to radians", () => {
        expect(translate_direction("up")).toBe(0);
    });

    test("Can translate right string to radians", () => {
        expect(translate_direction("right")).toBe(Math.PI / 2);
    });

    test("Can translate down string to radians", () => {
        expect(translate_direction("down")).toBe(Math.PI);
    });

    test("Can translate left string to radians", () => {
        expect(translate_direction("left")).toBe(3 * Math.PI / 2);
    });

    test("Cannot translate invalid direction string to radians", () => {
        expect(() => translate_direction("invalid")).toThrow("Invalid direction: invalid");
    });
});

describe("Click Events", () => {
    test("Back button redirects to home page", () => {
        document.body.innerHTML = example_dom;
        const back_btn = document.getElementById("back");

        init();
        back_btn.click();

        expect(window.location.href).toBe("../index.html");
    });
});

describe("Animation", () => {
    let canvas, ctx;
    beforeEach(() => {
        document.body.innerHTML = example_dom;
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
    });
    
    
});