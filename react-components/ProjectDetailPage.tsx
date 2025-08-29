import * as React from 'react';
import { ProjectsManager } from '../src/class/ProjectManager';
import { IProject, UserRole, ProjecStatus, Project, ITodo } from '../src/class/Project';
import * as Router from "react-router-dom";
import { ProjectTodo } from './ProjectTodo';
import { color, div } from 'three/examples/jsm/nodes/Nodes.js';
//import { TodoItem } from './TodoItem';
import { IFCViewer } from './IFCViewer';
import { deleteDocument } from '../src/firebase';
import { updateDocument } from '../src/firebase';
import { Timestamp } from 'firebase/firestore';
import * as BUI from "@thatopen/ui";



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
      finishDate: typeof project.finishDate === 'string' ? new Date(project.finishDate) : project.finishDate,
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.target.name === "finishDate") {
      setEditData({ ...editData, finishDate: new Date(e.target.value) });
    } else {
      setEditData({ ...editData, [e.target.name]: e.target.value });
    }
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
    return (
        <div className="page" id="project-details">
  <header>
    <div>
      <bim-label style={{color: "#fff", fontSize: "var(--font-xl)"}} data-project-info="name">{project.name}</bim-label>
      <bim-label data-project-info="Description" style={{ color: "#969696" }}>
      {project.description}
      </bim-label>
    </div>
    <div>
      <bim-button label="Delete" icon="ph:trash" onClick={() => {props.projectsManager.deleteProject(project.id)}} style = {{backgroundColor: "red"}}></bim-button>
    </div>
    
  </header>
  <div className="main-page-content">
    <div style={{ display: "flex", flexDirection: "column", rowGap: 5 }}>
      <div
        className="dashboard-card"
        style={{ padding: 30, gap: 20 }}
        id="dashboard-card"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <li
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
          </li>
          <div>
            <bim-button icon="ph:edit" label="Edit" className="btn-secondary" onClick={handleEditOpen}></bim-button>
          </div>
        </div>
        <div style={{ padding: "0 30px" }}>
          <div>
            <bim-label label="Name" data-project-info="name" style={{color: "#fff", fontSize: "var(--font-xl)"}}>
            {project.name}
            </bim-label>
            <bim-label label="Description" data-project-info="Description" style={{ padding: 10 }}>
            {project.description}
            </bim-label>
          </div>
          <div style={{ display: "flex", columnGap: 30, padding: 5 }}>
            <div>
              <bim-label style={{color: "#fff", fontSize: "var(--font-sm)"}} label="Status">
                Status
              </bim-label>
              <bim-label data-project-info="status">{project.status}</bim-label>
            </div>
            <div>
              <bim-label style={{color: "#fff", fontSize: "var(--font-sm)"}}label="Value">
                Value
              </bim-label>
              <bim-label>${project.cost}</bim-label>
            </div>
            <div>
              <bim-label style={{color: "#fff", fontSize: "var(--font-sm)"}}label="Role">
                Role
              </bim-label>
              <bim-label data-project-info="userRole">{project.userRole}</bim-label>
            </div>
            <div>
              <bim-label style={{color: "#fff", fontSize: "var(--font-sm)"}}label="Date">
                Date
              </bim-label>
              <bim-label data-project-info="finishDate">{new Date(project.finishDate).toLocaleDateString()}</bim-label>
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
    <IFCViewer/>
  </div>
              {/* Edit Modal */}
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
              <input name="finishDate" type="date" value={editData.finishDate instanceof Date && !isNaN(editData.finishDate as any) ? editData.finishDate.toISOString().split("T")[0] : ""} onChange={handleEditChange} required />
            </label>
                        <div style={{ marginTop: 10 }}>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setIsEditOpen(false)} style={{ marginLeft: 10 }}>Cancel</button>
                        </div>
                    </form>
                </dialog>
            )}
            
</div>


    );

}
