
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Router from "react-router-dom";
import { Sidebar } from "../src/react-components/Sidebar";
import { ProjectPage } from "../src/react-components/ProjectPage";

import { ProjectDetailPage } from "../src/react-components/ProjectDetailPage";
import { ProjectsManager } from "../src/class/ProjectManager";
import { ProjectTodo } from "../src/react-components/ProjectTodo";
import * as BUI from "@thatopen/ui";

BUI.Manager.init()

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "bim-label": any;
            "bim-button": any;
            "bim-text-input": any;
            "bim-grid": any;
    }
}
}


const projectsManager = new ProjectsManager()


const rootElement = document.getElementById("app") as HTMLElement
const appRoot = ReactDOM.createRoot(rootElement)
appRoot.render(
    
        <Router.BrowserRouter>
            <Sidebar />
            <Router.Routes>
                <Router.Route path="/" element={<ProjectPage projectsManager={projectsManager} />} />
                <Router.Route path="/project/:id" element={<ProjectDetailPage projectsManager={projectsManager}  />} />
                
            </Router.Routes>
        </Router.BrowserRouter>
   
)

