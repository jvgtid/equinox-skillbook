import React from 'react';
import './index.css';

class ProjectBox extends React.Component {
    state = {};

    intersection = (a, b) => {
        return a.filter(Set.prototype.has, new Set(b));
    }

    render() {
        let techs = [];
        let langs = [];

        let k = 0;
        for (let t of this.intersection(this.props.myTags, this.props.project.tags)) {
            techs.push(<div className='techItem' key={k}>{t}</div>)
            k++;
        }

        k = 0;
        for (let t of Object.keys(this.props.project.tags_languages)) {
            langs.push(<div className='techItem' key={k}>{t}</div>)
            k++;
        }

        return (
            <div className='box'>
                <h2>{this.props.project.name}</h2>
                <span>{Math.round((Math.random() * 100) % 100)}</span>
                <strong>Número de colaboradores:</strong> {this.props.project.contributors.length}
                <br/><br/>
                <strong>Lenguajes en común:</strong>
                <div className='techs'>{langs}</div>
                <br/><br/>
                <strong>Tags en común:</strong>
                <div className='techs'>{techs}</div>
            </div>
        );
    }
}

export default ProjectBox;
