import React from 'react';
import ProjectBox from './ProjectBox';
import './index.css';

class Projects extends React.Component {
    state = {};

    render() {
        let projects = [];

        for (let p of this.props.projects) {
            projects.push(<ProjectBox project={p}></ProjectBox>)
        }

        return <div className='projects'>{projects}</div>;
    }
}

export default Projects;
