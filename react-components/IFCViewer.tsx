import * as React from 'react';
import * as OBC from '@thatopen/components';
import * as THREE from 'three';
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc"
import * as OBCF from "@thatopen/components-front"
import * as FRAGS from '@thatopen/fragments'
import * as OBF from "@thatopen/components-front"
import { FragmentsGroup } from '@thatopen/fragments';
import * as BUIC from "@thatopen/ui-obc"




export function IFCViewer() {
    const components = new OBC.Components();

    let fragmentModel: FragmentsGroup | undefined;

    const setViewer = () => {
    
    const worlds = components.get(OBC.Worlds);

    const world = worlds.create<
    OBC.SimpleScene,
    OBC.OrthoPerspectiveCamera,
    OBCF.PostproductionRenderer
    >()

    const sceneComponents = new OBC.SimpleScene(components)
    world.scene = sceneComponents
    world.scene.setup()

    const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
    const rendererComponent = new OBCF.PostproductionRenderer(components, viewerContainer);
    world.renderer = rendererComponent;

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components)

    world.camera = cameraComponent;

    components.init()

    world.renderer.postproduction.enabled = true


    world.camera.controls.setLookAt(3, 3, 3, 0, 0, 0);

    world.camera.updateAspect()

    const ifcLoader = components.get(OBC.IfcLoader);
    ifcLoader.setup()

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
        world.scene.three.add(model)

        const indexer = components.get(OBC.IfcRelationsIndexer)
        await indexer.process(model)

        fragmentModel = model
        
    })

    const highlighter = components.get(OBCF.Highlighter)
    highlighter.setup( {world} )
    highlighter.zoomToSelection = true

    viewerContainer.addEventListener("resize", () => {
        rendererComponent.resize()
        cameraComponent.updateAspect()
    })

    
        
    }

    const onToggleVisibility = () => {
        const highlighter = components.get(OBCF.Highlighter)
        const fragments = components.get(OBC.FragmentsManager)
        const selection = highlighter.selection.select
        if (Object.keys(selection).length === 0)  return
        for (const fragmentID in selection) {
            const fragment = fragments.list.get(fragmentID)
            const expressIDs = selection[fragmentID]
            for (const id of expressIDs) {
                if (!fragment) continue
                const isHidden = fragment.hiddenItems.has(id)
                if (isHidden) {
                    fragment.setVisibility(true, [id])
                    } else {
                        fragment.setVisibility(false, [id])

                    }
                    
                }
            }
        }

const onIsolate = () => {
    const highlighter = components.get(OBCF.Highlighter)
    const hider = components.get(OBC.Hider)
    const selection = highlighter.selection.select
    hider.isolate(selection)

}

const onShow = () => {
    const hider = components.get(OBC.Hider)
    hider.set(true)
}

const onShowproperties = async () => {
    if (!fragmentModel) return;
    const highlighter = components.get(OBCF.Highlighter)
        const selection = highlighter.selection.select
        const indexer = components.get(OBC.IfcRelationsIndexer)
        const fragments = components.get(OBC.FragmentsManager)
        for (const fragmentID in selection) {
            const fragment = fragments.list.get(fragmentID)
            const model = fragment?.group
            const expressIDs = selection[fragmentID]
            if (!model) continue
            for (const id of expressIDs) {
                    const psets = indexer.getEntityRelations(fragmentModel, id, "ContainedInStructure")
                    if (psets) {
                        for (const expressId of psets) {
                            const props = await fragmentModel.getProperties(expressId)
                            console.log(props)
                        }
                    }
                }
            }
}
const setupUI = () => {
const viewerContainer = document.getElementById("viewer-container") as HTMLDivElement;
if (!viewerContainer) return


const floatingGrid = BUI.Component.create<BUI.Grid> (() => {
    return BUI.html `
    <bim-grid
    floating
    style="padding:20px"
    ></bim-grid>
    `;
})

const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
    const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {}
    })
    const highlighter = components.get(OBCF.Highlighter)
    highlighter.events.select.onHighlight.add((fragmentIdMap) => {
        if (!floatingGrid) return
        floatingGrid.layout = "second"
        updatePropsTable({ fragmentIdMap })
        propsTable.expanded = false
    })

    highlighter.events.select.onClear.add(() => {
        updatePropsTable({ fragmentIdMap: {} })
        if (!floatingGrid) return
        floatingGrid.layout = "main"
    })

    const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        propsTable.queryString = input.value
    }



    return BUI.html `
    <bim-panel>
    <bim-panel-section
    name="property"
    label="Property Information"
    fixed
    >
    <bim-text-input @input=${search} placeholder="Search" icon="material-symbols:search..."></bim-text-input>
    ${propsTable}
    </bim-panel-section>
    </bim-panel>`
})

