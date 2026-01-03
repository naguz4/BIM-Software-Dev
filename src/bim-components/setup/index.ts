import * as OBC from "@thatopen/components";
import { createworld } from "./src";

export const setupComponents = async () => {
    const components = new OBC.Components();
    const { world, viewport } = createworld(components);

    components.init()

    return {components, viewport }
}