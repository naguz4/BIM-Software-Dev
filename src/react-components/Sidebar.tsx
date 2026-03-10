import * as React from 'react';
import * as Router from "react-router-dom"
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { appIcons } from '../globals';

export function Sidebar () {
    const navigate = useNavigate();
    return (
        <aside id="sidebar">
        <img src="./assets/company-logo.svg" alt="Construction Company Logo" />
        <ul id="nav-buttons">
            <Router.Link to="/">
            <bim-button icon={appIcons.PROJECT} label="Projects">
            </bim-button>
            </Router.Link>
<<<<<<< HEAD:src/react-components/Sidebar.tsx
            <Router.Link to="/project">
            <bim-button icon={appIcons.USER} label="Users"></bim-button>
=======
            <Router.Link to="/users">
            <li><span className='material-symbols-outlined'>people</span>Users</li>
>>>>>>> main:react-components/Sidebar.tsx
            </Router.Link>
            
            
        </ul>
        </aside>
    )

}