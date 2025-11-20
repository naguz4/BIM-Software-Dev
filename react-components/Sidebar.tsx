import * as React from 'react';
import * as Router from "react-router-dom"
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { appIcons } from '../src/globals';

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
            <Router.Link to="/project">
            <bim-button icon={appIcons.USER} label="Users"></bim-button>
            </Router.Link>
            
            
        </ul>
        </aside>
    )

}