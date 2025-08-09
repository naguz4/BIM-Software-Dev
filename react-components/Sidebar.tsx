import * as React from 'react';
import * as Router from "react-router-dom"
import { useParams, useLocation, useNavigate } from "react-router-dom";

export function Sidebar () {
    const navigate = useNavigate();
    return (
        <aside id="sidebar">
        <img src="./assets/company-logo.svg" alt="Construction Company Logo" />
        <ul id="nav-buttons">
            <Router.Link to="/">
            <li id="ProjectsBtn" onClick={() => navigate("/")}>
            <span className="material-symbols-outlined">home</span>Projects
            </li>
            </Router.Link>
            <Router.Link to="/users">
            <li><span className='material-symbols-outlined'>people</span>Users</li>
            </Router.Link>
            
            
        </ul>
        </aside>
    )

}