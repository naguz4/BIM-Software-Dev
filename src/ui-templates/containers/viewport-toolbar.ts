import * as BUI from "@thatopen/ui";
import * as OBC from "@thatopen/components";
import * as OBF from "@thatopen/components-front";
import { appIcons } from "../../globals";
import { color } from "three/tsl";
import * as THREE from "three";


export interface ViewerToolbarState {
    components: OBC.Components;
}   

export const viewerToolbarTemplate: BUI.StatefullComponent<
ViewerToolbarState
> = (state) => {
    const { components } = state; 

    let colorinput: BUI.ColorInput | undefined;

    const onApplyColor = async ({ target:button }: { target: BUI.Button}) => {
        if (!colorinput) return;
        const  { color } = colorinput;
        const highlighter = components.get(OBF.Highlighter)
        const selection = highlighter.selection.select; // this is a ModelIdMap, the engine data type to represent item selections
        if (OBC.ModelIdMapUtils.isEmpty(selection)) return;
        button.loading = true;
        if (!highlighter.styles.has(color)) {
            highlighter.styles.set(color, {
                color: new THREE.Color(color),
                renderedFaces: 1,
                opacity: 1,
                transparent: false,
            })
        }

        await Promise.all ([highlighter.highlightByID(
            color,
            selection,
            false, // indicates that previous items colorized with the same style will keep the color
            false // indicates the camera to not zoom on the colorized items
        ),
        highlighter.clear("select")])

        button.loading = false
    }

    const onInputCreated = (e?: Element) => {};

    return BUI.html`
    <bim-toolbar>
    <bim-toolbar-section label="Selection" icon=${appIcons.SELECT}>
    <bim-button icon=${appIcons.COLORIZE} label="Colorize">
    <bim-context-menu>
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
    <bim-color-input ${BUI.ref(onInputCreated)}></bim-color-input> <!-- custom color input from that open engine -->
    <div style="display:flex; gap: 0.5rem">
    <bim-button @click=${onApplyColor} icon=${appIcons.APPLY} label="Apply"></bim-button>
    </div>
    </bim-context-menu>
    </bim-button>
    </bim-toolbar-section>
    </bim-toolbar>
    `;
};