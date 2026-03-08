import * as OBC from "@thatopen/components";
import { createworld, setupFragmentsManager, setupIfcLoader } from "./src";
import * as BUI from "@thatopen/ui"
import { loadModelBtnTemplate } from "../../ui-templates";
import { setupHighlighter } from "./src/highlighter";

export const setupComponents = async () => {
    const components = new OBC.Components();
    const { world, viewport } = createworld(components);

    setupIfcLoader(components);
    setupFragmentsManager(components, world);
    setupHighlighter(components, world);


    components.init()

    return {components, viewport }
}