/**
 * @jest-environment jsdom
 */

const { test, expect, describe, jest, beforeAll, afterAll } = await import("@jest/globals");
const { translate_direction } = await import("../../../src/frontend/visualizer/visualizer.js");

const real_location = window.location;
beforeAll(() => {
    delete window.location;
    window.location = { ...real_location, assign: jest.fn(), href: "" };
});
afterAll(() => {
    window.location = real_location;
});

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