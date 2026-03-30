import { create_animation_controller } from "./animation_controller.js";
import { draw_state } from "./canvas.js"

/**
 * Gets the value of the state_trace session variable
 * @returns {Object|null}
 */
const get_state_trace = () => {
    const state_trace_str = sessionStorage.getItem("state_trace");
    if (state_trace_str) {
        return JSON.parse(state_trace_str);
    } else {
        return null;
    }
};
/**
 * Sets up and returns the animation controller
 * @returns {Object} The set up animation controller
 */
const setup_animation_controller = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const state_trace = get_state_trace();
    console.log("Gotten state trace:", state_trace);
    if (!state_trace) {
        console.error("No state trace found in session storage");
    }

    const controller = create_animation_controller(ctx, state_trace, draw_state);

    return controller;
}

const get_event_handlers = (controller) => {
    return {
        back_click_evt: () => {
            window.location.href = "../index.html";
        },
        redo_click_evt: async () => {
            await controller.replay();
        },
        step_back_click_evt: () => {
            controller.step_back();
        },
        step_forward_click_evt: () => {
            controller.step_forward();
        },
        play_click_evt: () => {
            controller.play();
        },
        pause_click_evt: () => {
            controller.pause();
        }
    }
}
const add_event_listeners = (dom, handlers) => {
    dom.back_button.addEventListener("click", handlers.back_click_evt);
    dom.redo_button.addEventListener("click", handlers.redo_click_evt);
    dom.step_back_button.addEventListener("click", handlers.step_back_click_evt);
    dom.step_forward_button.addEventListener("click", handlers.step_forward_click_evt);
    dom.play_button.addEventListener("click", handlers.play_click_evt);
    dom.pause_button.addEventListener("click", handlers.pause_click_evt);
};

/**
 * Initializes the visualizer
 * Sets up event listeners and calls for the animation to be loaded and played
 */
const init = async () => {
    const controller = setup_animation_controller();

    // Setup event listeners
    const dom = {
        canvas: document.getElementById("canvas"),
        back_button: document.getElementById("back"),
        redo_button: document.getElementById("redo"),
        step_back_button: document.getElementById("step_back"),
        step_forward_button: document.getElementById("step_forward"),
        play_button: document.getElementById("play"),
        pause_button: document.getElementById("pause")
    };
    const handlers = get_event_handlers(controller);
    add_event_listeners(dom, handlers);

    // Start animation
    await controller.reset();   // Load first frame
    controller.play();          // Play rest of animation
};

export { init };