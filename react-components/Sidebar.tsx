import * as React from 'react';

export function Sidebar () {
    return (
        <aside id="sidebar">
        <img src="./assets/company-logo.svg" alt="Construction Company Logo" />
        <ul id="nav-buttons">
            <li id="ProjectsBtn">
            <span className="material-symbols-outlined">home</span>Projects
            </li>
            <li>Users</li>
        </ul>
        </aside>
    )

}