import { test, expect, describe } from "@jest/globals";
const { Workspace } = await import("../../../../src/frontend/builder/model/model.js");
const { workspace_view_model } = await import("../../../../src/frontend/builder/view_model/view_model.js")

describe("View Model", () => {
    test("Can get correct data from one slot", () => {
        const workspace = new Workspace();
        const slot_1 = workspace.slots[0];
        slot_1.type = "move";
        slot_1.direction = "up";

        const view_model = workspace_view_model(workspace);

        expect(view_model[0].index).toBe(0);
        expect(view_model[0].type).toBe("move");
        expect(view_model[0].direction).toBe("up");
        expect(view_model[0].is_curr).toBe(true);
        expect(view_model[0].text).toBe("1: move up");
    });
    
    test("Can get correct data from multiple slots", () => {
        const workspace = new Workspace();
        workspace.add_slot();
        const slot_1 = workspace.slots[0];
        const slot_2 = workspace.slots[1];
        slot_1.type = "move";
        slot_1.direction = "up";
        slot_2.type = "rotate";

        const view_model = workspace_view_model(workspace);

        expect(view_model[0].index).toBe(0);
        expect(view_model[0].type).toBe("move");
        expect(view_model[0].direction).toBe("up");
        expect(view_model[0].is_curr).toBe(true);
        expect(view_model[0].text).toBe("1: move up");

        expect(view_model[1].index).toBe(1);
        expect(view_model[1].type).toBe("rotate");
        expect(view_model[1].direction).toBe("");
        expect(view_model[1].is_curr).toBe(false);
        expect(view_model[1].text).toBe("2: rotate ");
    });
});