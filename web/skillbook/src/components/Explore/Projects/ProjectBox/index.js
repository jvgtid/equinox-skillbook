import React from 'react';
import './index.css';

class ProjectBox extends React.Component {
    state = {};

    render() {
        let techs = [];

        for (let t of this.props.project.common_tech) {
            techs.push(<div className='techItem'>{t}</div>)
        }

        return (
            <div className='box'>
                <h2>{this.props.project.name}</h2>
                <span>{this.props.project.affinity}</span>
                <strong>Numero de colaboradores:</strong> {this.props.project.members}
                <br/><br/>
                <strong>Tecnologias en comun:</strong>
                <div className='techs'>{techs}</div>
            </div>
        );
    }
}

export default ProjectBox;
