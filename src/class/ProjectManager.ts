import { IProject, Project, ITodo } from "./Project";

export class ProjectsManager {
    list: Project[] = [];
    OnProjectCreated = (project: Project) => {}
    onProjectDeleted = (id: string) => {}
    currentProject: Project | null = null;
    defaultProjectData: IProject = {
        name: "Default Project Name",
        description: "Default Project Description",
        userRole: "architect",
        status: "active",
        finishDate: new Date("2024-04-09"),
        firstletters: "HC",
        todos: [{
            description: "Default Todo",
            dueDate: new Date("2024-04-09"),
            status: "active",
            priority: "low", 
        }],
    };
    setCurrentProject(project: Project) {
        this.currentProject = project;
        this.setdashboard(project);
    }
    addtodo(projectId: string, description: string, dueDate: Date, status: string, priority: string) {
        const project = this.getProject(projectId);
        if (!project) {
            console.error(`Project with ID ${projectId} not found`);
            return;
        }
        const todo: ITodo = {
            description,
            dueDate,
            status,
            priority,
        };
        project.todos.push(todo);

        // Trigger any necessary updates (e.g., re-rendering)
        this.updateProject(project);
    }
    

    updateProject(updatedProject: Project) {
        const index = this.list.findIndex((project) => project.id === updatedProject.id);
        if (index !== -1) {
            this.list[index] = updatedProject;
        }
    }

    

    filterProject(value: string) {
              const filteredProjects = this.list.filter((project) => {
        return project.name.includes(value)
      })
      return filteredProjects;
  
    }

    newProject(data: any, id?: string) {
        const projectNames = this.list.map((project) => {
            return project.name;
        });
        const nameInUse = projectNames.includes(data.name);
        if (nameInUse) {
            throw new Error(`A project with the name "${data.name}" already exists`);
        }
        if (!data.finishDate) {
            data.finishDate = new Date("2025-02-17");
        } else if (data.finishDate instanceof Date) {
            data.finishDate = data.finishDate;
        }
        // Ensure todos are objects
        const todos = Array.from(data.todos ?? []).map(todo => {
            if (typeof todo === "object" && todo !== null) {
                return { ...todo };
            }
            // If todo is not an object, create a default todo object
            return {
                description: String(todo),
                dueDate: new Date(),
                status: "active",
                priority: "low"
            };
        });
        const projectData = { ...data, todos };
        const project = new Project(projectData, id);
        this.list.push(project);
        this.OnProjectCreated(project)
        return project;
    }


    setdashboard(project: Project) {
        const dashboardcard = document.getElementById("dashboard-card");
        if (!dashboardcard) {
            return;
        }
        const name = dashboardcard.querySelector("[data-project-info='name']");
        if (name) {
            name.textContent = project.name;
        }
        const description = dashboardcard.querySelector("[data-project-info='Description']");
        if (description) {
            description.textContent = project.description;
        }
        const userRole = dashboardcard.querySelector("[data-project-info='userRole']");
        if (userRole) {
            userRole.textContent = project.userRole;
        }
        const status = dashboardcard.querySelector("[data-project-info='status']");
        if (status) {
            status.textContent = project.status;
        }
        const finishDate = dashboardcard.querySelector("[data-project-info='finishDate']");
        if (finishDate) {
            const date = project.finishDate ? new Date(project.finishDate) : new Date("2025-02-17"); // Set default finish date if empty
            const formattedDate = date.toLocaleDateString("en-GB", { year: 'numeric', month: '2-digit', day: '2-digit' });
            finishDate.textContent = formattedDate;
        }
        const firstletters = dashboardcard.querySelector("[data-project-info='initials']");
        if (firstletters) {
            var getname = project.name;
            var getInitials = function (getname) {
                var parts = getname.split(' ');
                var initials = '';
                for (var i = 0; i < parts.length; i++) {
                    if (parts[i].length > 0 && parts[i] !== '') {
                        initials += parts[i][0];
                    }
                }
                return initials;
            };
            firstletters.textContent = getInitials(getname);
        }
    }

    getProject(id: string) {
        const project = this.list.find((project) => {
            return project.id === id;
        });
        return project;
    }

    calculateCost() {
        const totalcost: number = this.list.reduce(
            (sumOfCost, currentProject) => sumOfCost + currentProject.cost, 0
        );
        return totalcost;
    }

    getProjectByName(name: string) {
        const project = this.list.find((project) => {
            return project.name === name;
        });
        return project;
    }

    deleteProject(id: string) {
        const project = this.getProject(id);
        if (!project) {
            return;
        }
        const remaining = this.list.filter((project) => {
            return project.id !== id;
        });
        this.list = remaining;
        this.onProjectDeleted(id)
    }

    exportToJSON(fileName: string = "projects") {
        const json = JSON.stringify(this.list, (key, value) => {
            if (key === "ui") return undefined;
            return value;
        });
        const blob = new Blob([json], { type: `application/json` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    }

    importFromJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        const reader = new FileReader();
        reader.addEventListener("load", () => {
            const json = reader.result;
            if (!json) {
                return;
            }
            const projects: IProject[] = JSON.parse(json as string);
            for (const projectData of projects) {
                const existingProject = this.getProjectByName(projectData.name);
                if (existingProject) {
                    // Update existing project details
                    existingProject.description = projectData.description;
                    existingProject.status = projectData.status;
                    existingProject.userRole = projectData.userRole;
                    existingProject.finishDate = projectData.finishDate instanceof Date
                        ? projectData.finishDate
                        : new Date(projectData.finishDate);
                    existingProject.firstletters = projectData.firstletters;
                    existingProject.todos = Array.from(projectData.todos).map(todo => ({
                        ...todo,
                        dueDate: typeof todo.dueDate === "string"
                            ? new Date(todo.dueDate)
                            : todo.dueDate
                    }));
                    this.setdashboard(existingProject); // Update the dashboard card
                } else {
                    // Create a new project
                    this.newProject(projectData);
                }
            }
        });
        input.addEventListener('change', () => {
            const filesList = input.files;
            if (!filesList) {
                return;
            }
            reader.readAsText(filesList[0]);
        });
        input.click();
    }
}