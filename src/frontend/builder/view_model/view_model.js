const workspace_view_model = (workspace) => {
    return workspace.slots.map((slot, idx) => ({
        index: idx,
        type: slot.type || "",
        direction: slot.direction || "",
        is_curr: idx === workspace.curr_idx,
        text: `${idx + 1}: ${slot.type || ""} ${slot.direction || ""}`
    }));
}

export { workspace_view_model };