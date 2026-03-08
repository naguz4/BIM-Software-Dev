import * as BUI from "@thatopen/ui";
import { ItemsDataPanelState, ModelsPanelState } from "../../../sections";

type Viewport ={
    name: "viewport";
    state: {};
}

export type ItemsData = {
    name: "itemsData";
    state: ItemsDataPanelState

}

export type Models = {
    name: "models";
    state: ModelsPanelState;
}

type ComponentsGridElements = [Viewport, ItemsData, Models];
type ComponentsGridlayouts = ["Models"];

export type ComponentsGrid = BUI.Grid<ComponentsGridlayouts, ComponentsGridElements>