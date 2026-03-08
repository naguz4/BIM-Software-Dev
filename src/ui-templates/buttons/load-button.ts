import * as BUI from "@thatopen/ui"
import * as OBC from "@thatopen/components";
import { appIcons } from "../../globals";

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

     const onloadFrag = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".frag";
        input.multiple = false;

        input.addEventListener("change", async () => {
        const file = input.files?.[0];
        if (!file) return;
        const buffer = await file.arrayBuffer();

        const fragments = components.get(OBC.FragmentsManager)
        fragments.core.load(buffer, {
            modelId: file.name.replace(".frag", "")
        })
        });
        input.click();
     }
    return BUI.html`<bim-button  icon=${appIcons.ADD}>
    <bim-context-menu>
    <bim-button class="transparent" @click=${onloadFrag} label="load FRAG"></bim-button>
    <bim-button class="transparent" @click=${onLoadIFC} label="Load IFC"></bim-button>
    </bim-context-menu>
    </bim-button>`
}