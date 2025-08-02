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
                finishDate: (data.finishDate as unknown as Firestore.Timestamp).toDate(), // Convert Firestore Timestamp to Date
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
                  <span className="material-symbols-outlined">location_on</span>
                  Status
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
          <Searchbox onChange={(value) => onProjectSearch(value)}/>
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
