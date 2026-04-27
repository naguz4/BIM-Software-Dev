import * as BUI from "@thatopen/ui"
import * as OBC from "@thatopen/components";
import { appIcons } from "../../globals";
import * as THREE from "three";

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
        await fragments.core.load(buffer, {
            modelId: file.name.replace(".frag", "")
        })

        // Get the loaded model and fit camera to view it
        const models = fragments.list
        const model = models.get(file.name.replace(".frag", ""))
        if (model) {
            const worlds = components.get(OBC.Worlds)
            const world = worlds.list.values().next().value
            if (world) {
                // Add model to scene (this doesn't happen automatically with frag files)
                world.scene.three.add(model.object)
                
                model.useCamera(world.camera.three)
                await fragments.core.update(true)
                
                // Fit camera to see the entire model using Three.js
                const box = new THREE.Box3().setFromObject(model.object)
                const size = box.getSize(new THREE.Vector3())
                const center = box.getCenter(new THREE.Vector3())
                
                // Fit camera to model bounds
                const camera = world.camera.three
                const maxDim = Math.max(size.x, size.y, size.z)
                const fov = camera.fov * (Math.PI / 180)
                let cameraZ = Math.abs(maxDim / 2 * Math.tan(fov * 2))
                cameraZ *= 2.5 // zoom out a bit
                
                camera.position.set(center.x, center.y, center.z + cameraZ)
                camera.lookAt(center)
                camera.updateProjectionMatrix()
            }
        }
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