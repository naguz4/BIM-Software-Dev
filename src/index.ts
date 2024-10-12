import { IProject, UserRole, ProjecStatus} from "./class/Project"
import { ProjectsManager } from "./class/ProjectManager"

function toggleModal(id: string) {
    const modal = document.getElementById(id)
    if (modal && modal instanceof HTMLDialogElement) {
        if (modal.open) {
            modal.close();
        } else {
            modal.showModal();
        }    
    } else {
        console.warn("The provided modal wasn't found. ID:", id)
    }
}

const projectsListUI = document.getElementById("projects-list") as HTMLElement
const projectsManager = new ProjectsManager(projectsListUI)



const newProjectBtn = document.getElementById("new-project-btn")
if (newProjectBtn) {
    newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})

} else {
    console.log("New project button was not found")

}

const projectForm = document.getElementById("new-project-form") as HTMLFormElement | null;
const cancelButton = document.getElementById("CancelButton");
if (projectForm && projectForm instanceof HTMLFormElement) {
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const formData = new FormData(projectForm)
        const projectData: IProject = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            status: formData.get("status") as ProjecStatus,
            userRole: formData.get("userRole") as UserRole,
            finishDate: new Date(formData.get("finishDate") as string)
        }
        const project = projectsManager.newProject(projectData)
        projectForm.reset()
        toggleModal("new-project-modal")



})  
} else {
    console.warn("The project form was not found. Check the ID!")
}


if (cancelButton) {
    cancelButton.addEventListener("click", (e) => {
        e.preventDefault(); // Prevent any default behavior (like submitting the form)
        if (projectForm) {
            projectForm.reset(); // Reset the form only if it exists
        }
        toggleModal("new-project-modal"); // Close the modal
    });
} else {
    console.warn("The cancel button was not found. Check the ID!");
}
