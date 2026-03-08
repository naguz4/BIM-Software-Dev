import * as OBC from "@thatopen/components";
import * as BUI from "@thatopen/ui";
import {
    ViewerToolbarState,
    viewerToolbarTemplate,
} from "../containers/viewport-toolbar"

type BottomToolbar = {name: "bottomToolbar"; state: ViewerToolbarState};
type ViewportGridelements = [BottomToolbar];

type ViewportGridLayouts = ["main"];

export type ViewportGrid = BUI.Grid<ViewportGridLayouts, ViewportGridelements>

interface ViewportGridState {
    components: OBC.Components;

}
export const viewportGridTemplate: BUI.StatefullComponent<ViewportGridState> = (state,
) => {
    const { components } = state;

    const elements: BUI.GridComponents<ViewportGridelements> = {
        bottomToolbar: {
            template: viewerToolbarTemplate,
            initialState: { components },
        },
    }

    const onCreated = (e?: Element) => {
        if (!e) return;
        const grid = e as ViewportGrid;
        grid.elements = elements;
        grid.layouts = {
            main: {
                template: `
                "bottomToolbar" auto
                /1fr
                `,  
            },
        };
        grid.layout = "main";
    };
    return BUI.html`<bim-grid floating ${BUI.ref(onCreated)} class="viewport-grid"></bim-grid>`;

        };
    
