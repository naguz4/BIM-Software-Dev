import * as React from 'react';
import { Project } from '../src/class/Project';
import { useNavigate } from 'react-router-dom';
import { color } from 'three/examples/jsm/nodes/Nodes.js';

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
                    <bim-label
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#fff'
                    }}>{props.project.name}</bim-label>
                    <bim-label style={{color: '#fff'}}>{props.project.description}</bim-label>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                    <bim-label>Status</bim-label>
                    <bim-label style={{color: '#fff'}}>{props.project.status}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label>Role</bim-label>
                    <bim-label style={{color: '#fff'}}>{props.project.userRole}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label>Cost</bim-label>
                    <bim-label style={{color: '#fff'}}>{props.project.cost}</bim-label>
                </div>
                <div className="card-property">
                    <bim-label>Estimated Progress</bim-label>
                    <bim-label style={{color: '#fff'}}>{props.project.progress * 100}%</bim-label>
                </div>
            </div>
        </div>
    );
}