const onWorldsUpdate = () => {
    if (!floatingGrid) return
    floatingGrid.layout = "world"
}
const worldPanel = BUI.Component.create<BUI.Panel>(() => {
    const [worldstable] = CUI.tables.worldsConfiguration({ components })

    const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        worldstable.queryString = input.value
    }

    return BUI.html `
    <bim-panel>
    <bim-panel-section
    name="world"
    label="Worlds"
    icon="tabler;brush"
    fixed
    >
    <bim-text-input @input=${search} placeholder="Search" icon="material-symbols:search..."></bim-text-input>
    ${worldstable}
    </bim-panel-section>
    </bim-panel>`
})

const onSpatialupdate = () => {
    if (!floatingGrid) return
    floatingGrid.layout = "relations"
}
const elementRelationsPanel = BUI.Component.create<BUI.Panel>(() => {
    const [relationsTree] = CUI.tables.relationsTree({
        components,
        models: []
    })

    relationsTree.preserveStructureOnFilter = true;

    const search = (e: Event) => {
        const input = e.target as BUI.TextInput
        relationsTree.queryString = input.value
    }

    return BUI.html `
    <bim-panel>
    <bim-panel-section
    name="relations"
    label="Relations"
    icon="tabler:brush"
    fixed
    >
    <bim-text-input @input=${search} placeholder="Search" icon="material-symbols:search..."></bim-text-input>
    ${relationsTree}
    </bim-panel-section>
    </bim-panel`
})

const toolbar = BUI.Component.create<BUI.Toolbar> (() => {
    const [loadIfcbtn] = CUI.buttons.loadIfc({ components: components})
    return BUI.html `

    <bim-toolbar style="justify-self: center;">
    <bim-toolbar-section label="App">
    <bim-button
    label="World"
    icon="tabler;brush"
    @click=${onWorldsUpdate}
    ></bim-button>
    </bim-toolbar-section>
        <bim-toolbar-section label="App">
    <bim-button
    label="spatial"
    icon="tabler;brush"
    @click=${onSpatialupdate}
    ></bim-button>
    </bim-toolbar-section>
    <bim-toolbar-section label="Import">
    ${loadIfcbtn}
    </bim-toolbar-section>
    <bim-toolbar-section label="Selection"></bim-toolbar-section>
    <bim-button
    label="Visibility"
    icon="material-symbols:visibility"
    @click=${onToggleVisibility}
    ></bim-button>
    <bim-button
    label="Isolate"
    icon="mdi:filter"
    @click=${onIsolate}
    ></bim-button>
    <bim-button
    label="Show All"
    icon="tabler:eye-filled"
    @click=${onShow}
    ></bim-button>
    <bim-button
    label="Show"
    icon="clarity:list-line"
    @click=${onShowproperties}
    ></bim-button>
    </bim-toolbar-section>
    </bim-toolbar>`
})

floatingGrid.layouts = {
    main: {
        template: `
        "empty" 1fr
        "toolbar" auto
        /1fr
        `,
        elements: {
            toolbar
        }
    },
     second: {
        template: `
        "empty elementPropertyPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
            toolbar,
            elementPropertyPanel
        },
    },
    world: {
        template: `
        "empty worldPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
            toolbar,
            worldPanel
        },
    },
    relations: {
        template: `
        "empty elementRelationsPanel" 1fr
        "toolbar toolbar" auto
        /1fr 20rem
        `,
        elements: {
            toolbar,
            elementRelationsPanel
        },
    }
}
floatingGrid.layout = "main"

viewerContainer.appendChild(floatingGrid);
}


React.useEffect(() => {
    setViewer();
    setupUI();

return () => {
    if (components) {
    components.dispose();
    }
    if (fragmentModel) {
    fragmentModel.dispose()
    fragmentModel = undefined;
}

};


}, []);


    return (
        <bim-viewport 
        id="viewer-container"></bim-viewport>

    )   
}









