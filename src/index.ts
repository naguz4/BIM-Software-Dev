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

function openEditTodoModal(todoItem: HTMLElement, description: string, dueDate: string, status: string) {
    const editTodoModal = document.getElementById("edit-todo-modal") as HTMLDialogElement;
    const editTodoForm = document.getElementById("edit-todo-form") as HTMLFormElement;

    // Populate the form with the ToDo's details
    (editTodoForm.elements.namedItem("description") as HTMLTextAreaElement).value = description;
    (editTodoForm.elements.namedItem("dueDate") as HTMLInputElement).value = new Date(dueDate).toISOString().split("T")[0];
    (editTodoForm.elements.namedItem("status") as HTMLSelectElement).value = status;

    // Show the modal
    editTodoModal.showModal();

    // Handle form submission
    editTodoForm.onsubmit = (event) => {
        event.preventDefault();

        // Get updated values
        const updatedDescription = (editTodoForm.elements.namedItem("description") as HTMLTextAreaElement).value;
        const updatedDueDate = (editTodoForm.elements.namedItem("dueDate") as HTMLInputElement).value;
        const updatedStatus = (editTodoForm.elements.namedItem("status") as HTMLSelectElement).value;

        // Update the ToDo item in the UI
        todoItem.querySelector("[data-todo='descriptiontodo']")!.textContent = updatedDescription;
        todoItem.querySelector("[data-todo='datetodo']")!.textContent = new Date(updatedDueDate).toLocaleDateString();
        todoItem.querySelector("[data-todo='statustodo']")!.textContent = updatedStatus;

        // Update the class for the status
        todoItem.className = `todo-item ${updatedStatus}`;

        // Update the ToDo item in the current project's todos array
        if (currentProject) {
            const todoIndex = currentProject.todos.findIndex((todo) => todo.description === description && todo.dueDate === dueDate);
            if (todoIndex !== -1) {
                currentProject.todos[todoIndex] = {
                    description: updatedDescription,
                    dueDate: new Date(updatedDueDate).toISOString(),
                    status: updatedStatus,
                };
            }
        }

        // Close the modal
        editTodoModal.close();
    };

    // Handle cancel button
    const cancelButton = document.getElementById("edit-todo-cancel-button") as HTMLButtonElement;
    cancelButton.onclick = () => {
        editTodoModal.close();
    };
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
        const finishDateValue = formData.get("finishDate") as string;
        const finishDate = finishDateValue ? new Date(finishDateValue) : new Date(); // Set default date to current date if not provided

        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjecStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: finishDate,
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
            if (currentProject) {
                // Populate the form with current project details
                (editProjectForm.elements.namedItem("name") as HTMLInputElement).value = currentProject.name;
                (editProjectForm.elements.namedItem("description") as HTMLTextAreaElement).value = currentProject.description;
                (editProjectForm.elements.namedItem("userRole") as HTMLSelectElement).value = currentProject.userRole;
                (editProjectForm.elements.namedItem("status") as HTMLSelectElement).value = currentProject.status;
                (editProjectForm.elements.namedItem("finishDate") as HTMLInputElement).value = currentProject.finishDate.toISOString().split('T')[0];

                editProjectModal.showModal();
            }
        });

        editProjectForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Update project details
            const updatedName = (editProjectForm.elements.namedItem("name") as HTMLInputElement).value;
            const updatedDescription = (editProjectForm.elements.namedItem("description") as HTMLTextAreaElement).value;
            const updatedRole = (editProjectForm.elements.namedItem("userRole") as HTMLSelectElement).value;
            const updatedStatus = (editProjectForm.elements.namedItem("status") as HTMLSelectElement).value;
            const updatedFinishDate = (editProjectForm.elements.namedItem("finishDate") as HTMLInputElement).value;

            if (currentProject) {
                currentProject.name = updatedName;
                currentProject.description = updatedDescription;
                currentProject.userRole = updatedRole as UserRole;
                currentProject.status = updatedStatus as ProjecStatus;
                currentProject.finishDate = new Date(updatedFinishDate);
                currentProject.firstletters = getInitials(updatedName);

                // Update the dashboard card
                projectsManager.setdashboard(currentProject);

                // Update the project card
                const projectCard = currentProject.ui;
                const projectCardName = projectCard.querySelector("[data-project-info='name']");
                const projectCardDescription = projectCard.querySelector("[data-project-info='Description']");
                if (projectCardName) {
                    projectCardName.textContent = updatedName;
                }
                if (projectCardDescription) {
                    projectCardDescription.textContent = updatedDescription;
                }
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
            const status = (newTodoForm.elements.namedItem("status") as HTMLSelectElement).value;

            // Create a new to-do item element
            const todoItem = document.createElement("div");
            todoItem.className = `todo-item ${status}`;
            todoItem.innerHTML = `
                <div style="position: relative;">
                    <div style="display: flex; column-gap: 10px; align-items: center;">
                        <span class="material-symbols-outlined" style="background-color:rgb(108, 107, 105); border-radius: 30%; width: 40px; height: 40px; text-align: center; display: inline-block; display: flex; align-items: center; justify-content: center;">construction</span>
                        <p style="width:250px;" data-todo='descriptiontodo'>${description}</p>
                        <p data-todo='datetodo'>${new Date(dueDate).toLocaleDateString()}</p>
                        <p data-todo='statustodo'>${status}</p>
                    </div>
                    <button class="edit-todo-btn" style="position: absolute; top: 0; right: 0; display: none;">Edit</button>
                </div>
            `;

            // Show the edit button on hover
            todoItem.addEventListener("mouseenter", () => {
                const editButton = todoItem.querySelector(".edit-todo-btn") as HTMLButtonElement;
                editButton.style.display = "block";
            });

            todoItem.addEventListener("mouseleave", () => {
                const editButton = todoItem.querySelector(".edit-todo-btn") as HTMLButtonElement;
                editButton.style.display = "none";
            });

            // Append the new to-do item to the to-do list
            const todoList = document.querySelector(".dashboard-card .todo-item")?.parentElement;
            if (todoList) {
                todoList.appendChild(todoItem);
            }

            // Add the new to-do item to the current project's todos array
            if (currentProject) {
                currentProject.todos.push({ description, dueDate: new Date(dueDate).toISOString(), status });
            }

            // Add event listener for the edit button
            const editButton = todoItem.querySelector(".edit-todo-btn") as HTMLButtonElement;
            editButton.addEventListener("click", () => openEditTodoModal(todoItem, description, dueDate, status));

            // Reset the form and close the modal
            newTodoForm.reset();
            newTodoModal.close();
        });

        (document.getElementById("todo-cancel-button") as HTMLElement).addEventListener("click", () => {
            newTodoModal.close();
        });
    }
});
