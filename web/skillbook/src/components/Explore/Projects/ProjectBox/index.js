import React from 'react';
import './index.css';

class ProjectBox extends React.Component {
    state = {};

    render() {
        let techs = [];

        let k = 0;
        for (let t of this.props.project.common_tech) {
            techs.push(<div className='techItem' key={k}>{t}</div>)
            k++;
        }

        return (
            <div className='box'>
                <h2>{this.props.project.name}</h2>
                <span>{this.props.project.affinity}</span>
                <strong>Número de colaboradores:</strong> {this.props.project.members}
                <br/><br/>
                <strong>Tecnologías en común:</strong>
                <div className='techs'>{techs}</div>
            </div>
        );
    }
}

export default ProjectBox;
