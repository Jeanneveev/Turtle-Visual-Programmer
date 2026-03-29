/**
 * Translates a direction string ("up", "right", "down", "left") to an angle in radians
 * @param {String} dir 
 * @returns {Number} angle in radians
 */
const translate_direction = (dir) => {
    console.log("Translating direction:", dir);
    switch (dir) {
        case "up": return 0;
        case "right": return Math.PI / 2;
        case "down": return Math.PI;
        case "left": return 3 * Math.PI / 2;
        default: throw new Error(`Invalid direction: ${dir}`);
    }
};

// Canvas and grid constants
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
const GRID_SIZE = 20;  // 20x20 grid
const TRIANGLE_SIZE = 20;

// Padding to prevent clipping (triangle extends ~10 right/up)
const PADDING_LEFT = TRIANGLE_SIZE / 2 + 10;    // 20
const PADDING_RIGHT = TRIANGLE_SIZE / 2 + 10;   // 20
const PADDING_BOTTOM = TRIANGLE_SIZE / 2 + 10;  // 20
const PADDING_TOP = TRIANGLE_SIZE + 10;  // 30 (triangle tip extends 20 up)

// Effective drawing bounds
const MIN_X = PADDING_LEFT;                 // 20
const MAX_X = CANVAS_WIDTH - PADDING_RIGHT; // 380
const MIN_Y = PADDING_BOTTOM;               // 20
const MAX_Y = CANVAS_HEIGHT - PADDING_TOP;  // 370

/**
 * Resets the canvas origin to the bottom-left corner
 * @param {CanvasRenderingContext2D} ctx 
 */
const reset_origin = (ctx) => {
    ctx.translate(0, ctx.canvas.height);
    ctx.scale(1, -1);
};

// Map state coordinates to padded canvas (pixel) coordinates
const get_pixel_x = (state_x) => MIN_X + state_x * (MAX_X - MIN_X) / (GRID_SIZE - 1);
const get_pixel_y = (state_y) => MIN_Y + state_y * (MAX_Y - MIN_Y) / (GRID_SIZE - 1);

/**
 * Get the turtle's position in pixel coordinates and radians
 * @param {Object} state 
 * @returns {Object} {x, y, direction} in pixel coordinates and radians
 */
const get_turtle_position = (state) => ({
    x: get_pixel_x(state.x),
    y: get_pixel_y(state.y),
    direction: translate_direction(state.direction)
});

/**
 * Get the points of the turtle triangle based on the given size
 * @param {Number} size 
 * @returns {Array<Object>} Array of points
 */
const get_turtle_points = (size) => [
    { x: 0, y: size },                  // tip
    { x: -(size / 2), y: -(size / 2) }, // bottom left
    { x: size / 2, y: -(size / 2) }     // bottom right
];

/**
 * Draws the turtle on the canvas at the origin facing up, based on the given points
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Array<Object>} points 
 */
const draw_turtle = (ctx, points) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();
};

/**
 * Draws the turtle on the canvas based on the given state
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} state 
 */
const draw_state = (ctx, state) => {
    // clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // set origin to bottom-left (x=0, y=0 is bottom-left)
    ctx.save();
    reset_origin(ctx);

    // draw turtle at position and direction based on state
    ctx.save();
    const turtle_pos = get_turtle_position(state);
    ctx.translate(turtle_pos.x, turtle_pos.y);
    ctx.rotate(-turtle_pos.direction);  // opposite because canvas y-axis is flipped

    // draw turtle as an isosceles triangle pointing upwards
    draw_turtle(ctx, get_turtle_points(TRIANGLE_SIZE));

    ctx.restore();
    ctx.restore();  // restore the initial save
};

/**
 * Draws each state in the given trace, forming an animation
 * @param {Array<Object>} state_trace 
 */
const animate = async (state_trace) => {
    console.log("Animate called with:", state_trace);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    for (const state of state_trace) {
        console.log("Animating:", state);
        draw_state(ctx, state);
        await new Promise(resolve => setTimeout(resolve, 500));  // wait 500ms between states
    }
};

/**
 * Loads the state trace and calls for its animation
 */
const load_animation = () => {
    const state_trace_str = sessionStorage.getItem("state_trace");
    if (state_trace_str) {
        const state_trace = JSON.parse(state_trace_str);
        animate(state_trace);
    } else {
        console.error("No state trace found in session storage");
    }
}

const get_event_handlers = () => {
    return {
        back_click_evt: () => {
            window.location.href = "../index.html";
        },
        redo_click_evt: () => {
            load_animation();
        },
        step_back_click_evt: () => {
            // TODO: Implement step back button
        },
        step_forward_click_evt: () => {
            // TODO: Implement step forward button
        }
    }
}
const add_event_listeners = (dom, handlers) => {
    dom.back_button.addEventListener("click", handlers.back_click_evt);
    dom.redo_button.addEventListener("click", handlers.redo_click_evt);
    dom.step_back_button.addEventListener("click", handlers.step_back_click_evt);
    dom.step_forward_button.addEventListener("click", handlers.step_forward_click_evt);
};

/**
 * Initializes the visualizer
 * Sets up event listeners and calls for the animation to be loaded and played
 */
const init = () => {
    // Setup event listeners
    const dom = {
        canvas: document.getElementById("canvas"),
        back_button: document.getElementById("back"),
        redo_button: document.getElementById("redo"),
        step_back_button: document.getElementById("step_back"),
        step_forward_button: document.getElementById("step_forward")
    };
    const handlers = get_event_handlers();
    add_event_listeners(dom, handlers);

    // Get state trace from session storage and animate
    load_animation();
};

export {
    init, animate, translate_direction, reset_origin, get_pixel_x, get_pixel_y,
    get_turtle_position, get_turtle_points, draw_turtle, draw_state
};