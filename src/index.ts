import { IProject, UserRole, ProjecStatus, ITodo, Project } from "./class/Project";
import { ProjectsManager } from "./class/ProjectManager";

function toggleModal(id: string) {
    const modal = document.getElementById(id);
    if (modal && modal instanceof HTMLDialogElement) {
        if (modal.open) {
            modal.close();
        } else {
            modal.showModal();
        }    
    } else {
        console.warn("The provided modal wasn't found. ID:", id);
    }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement;
const projectsManager = new ProjectsManager(projectsListUI);

let currentProject: Project | null = null;

const newProjectBtn = document.getElementById("new-project-btn");
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {
        toggleModal("new-project-modal");
    });
} else {
    console.log("New project button was not found");
}

const ProjectsBtn = document.getElementById("ProjectsBtn");
if (ProjectsBtn) {
    ProjectsBtn.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page");
        const detailsPage = document.getElementById("project-details");
        if (!(projectsPage && detailsPage)) {
            return;
        }
        projectsPage.style.display = "flex";
        detailsPage.style.display = "none";
    });
}

const projectForm = document.getElementById("new-project-form") as HTMLFormElement | null;
const cancelButton = document.getElementById("CancelButton");
const errorwindow = document.getElementById("error-modal");
const closebutton = document.getElementById("close");
const errorText = document.getElementById("errorText");
const errorMessage = document.createElement("div"); // Create an error message dynamically
errorMessage.style.color = "red";
errorMessage.style.display = "none";
errorMessage.textContent = "Project name must be at least 5 characters long.";

const projectNameInput = document.querySelector<HTMLInputElement>("input[name='name']");

// Insert the error message after the input field if it exists
if (projectNameInput) {
    projectNameInput.parentElement?.appendChild(errorMessage);
}

const getInitials = (name: string): string => {
    const parts = name.split(" ");
    let initials = "";
    for (const part of parts) {
        if (part.length > 0) {
            initials += part[0];
        }
    }
    return initials;
};

if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (projectNameInput && projectNameInput.value.trim().length < 5) {
            errorMessage.style.display = "block"; // Show error if name is too short
            return;
        } else {
            errorMessage.style.display = "none"; // Hide error when valid
        }

        const formData = new FormData(projectForm);
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjecStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: new Date(formData.get("finishDate") as string),
            firstletters: getInitials(formData.get("name") as string),
            todos: [], // Initialize todos
        };

        try {
            const project = projectsManager.newProject(projectData);
            currentProject = project; // Set the current project
            projectForm.reset();
            toggleModal("new-project-modal");
        } catch (err) {
            toggleModal("error-modal");
            if (errorText) {
                errorText.textContent = err as string;
            }
        }
    });
} else {
    console.warn("The project form was not found. Check the ID!");
}

if (closebutton) {
    closebutton.addEventListener("click", (e) => {
        e.preventDefault();
        toggleModal("error-modal");
    });
}

if (cancelButton) {
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault();
        if (projectForm) {
            projectForm.reset();
        }
        toggleModal("new-project-modal");
    });
} else {
    console.warn("The cancel button was not found. Check the ID!");
}

const exportProjectBtn = document.getElementById("export-project-btn");
if (exportProjectBtn) {
    exportProjectBtn.addEventListener("click", () => {
        projectsManager.exportToJSON();
    });
}

