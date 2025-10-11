import * as React from 'react';
import { Project } from '../src/class/Project';
import { useNavigate } from 'react-router-dom';
import { appIcons } from '../src/globals';

interface Props {
    project: Project;
}

export function ProjectCard(props: Props) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Navigate to the project detail page with the project ID
        navigate(`/project/${props.project.id}`, { state: { project: props.project } });
    };

    return (
        <div className="project-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="card-header">
                <p className="initials color-1">HC</p>
                <div>
                    <bim-label style={{color:"white", fontSize:"1.2rem"}}>{props.project.name}</bim-label>
                    <bim-label>{props.project.description}</bim-label>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                    <bim-label icon={appIcons.STATUS} style={{ color: 'beige' }}>Status</bim-label>
                    <bim-label>{props.project.status}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label style={{ color: 'beige' }}>Role</bim-label>
                    <bim-label>{props.project.userRole}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label style={{ color: 'beige' }}>Cost</bim-label>
                    <bim-label>{props.project.cost}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label style={{ color: 'beige' }}>Estimated Progress</bim-label>
                    <bim-label>{props.project.progress * 100}%</bim-label>
                </div>
            </div>
        </div>
    );
}