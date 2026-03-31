/**
 * @jest-environment jsdom
 */

const { test, expect, describe, jest, beforeAll, afterAll, beforeEach } = await import("@jest/globals");
const { init } = await import("../../../src/frontend/visualizer/visualizer.js");

// Mock window.location.href to avoid JSDom error
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
    <button id="play"></button>
    <button id="pause"></button>
`;

describe("Click Events", () => {
    beforeEach(() => {
        // mock sessionStorage
        const mock_state_trace = JSON.stringify([{ x: 0, y: 0, direction: "up" }]);
        sessionStorage.setItem("state_trace", mock_state_trace);
        // set up document
        document.body.innerHTML = example_dom;
    });

    test("Back button redirects to home page", async () => {
        const back_btn = document.getElementById("back");

        await init();
        back_btn.click();

        expect(window.location.href.includes("index.html")).toBeTruthy();
    });
});