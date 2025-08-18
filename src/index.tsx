
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Router from "react-router-dom";
import { Sidebar } from "../react-components/Sidebar";
import { ProjectPage } from "../react-components/ProjectPage";

import { ProjectDetailPage } from "../react-components/ProjectDetailPage";
import { ProjectsManager } from "../src/class/ProjectManager";
import { ProjectTodo } from "../react-components/ProjectTodo";
import { UsersPage } from "../react-components/UsersPage";
import * as BUI from "@thatopen/ui";

BUI.Manager.init()

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "bim-grid": any;
            "bim-label":any;
            "bim-button": any;
            "bim-text-input": any;
            "bim-table": any;
            "bim-dropdown": any;
            "bim-option": any;
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
                <Router.Route path="/users" element={<UsersPage />}></Router.Route>

            </Router.Routes>
        </Router.BrowserRouter>
   
)

