/**
 * @jest-environment jsdom
 */

const { test, expect, describe, jest, beforeAll, afterAll, beforeEach } = await import("@jest/globals");
const {
    init, translate_direction, reset_origin, get_pixel_x, get_pixel_y,
    get_turtle_position, get_turtle_points, draw_turtle, draw_state
} = await import("../../../src/frontend/visualizer/visualizer.js");

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

describe("Animation Utils", () => {
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

    test("Can get pixel x coordinates from state x coordinates", () => {
        expect(get_pixel_x(0)).toBe(20);
        expect(get_pixel_x(10)).toBe(3980/19);
        expect(get_pixel_x(20)).toBe(7580/19);
    });

    test("Can get pixel y coordinates from state y coordinates", () => {
        expect(get_pixel_y(0)).toBe(20);
        expect(get_pixel_y(10)).toBe(3880/19);
        expect(get_pixel_y(20)).toBe(7380/19);
    });

    test("Can get turtle position from state", () => {
        const state = { x: 10, y: 10, direction: "up" };

        const turtle_pos = get_turtle_position(state);

        expect(turtle_pos.x).toBe(3980/19);
        expect(turtle_pos.y).toBe(3880/19);
        expect(turtle_pos.direction).toBe(0);
    });

    test("Can get turtle points depending on size", () => {
        const points = get_turtle_points(20);

        expect(points).toEqual([
            { x: 0, y: 20 },
            { x: -10, y: -10 },
            { x: 10, y: -10 }
        ]);
    });
});

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

describe("Canvas", () => {
    let canvas, ctx;
    beforeEach(() => {
        document.body.innerHTML = example_dom;
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
    });
    
    test("Can reset canvas origin to bottom-left", () => {
        reset_origin(ctx);
        
        const expect_maxtrix_almost_equal = (actual, expected) => {
            expect(actual.a).toBeCloseTo(expected.a);
            expect(actual.b).toBeCloseTo(expected.b);
            expect(actual.c).toBeCloseTo(expected.c);   // 0 vs -0
            expect(actual.d).toBeCloseTo(expected.d);
            expect(actual.e).toBeCloseTo(expected.e);
            expect(actual.f).toBeCloseTo(expected.f);
        };

        expect_maxtrix_almost_equal(
            ctx.getTransform(), new DOMMatrix([1, 0, 0, -1, 0, 400])
        );
    });

    test("Draw turtle calls correct functions and values", () => {
        const points = [
            { x: 0, y: 20 },
            { x: -10, y: -10 },
            { x: 10, y: -10 }
        ];

        ctx = {
            ...ctx,
            beginPath: jest.fn(),
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            closePath: jest.fn(),
            fill: jest.fn(),
        };

        draw_turtle(ctx, points);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalledWith(0, 20);
        expect(ctx.lineTo).toHaveBeenCalledWith(-10, -10);
        expect(ctx.lineTo).toHaveBeenCalledWith(10, -10);
        expect(ctx.closePath).toHaveBeenCalled();
        expect(ctx.fill).toHaveBeenCalled();
    });

    test("Draw state calls correct functions and values", () => {
        const state = { x: 10, y: 10, direction: "up" };

        ctx = {
            ...ctx,
            canvas: { width: 400, height: 400 },
            clearRect: jest.fn(),
            save: jest.fn(),
            translate: jest.fn(),
            rotate: jest.fn(),
        };

        draw_state(ctx, state);

        expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, 400, 400);
        expect(ctx.save).toHaveBeenCalledTimes(2);
        expect(ctx.translate).toHaveBeenCalledWith(3980/19, 3880/19);
        expect(ctx.rotate).toHaveBeenCalledWith(-0);
    });
});