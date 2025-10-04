import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import { appIcons } from "../../globals";

export interface ViewerToolbarState {
    components: OBC.Components;
}

export const ViewerToolbarTemplate: BUI.StatefullComponent<
    ViewerToolbarState
    > = (state) => {
        const { components } = state;

        return BUI.html`
        <bim-toolbar>
            <bim-toolbar-section label="Selection" icon=${appIcons.SELECT}>
            <bim-button icon=${appIcons.COLORIZE} label="Colorize></bim-button>
            </bim-toolbar-section>
        </bim-toolbar>`
    }