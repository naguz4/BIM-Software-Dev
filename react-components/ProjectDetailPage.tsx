import * as React from 'react';
import { ProjectsManager } from '../src/class/ProjectManager';
import * as Router from "react-router-dom";

interface Props {
    projectsManager: ProjectsManager;
}


export function ProjectDetailPage(props: Props) {
  const routeParams = Router.useParams<{id: string}>()
  const projectid = routeParams.id
  if (!projectid) {
    return <div>id not found</div>
  }

  const project = props.projectsManager.getProject(projectid)
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
      </div>
      <div className="dashboard-card" style={{ flexGrow: 1 }}>
        <div
          style={{
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            gap: 40,
            justifyContent: "space-between"
          }}
        >
          <h4>To-Do</h4>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span className="material-symbols-outlined">search</span>
            <input type="text" placeholder="Search To-Do" />
          </div>
          <button className="material-symbols-outlined add">add</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", margin: 20 }}>
          <div className="todo-item">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div
                style={{ display: "flex", columnGap: 30, alignItems: "center" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    backgroundColor: "rgb(108, 107, 105)",
                    borderRadius: "30%",
                    width: 40,
                    height: 40,
                    textAlign: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  construction
                </span>
                <p style={{ width: 250 }}>
                  Make anything here as you want, even
                </p>
              </div>
              <p>20/05/2005</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>


    )

}
