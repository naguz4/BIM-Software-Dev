import * as React from 'react';
import { IProject, UserRole, ProjecStatus, Project } from '../src/class/Project';
import { ProjectsManager } from '../src/class/ProjectManager'

export function ProjectPage() {
    const projectsManager = new ProjectsManager();
    const onFormSubmit = (e: React.FormEvent) => {
                const projectForm = document.getElementById("new-project-form");
                if (!(projectForm && projectForm instanceof HTMLFormElement)) {return}
                e.preventDefault();
                const projectNameInput = document.querySelector<HTMLInputElement>("input[name='name']");
                const errorMessage = document.createElement("div"); // Create an error message dynamically
                errorMessage.style.color = "red";
                errorMessage.style.display = "none";
                errorMessage.textContent = "Project name must be at least 5 characters long.";

                // Insert the error message after the input field if it exists
                if (projectNameInput) {
                 projectNameInput.parentElement?.appendChild(errorMessage);
                }
                
                if (projectNameInput && projectNameInput.value.trim().length < 5) {
                    errorMessage.style.display = "block"; // Show error if name is too short
                    return;
                } else {
                    errorMessage.style.display = "none"; // Hide error when valid
                }
        
                const formData = new FormData(projectForm);
                const finishDateValue = formData.get("finishDate") as string;
                const finishDate = finishDateValue ? new Date(finishDateValue) : new Date(); // Set default date to current date if not provided

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
                    console.log(project)
                    let currentProject: Project | null = null;
                    currentProject = project; // Set the current project
                    projectForm.reset();
                    const modal = document.getElementById("new-project-modal");
                    if (!(modal && modal instanceof HTMLDialogElement)) {return}
                    modal.close();
                } catch (err) {
                    const errorText = document.getElementById("errorText");
                    if (errorText) {
                        errorText.textContent = err as string;
                    }
                }
    }
    const onNewProjectClick = () => {
        const modal = document.getElementById("new-project-modal")
        if (!(modal && modal instanceof HTMLDialogElement)) {return}
        modal.showModal()
    }
    
    
    

    const onFileUploadClick = () => {
        projectsManager.importFromJSON();
    }

    const onFileDownloadClick = () => {
        projectsManager.exportToJSON();
    }

    return(        
        <div className="page" id="projects-page" style={{ display: "flex" }}>
        <dialog id="new-project-modal">
          <form id="new-project-form" onSubmit={(e) =>{onFormSubmit(e)}}>
            <h2>New Project</h2>
            <div className="input-list">
              <div className="form-field-container">
                <label>
                  <span className="material-symbols-outlined">apartment</span>Name
                </label>
                <input name="name" type="text" id="project-name" />
                <div className="hint">Hint: use capitals</div>
                <div id="error-message" style={{ color: "red", display: "none" }}>
                  Project name must be at least 5 characters long.
                </div>
              </div>
              <div className="form-field-container">
                <label>
                  <span className="material-symbols-outlined">description</span>
                  Description
                </label>
                <textarea
                  name="description"
                  cols={30}
                  rows={5}
                  placeholder="Give your Description"
                  defaultValue={""}
                />
              </div>
              <div className="form-field-container">
                <label>
                  <span className="material-symbols-outlined">account_circle</span>
                  Role
                </label>
                <select name="userRole">
                  <option>Architect</option>
                  <option>Eng</option>
                  <option>Developer</option>
                </select>
              </div>
              <div className="form-field-container">
                <label>
                  <span className="material-symbols-outlined">location_on</span>Status
                </label>
                <select name="status">
                  <option>Pending</option>
                  <option>Active</option>
                  <option>Finished</option>
                </select>
              </div>
              <div className="form-field-container">
                <label>
                  <span className="material-symbols-outlined">calendar_month</span>
                  Finish Date
                </label>
                <input name="finishDate" type="date" />
                <input />
              </div>
            </div>
            <div>
              <button id="CancelButton" type="button">
                Cancel
              </button>
              <button type="submit">Accept</button>
            </div>
          </form>
        </dialog>
        <header>
          <h2>Projects</h2>
          <div>
            <button
              id="import-project-btn"
              className="material-icons-round action-icon"
              onClick={onFileUploadClick}
            >
              File Upload
            </button>
            <button
              id="export-project-btn"
              className="material-icons-round action-icon"
              onClick={onFileDownloadClick}
            >
              File Download
            </button>
            <button onClick={onNewProjectClick} id="new-project-btn">New Project</button>
          </div>
        </header>
        <div id="projects-list">
          <div className="project-card">
            <div className="card-header">
              <p
                style={{
                  backgroundColor: "orange",
                  padding: 10,
                  borderRadius: 8,
                  aspectRatio: 1,
                  textTransform: "uppercase"
                }}
              >
                HC
              </p>
              <div>
                <h5>Project Name</h5>
                <p>Project Description</p>
              </div>
            </div>
            <div className="card-content">
              <div className="card-property">
                <p style={{ color: "beige" }}>Status</p>
                <p>Active</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Status</p>
                <p>Active</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Role</p>
                <p>Enginner</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Cost</p>
                <p>$200000</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Estimated Progress</p>
                <p>45%</p>
              </div>
            </div>
          </div>
          <div className="project-card">
            <div className="card-header">
              <p
                className="initials"
                style={{
                  backgroundColor: "orange",
                  padding: 10,
                  borderRadius: 8,
                  aspectRatio: 1,
                  textTransform: "uppercase"
                }}
              >
                HC
              </p>
              <div>
                <h5>Project Name</h5>
                <p>Project Description</p>
              </div>
            </div>
            <div className="card-content">
              <div className="card-property">
                <p style={{ color: "beige" }}>Status</p>
                <p>Active</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Status</p>
                <p>Active</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Role</p>
                <p>Enginner</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Cost</p>
                <p>$200000</p>
              </div>
              <div className="card-property">
                <p style={{ color: "beige" }}>Estimated Progress</p>
                <p>45%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
}