import React from 'react';
import ProjectBox from './ProjectBox';
import './index.css';

class Projects extends React.Component {
    state = {
    };
    
    intersection = (a, b) => {
        return a.filter(Set.prototype.has, new Set(b));
    }

    render() {
        if (this.props.projects === null) {
            return <div></div>;
        }

        let myTags = []
        if (this.props.tag) {
            myTags = [this.props.tag];
        } else {
            // Get tags from my projects
            console.log(this.state.projects)

            for (let myProject of this.props.myProjects) {
                for (let project of Object.values(this.props.projects)) {
                    if (project.name === myProject || project.description === myProject) {
                        for (let tag in project.tags) {
                            myTags.push(tag)
                        }
                    }
                }
            }
        }

        // filter projects which contains my tags
        let projects = [];
        for (let project of Object.values(this.props.projects)) {
                projects.push(<ProjectBox project={project} myTags={myTags}></ProjectBox>)
        }


        return <div className='projects'>{projects}</div>;
    }
}

export default Projects;
