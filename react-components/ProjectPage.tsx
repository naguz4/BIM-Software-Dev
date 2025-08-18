import * as React from 'react';
import * as Router from "react-router-dom";
import { IProject, UserRole, ProjecStatus, Project } from '../src/class/Project';
import { ProjectsManager } from '../src/class/ProjectManager'
import { ProjectCard } from './ProjectCard';
import { Searchbox } from './Searchbox';
import { Alert, AlertTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as Firestore from "firebase/firestore";
import { firestoreDB } from '../src/firebase';
import { getCollection } from '../src/firebase';
import * as BUI from '@thatopen/ui';


interface Props {
  projectsManager: ProjectsManager;
}

const projectsCollection = getCollection<IProject>("/projects");

export function ProjectPage(props: Props) {
    
    
    const [projects, setProjects] = React.useState<Project[]>(props.projectsManager.list);
    props.projectsManager.OnProjectCreated = () => {setProjects([...props.projectsManager.list])}
    

    const getFirestoreProjects = async () => {
            const firebaseProjects = await Firestore.getDocs(projectsCollection)
            for ( const doc of firebaseProjects.docs) {
              const data = doc.data()
              const project: IProject = {
                ...data,
                finishDate: (data.finishDate)
              }
              try {
                props.projectsManager.newProject(project, doc.id)
              } catch (error) {
                console.error("Error adding project:", error);
              }
              
    }
  }

    React.useEffect(() => {
      getFirestoreProjects();

    }, [])

    const projectCards = projects.map((project) => {
      return (
      <Router.Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project}  />
      </Router.Link>
      )
    })

    React.useEffect(() => {
      console.log("Project updated", projects)
    }, [projects])
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
                    finishDate: new Date(formData.get("finishDate") as string),
                    firstletters: getInitials(formData.get("name") as string),
                    todos: [], // Initialize todos
                };
        
                try {
                  Firestore.addDoc(projectsCollection, projectData)
                    const project = props.projectsManager.newProject(projectData);
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
        props.projectsManager.importFromJSON();
    }

    const onFileDownloadClick = () => {
        props.projectsManager.exportToJSON();
    }

    const onProjectSearch = (value: string) => {
      setProjects(props.projectsManager.filterProject(value))

    }

    const importBtn = BUI.Component.create<BUI.Button>(() => {
      return BUI.html`
      <bim-button
        id="import-project-btn"
        icon="iconoir:import"
        @click=${onFileUploadClick}
      >
      </bim-button>
      `
    })

    const exportBtn = BUI.Component.create<BUI.Button>(() => {
      return BUI.html`
      <bim-button
        id="export-project-btn"
        icon="ph:export"
        @click=${onFileDownloadClick}
      >
      </bim-button>
      `
    })
    const newProjectBtn = BUI.Component.create<BUI.Button>(() => {
      return BUI.html`
      <bim-button
      label="New Project" 
      icon="fluent:add-20-regular" 
      id="new-project-btn"
      @click=${onNewProjectClick}
      >
      </bim-button>
      `
    })

    React.useEffect(() => {
      const projectControls = document.getElementById("project-page-controls");
      projectControls?.appendChild(importBtn);
      projectControls?.appendChild(exportBtn);
      projectControls?.appendChild(newProjectBtn);

      const cancelBtn = document.getElementById("cancel-btn");
      cancelBtn?.addEventListener("click", () => {
      const modal = document.getElementById("new-project-modal");
      if (!(modal && modal instanceof HTMLDialogElement)) {return}
      modal.close();
    })
    }, [])

    return(
        <div className="page" id="projects-page" style={{ display: "flex" }}>
        <dialog id="new-project-modal">
          <form id="new-project-form" onSubmit={(e) =>{onFormSubmit(e)}}>
            <h2>New Project</h2>
            <div className="input-list">
              <div className="form-field-container">
                <label>
                  <bim-label label="Name" icon="material-symbols:apartment">Name</bim-label>
                </label>
                <input name="name" type="text" id="project-name" />
                <div className="hint">Hint: use capitals</div>
                <div id="error-message" style={{ color: "red", display: "none" }}>
                  Project name must be at least 5 characters long.
                </div>
              </div>
              <div className="form-field-container">
                <bim-label>
                  <span className="material-symbols-outlined">description</span>
                  Description
                </bim-label>
                <textarea
                  name="description"
                  cols={30}
                  rows={5}
                  placeholder="Give your Description"
                  defaultValue={""}
                />
              </div>
              <div className="form-field-container">
                <bim-label>
                  <span className="material-symbols-outlined">account_circle</span>
                  Role
                </bim-label>
                <bim-dropdown name="userRole">
                  <bim-option label="Architect" checked></bim-option>
                  <bim-option label="Eng"></bim-option>
                  <bim-option label="Developer"></bim-option>
                </bim-dropdown>
              </div>
              <div className="form-field-container">
                <bim-label>
                  <span className="material-symbols-outlined">location_on</span>
                  Status
                </bim-label>
                <bim-dropdown name="status">
                  <bim-option label="Pending"></bim-option>
                  <bim-option label="Active"></bim-option>
                  <bim-option label="Finished"></bim-option>
                </bim-dropdown>
              </div>
              <div className="form-field-container">
                <bim-label icon="material-symbols:date-range" style={{ marginBottom: 5 }}>
                  Finish Date
                </bim-label>
                <bim-text-input name="finishDate" type="date" ></bim-text-input>
              </div>
            </div>
            <div>
              <bim-button id="cancel-btn" label="Cancel" type="button">
              </bim-button>
              <bim-button type="submit" label="Accept">
              </bim-button>
            </div>
          </form>
        </dialog>
        <header>
          <bim-label>Projects</bim-label>
          <Searchbox onChange={(value) => onProjectSearch(value)}/>
          <div style={{display: "flex", alignItems: "center", columnGap: 10}}
          id="project-page-controls">

          </div>
        </header>
        {
          projects.length > 0 ? <div id="projects-list">{ projectCards }</div> : <div>
            <Alert severity="info" style={{ margin: "20px" }}>
              <AlertTitle>No projects found</AlertTitle>
            </Alert>
            </div>
        }
        
      </div>
      )
}
