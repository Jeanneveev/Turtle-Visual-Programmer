/**
 * Translates a direction string ("up", "right", "down", "left") to an angle in radians
 * @param {String} dir 
 * @returns {Number} angle in radians
 */
const translate_direction = (dir) => {
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
const PADDING_LEFT = TRIANGLE_SIZE / 2 + 10;  // 20
const PADDING_RIGHT = TRIANGLE_SIZE / 2 + 10;  // 20
const PADDING_BOTTOM = TRIANGLE_SIZE / 2 + 10;  // 20
const PADDING_TOP = TRIANGLE_SIZE + 10;  // 30 (triangle tip extends 20 up)

// Effective drawing bounds
const MIN_X = PADDING_LEFT;
const MAX_X = CANVAS_WIDTH - PADDING_RIGHT;
const MIN_Y = PADDING_BOTTOM;
const MAX_Y = CANVAS_HEIGHT - PADDING_TOP;

// Position calculation: map grid (0 to GRID_SIZE-1) to pixel bounds
const get_pixel_x = (grid_x) => MIN_X + grid_x * (MAX_X - MIN_X) / (GRID_SIZE - 1);
const get_pixel_y = (grid_y) => MIN_Y + grid_y * (MAX_Y - MIN_Y) / (GRID_SIZE - 1);

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
    ctx.translate(0, ctx.canvas.height);
    ctx.scale(1, -1);

    // draw turtle at position and direction based on state
    const { x, y, direction } = state;
    ctx.save();
    ctx.translate(get_pixel_x(x), get_pixel_y(y));
    ctx.rotate(translate_direction(direction));

    // draw turtle as an isosceles triangle pointing upwards
    ctx.beginPath();
    ctx.moveTo(0, TRIANGLE_SIZE);   // tip 20 units up
    ctx.lineTo(-(TRIANGLE_SIZE/2), -(TRIANGLE_SIZE/2)); // bottom left
    ctx.lineTo(TRIANGLE_SIZE/2, -(TRIANGLE_SIZE/2));  // bottom right
    ctx.closePath();
    ctx.fillStyle = "green";
    ctx.fill();

    ctx.restore();
    ctx.restore();  // restore the initial save
};

/**
 * Animates the turtle's movements through a series of states
 * @param {Array<Object>} state_trace 
 */
const animate = async (state_trace) => {
    console.log("Animate called with:", state_trace);
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    for (const state of state_trace) {
        draw_state(ctx, state);
        await new Promise(resolve => setTimeout(resolve, 500));  // wait 500ms between states
    }
};

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

const init = () => {
    // Setup event listeners
    const dom = {
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

export { init, animate, translate_direction };