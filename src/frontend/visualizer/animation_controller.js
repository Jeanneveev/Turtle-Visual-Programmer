/**
 * Create the object for controlling animations
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Object} state_trace 
 * @param {Function} draw_state 
 * @returns 
 */
const create_animation_controller = (ctx, state_trace, draw_state) => {
    let index = 0;
    let is_playing = false;
    let interval = null;

    const draw_frame = (frame_idx) => {
        console.log("Drawing frame", frame_idx);
        const state = state_trace[frame_idx];
        draw_state(ctx, state);
    };

    const step_forward = () => {
        if (index < state_trace.length - 1) {
            index++;
            draw_frame(index);
        }
    };

    const step_back = () => {
        if (index > 0) {
            index--;
            draw_frame(index);
        }
    };

    const play = () => {
        if (is_playing) return;

        is_playing = true;
        const frame_duration = 500; // ms
        const animation_loop = () => {
            // Stop playing if paused
            if (!is_playing) return;

            step_forward();

            // Stop playing when last frame is reached
            if (index >= state_trace.length - 1) {
                is_playing = false;
                return;
            }

            interval = setTimeout(animation_loop, frame_duration);
        };

        animation_loop();
    };

    const pause = () => {
        is_playing = false;
        if (interval) {
            clearTimeout(interval);
            interval = null;
        }
    };

    const reset = async () => {
        pause();
        index = 0;
        draw_frame(index);
        // wait so that even if play is called immediately after, you can still see the first frame
        await new Promise(resolve => setTimeout(resolve, 500));
    };

    const replay = async () => {
        await reset();
        play();
    }

    return {
        play,
        pause,
        reset,
        replay,
        step_forward,
        step_back,
        get_frame_index: () => index,
        is_playing: () => is_playing
    };
};

export { create_animation_controller };