const importProjectsBtn = document.getElementById("import-project-btn");
if (importProjectsBtn) {
    importProjectsBtn.addEventListener("click", () => {
        projectsManager.importFromJSON();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const editProjectBtn = document.querySelector(".btn-secondary");
    const editProjectModal = document.getElementById("edit-project-modal") as HTMLDialogElement;
    const editProjectForm = document.getElementById("edit-project-form") as HTMLFormElement;

    if (editProjectBtn && editProjectModal && editProjectForm) {
        editProjectBtn.addEventListener("click", () => {
            // Populate the form with current project details
            const projectNameElement = document.querySelector("[data-project-info='name']");
            const projectName = projectNameElement ? projectNameElement.textContent as string : "";
            const projectDescriptionElement = document.querySelector("[data-project-info='Description']");
            const projectDescription = projectDescriptionElement ? projectDescriptionElement.textContent as string : "";
            const projectRoleElement = document.querySelector("[data-project-info='userRole']");
            const projectRole = projectRoleElement ? projectRoleElement.textContent as string : "";
            const projectStatusElement = document.querySelector("[data-project-info='status']");
            const projectStatus = projectStatusElement ? projectStatusElement.textContent as string : "";
            const projectFinishDateElement = document.querySelector("[data-project-info='finishDate']");
            const projectFinishDate = projectFinishDateElement ? projectFinishDateElement.textContent as string : "";

            (editProjectForm.elements.namedItem("name") as HTMLInputElement).value = projectName;
            (editProjectForm.elements.namedItem("description") as HTMLTextAreaElement).value = projectDescription;
            (editProjectForm.elements.namedItem("userRole") as HTMLSelectElement).value = projectRole;
            (editProjectForm.elements.namedItem("status") as HTMLSelectElement).value = projectStatus;
            (editProjectForm.elements.namedItem("finishDate") as HTMLInputElement).value = projectFinishDate;

            editProjectModal.showModal();
        });

        editProjectForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Update project details
            const updatedName = (editProjectForm.elements.namedItem("name") as HTMLInputElement).value;
            const updatedDescription = (editProjectForm.elements.namedItem("description") as HTMLTextAreaElement).value;
            const updatedRole = (editProjectForm.elements.namedItem("userRole") as HTMLSelectElement).value;
            const updatedStatus = (editProjectForm.elements.namedItem("status") as HTMLSelectElement).value;
            const updatedFinishDate = (editProjectForm.elements.namedItem("finishDate") as HTMLInputElement).value;

            const nameElement = document.querySelector("[data-project-info='name']");
            if (nameElement) {
                nameElement.textContent = updatedName;
            }
            const descriptionElement = document.querySelector("[data-project-info='Description']");
            if (descriptionElement) {
                descriptionElement.textContent = updatedDescription;
            }
            const userRoleElement = document.querySelector("[data-project-info='userRole']");
            if (userRoleElement) {
                userRoleElement.textContent = updatedRole;
            }
            const statusElement = document.querySelector("[data-project-info='status']");
            if (statusElement) {
                statusElement.textContent = updatedStatus;
            }
            const finishDateElement = document.querySelector("[data-project-info='finishDate']");
            if (finishDateElement) {
                finishDateElement.textContent = updatedFinishDate;
            }

            editProjectModal.close();
        });

        const editCancelButton = document.getElementById("edit-cancel-button");
        if (editCancelButton) {
            editCancelButton.addEventListener("click", () => {
                editProjectModal.close();
            });
        } else {
            console.warn("The edit cancel button was not found. Check the ID!");
        }
    } else {
        console.warn("Edit project elements were not found. Check the IDs!");
    }

    const addTodoBtn = document.querySelector(".material-symbols-outlined.add");
    const newTodoModal = document.getElementById("new-todo-modal") as HTMLDialogElement;
    const newTodoForm = document.getElementById("new-todo-form") as HTMLFormElement;

    if (addTodoBtn && newTodoModal && newTodoForm) {
        addTodoBtn.addEventListener("click", () => {
            newTodoModal.showModal();
        });

        newTodoForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Get the new to-do item details
            const description = (newTodoForm.elements.namedItem("description") as HTMLTextAreaElement).value;
            const dueDate = (newTodoForm.elements.namedItem("dueDate") as HTMLInputElement).value;

            // Create a new to-do item element
            const todoItem = document.createElement("div");
            todoItem.className = "todo-item";
            todoItem.innerHTML = `
                <div style="display: flex; justify-content: space-between;">
                    <div style="display: flex; column-gap: 30px; align-items: center;">
                        <span class="material-symbols-outlined" style="background-color:rgb(108, 107, 105); border-radius: 30%; width: 40px; height: 40px; text-align: center; display: inline-block; display: flex; align-items: center; justify-content: center;">construction</span>
                        <p style="width:250px;" data-todo='descriptiontodo'>${description}</p>
                    </div>
                    <p data-todo='datetodo'>${dueDate}</p>
                </div>
            `;

            // Append the new to-do item to the to-do list
            const todoList = document.querySelector(".dashboard-card .todo-item")?.parentElement;
            if (todoList) {
                todoList.appendChild(todoItem);
            }

            // Add the new to-do item to the current project's todos array
            if (currentProject) {
                currentProject.todos.push({ description, dueDate });
            }

            // Reset the form and close the modal
            newTodoForm.reset();
            newTodoModal.close();
        });

        (document.getElementById("todo-cancel-button") as HTMLElement).addEventListener("click", () => {
            newTodoModal.close();
        });
    }
});
