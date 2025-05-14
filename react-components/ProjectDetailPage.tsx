import * as React from 'react';
import { ProjectsManager } from '../src/class/ProjectManager';
import { IProject, UserRole, ProjecStatus, Project, ITodo } from '../src/class/Project';
import * as Router from "react-router-dom";
import { ProjectTodo } from './ProjectTodo';
//import { TodoItem } from './TodoItem';


interface Props {
    projectsManager: ProjectsManager;
}


export function ProjectDetailPage(props: Props) {

  const routeParams = Router.useParams<{id: string}>()
  const projectid = routeParams.id
  if (!projectid) {
    return <div>id not found</div>
  }

  const project = props.projectsManager.getProject(projectid as string)
  if (!project) {
    return <div>Project not found</div>
  }
    return (
        <div className="page" id="project-details">
  <header>
    <div>
      <h2 data-project-info="name">{project.name}</h2>
      <p data-project-info="Description" style={{ color: "antiquewhite" }}>
      {project.description}
      </p>
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
          <button className="btn-secondary">
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
              <p data-project-info="finishDate">{project.finishDate.toLocaleDateString()}</p>
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
        <ProjectTodo projectsManager={props.projectsManager} project={project}/>
        
      </div>

    </div>
  </div>
</div>


    )

}
