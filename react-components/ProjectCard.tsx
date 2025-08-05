import * as React from 'react';
import { Project } from '../src/class/Project';
import { useNavigate } from 'react-router-dom';

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
                    <h5>{props.project.name}</h5>
                    <p>{props.project.description}</p>
                </div>
            </div>
            <div className="card-content">
                <div className="card-property">
                    <p style={{ color: 'beige' }}>Status</p>
                    <p>{props.project.status}</p>
                </div>
                <div className="card-property">
                    <p style={{ color: 'beige' }}>Role</p>
                    <p>{props.project.userRole}</p>
                </div>
                <div className="card-property">
                    <p style={{ color: 'beige' }}>Cost</p>
                    <p>{props.project.cost}</p>
                </div>
                <div className="card-property">
                    <p style={{ color: 'beige' }}>Estimated Progress</p>
                    <p>{props.project.progress * 100}%</p>
                </div>
            </div>
        </div>
    );
}