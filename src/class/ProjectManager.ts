import { IProject, Project} from "./Project"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
    defaultProjectData: IProject ={
        name: "Default Project Name",
        description: "Default Project Description",
        userRole: "architect",
        status: "active",
        finishDate: new Date("2024,04,09")
    }



    constructor(container: HTMLElement) {
        this.ui = container
        this.ui.innerHTML = ""
        this.newProject(this.defaultProjectData)
    }

    newProject(data: IProject) {
        const project = new Project(data)
        this.ui.append(project.ui)
        this.list.push(project)
        return project
    }
}