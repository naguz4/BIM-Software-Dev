import * as React from 'react';
import { Project } from '../class/Project';
import { useNavigate } from 'react-router-dom';
import { appIcons } from '../globals';

interface Props {
    project: Project;
}

export function ProjectCard(props: Props) {
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Navigate to the project detail page with the project ID
        navigate(`/project/${props.project.id}`, { state: { project: props.project } });
    };

    const getInitials = (name: string) => {
        const parts = name.split(' ').filter((part) => part.trim().length > 0);
        if (parts.length === 0) return '';
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('');
    };

    const initialsColors = [
        '#FF5733',
        '#33FF57',
        '#3357FF',
        '#FF33A8',
        '#FFC733',
        '#8A33FF',
        '#33FFF7',
        '#FF8A33',
    ];

    const initialsBgColor = React.useMemo(
        () => initialsColors[Math.floor(Math.random() * initialsColors.length)],
        []
    );

    return (
        <div className="project-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className="card-header">
                <p className="initials" style={{ backgroundColor: initialsBgColor }}>
                    {getInitials(props.project.name)}
                </p>
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