import * as React from 'react';
import { ProjectsManager } from '../src/class/ProjectManager';
import { IProject, UserRole, ProjecStatus, Project, ITodo } from '../src/class/Project';
import * as Router from "react-router-dom";
import { ProjectTodo } from './ProjectTodo';
import { div } from 'three/examples/jsm/nodes/Nodes.js';
//import { TodoItem } from './TodoItem';
import { ThreeViewer } from './ThreeViewer';
import { deleteDocument } from '../src/firebase';
import { updateDocument } from '../src/firebase';
import { Timestamp } from 'firebase/firestore';
import * as BUI from "@thatopen/ui";
import * as TEMPLATES from "../src/ui-templates";


interface Props {
    projectsManager: ProjectsManager;
}


export function ProjectDetailPage(props: Props)  {

  const routeParams = Router.useParams<{id: string}>()
  const projectid = routeParams.id

  const [project, setProject] = React.useState<Project | null>(props.projectsManager.getProject(projectid as string) || null);
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({
        name: project?.name || "",
        description: project?.description || "",
        userRole: project?.userRole || "architect",
        status: project?.status || "active",
        finishDate: project?.finishDate ? new Date(project.finishDate) : new Date(), // <-- Date object
  });

  React.useEffect(() => {
      setProject(props.projectsManager.getProject(projectid as string) || null);
  }, [props.projectsManager, projectid]);
  
  if (!projectid) {
    return alert("id not found");
  }
  if (!project) {
    return alert("Project not found");

  }
      const handleEditOpen = () => {
        setEditData({
            name: project.name,
            description: project.description,
            userRole: project.userRole,
            status: project.status,
            finishDate: project.finishDate,
        });
        setIsEditOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Update the project object
        project.name = editData.name;
        project.description = editData.description;
        project.userRole = editData.userRole as any;
        project.status = editData.status as any;
        project.finishDate = new Date(editData.finishDate);
        props.projectsManager.updateProject(project);
        setProject({ ...project });
        setIsEditOpen(false);

        try {
            const cleanData = Object.fromEntries(
              Object.entries({
                name: editData.name as string,
                description: editData.description as string,
                userRole: editData.userRole as UserRole,
                status: editData.status as ProjecStatus,
                finishDate: editData.finishDate.toISOString(),
                todos: project.todos,
                firstletters: project.firstletters as string,
              }).filter(([_, v]) => v !== undefined)
            );
          console.log("Updating Firestore with:", cleanData);
          await updateDocument("/projects", project.id, cleanData);
        } catch (err) {
            alert("Failed to update project in Firebase!");
        }
    };



    const navigateTo = Router.useNavigate()

    props.projectsManager.onProjectDeleted = async (id) => {
      await deleteDocument("projects", id)
      navigateTo("/")
    }

    const viewerGrid = React.useRef<BUI.Grid<["Main"]>>(null);
    React.useEffect(() => {
      const { current:grid } = viewerGrid;
      if (!grid) return

      grid.elements = {
        header: {
          template: ( ) => BUI.html`<div></div>`,
          initialState: {}
        },
        sidebar: {
          template: ( ) => BUI.html`<div></div>`,
          initialState: {}
        },
        componentsGrid: {
          template: TEMPLATES.componentsGridTemplate,
          initialState: {}
        }
      };
      grid.layouts = {
        Main: {
          template: `
          "header header" auto
          "sidebar componentsGrid" 1fr
          /auto 1fr
          `,
        }
      }

      grid.layout = "Main";
    }, []);

    return (
        <bim-grid ref={viewerGrid} className="viewer-grid">
  {/*<header>
    <div>
      <h2 data-project-info="name">{project.name}</h2>
      <p data-project-info="Description" style={{ color: "antiquewhite" }}>
      {project.description}
      </p>
    </div>
    <button onClick={() => {props.projectsManager.deleteProject(project.id)}} style = {{backgroundColor: "red"}}>Delete project</button>
  </header>
  <div className="main-page-content">
    <div style={{ display: "flex", flexDirection: "column", rowGap: 5 }}>
      <div
        className="dashboard-card"
        style={{ padding: 30, gap: 20 }}
        id="dashboard-card"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p
            className="initials"
            data-project-info="initials"
            style={{
              fontSize: 23,
              backgroundColor: "rgb(218, 169, 78)",
              borderRadius: "50%",
              width: 50,
              height: 50,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            HC
          </p>
          <button className="btn-secondary" onClick={handleEditOpen}>
             <p style={{ width: 20 }}>Edit</p>
          </button>
        </div>
        <div style={{ padding: "0 30px" }}>
          <div>
            <h5 data-project-info="name" style={{ padding: 10 }}>
            {project.name}
            </h5>
            <p data-project-info="Description" style={{ padding: 10 }}>
            {project.description}
            </p>
          </div>
          <div style={{ display: "flex", columnGap: 30, padding: 5 }}>
            <div>
              <p
                style={{
                  color: "rgb(107, 105, 101)",
                  fontSize: "var(form-field-container)"
                }}
              >
                {project.status}
              </p>
              <p data-project-info="status">Active</p>
            </div>
            <div>
              <p
                style={{
                  color: "rgb(107, 105, 101)",
                  fontSize: "var(form-field-container)"
                }}
              >
                Value
              </p>
              <p>${project.cost}</p>
            </div>
            <div>
              <p
                style={{
                  color: "rgb(107, 105, 101)",
                  fontSize: "var(form-field-container)"
                }}
              >
                Role
              </p>
              <p data-project-info="userRole">{project.userRole}</p>
            </div>
            <div>
              <p
                style={{
                  color: "rgb(107, 105, 101)",
                  fontSize: "var(form-field-container)"
                }}
              >
                Date
              </p>
              <p data-project-info="finishDate">{new Date(project.finishDate).toLocaleDateString()}</p>
            </div>
          </div>
          <div style={{ backgroundColor: "#404040", borderRadius: 20 }}>
            <div
              style={{
                width: `${project.progress * 100}%`,
                backgroundColor: "green",
                borderRadius: 20
              }}
            >
              <p style={{ textAlign: "center" }}>{project.progress}%</p>
            </div>
           
          </div>
          
        </div>
        <ProjectTodo projectsManager={props.projectsManager} project={project} />

      </div>

    </div>
    <ThreeViewer/>
  </div>*/}{/*
            {isEditOpen && (
                <dialog open>
                    <form onSubmit={handleEditSubmit} style={{ background: "#222", color: "#fff", padding: 20, borderRadius: 10, minWidth: 350 }}>
                        <h2>Edit Project</h2>
                        <label>
                            Name:
                            <input name="name" value={editData.name} onChange={handleEditChange} required />
                        </label>
                        <label>
                            Description:
                            <textarea name="description" value={editData.description} onChange={handleEditChange} required />
                        </label>
                        <label>
                            Role:
                            <select name="userRole" value={editData.userRole} onChange={handleEditChange}>
                                <option value="architect">Architect</option>
                                <option value="engineer">Engineer</option>
                                <option value="developer">Developer</option>
                            </select>
                        </label>
                        <label>
                            Status:
                            <select name="status" value={editData.status} onChange={handleEditChange}>
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="finished">Finished</option>
                            </select>
                        </label>
                        <label>
                            Finish Date:
                            <input name="finishDate" type="date" value={editData.finishDate ? editData.finishDate.toISOString().split("T")[0] : ""} onChange={e => setEditData({ ...editData, finishDate: new Date(e.target.value) })} required />
                        </label>
                        <div style={{ marginTop: 10 }}>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditOpen(false)} style={{ marginLeft: 10 }}>Cancel</button>
                        </div>
                    </form>
                </dialog>
            )} */}
            
            
</bim-grid>
      );


};


