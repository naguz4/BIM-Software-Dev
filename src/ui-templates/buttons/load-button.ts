import * as BUI from "@thatopen/ui"
import * as OBC from "@thatopen/components";

export interface LoadModelBtnState {
    components: OBC.Components
 }


export const loadModelBtnTemplate: BUI.StatefullComponent<LoadModelBtnState> = (
    state,
) => {
    const { components } = state;
    const onLoadIFC = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".ifc";
        input.multiple = false;

        input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;

        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const ifcLoader = components.get(OBC.IfcLoader)
        await ifcLoader.load(
            bytes,
            true, // instructs the loader to automatily coordinate (position) the model realtive to others loaded
            file.name.replace(".ifc", ""),// ID with which the model will be loaded into memory
        )
        }
    )
        input.click();
     }
    return BUI.html`<bim-button @click=${onLoadIFC} label="Load IFC"></bim-button>`;
}