import React from 'react';
import Projects from './Projects';
import People from './People';
import Search from './Search';
import {makeRequest} from "../../utils/request";
import './index.css';

class Explore extends React.Component {
    state = {
        people: [
            {
                name: 'Hugo Ferrando Seage',
                username: 'hugo19941994',
                url: 'https://github.com/hugo19941994',
                avatar: 'https://avatars3.githubusercontent.com/u/6431131?v=4&s=88'
            },
            {
                name: 'Mariano Gonzalez Salazar',
                username: 'mgs95',
                url: 'https://github.com/mgs95',
                avatar: 'https://avatars2.githubusercontent.com/u/23691885?s=88&v=4'
            },
            {
                name: 'Javier Villar Gil',
                username: 'jvgtid',
                url: 'https://github.com/jvgtid',
                avatar: 'https://avatars1.githubusercontent.com/u/45091545?s=88&v=4'
            }
        ],
        view: 'projects',
        projects : ""
    };

    componentDidMount = () => {

        const onSuccess = (response) => {
            this.setState({projects: response})
        };

        makeRequest('generic_info_projects', [], onSuccess)
    }

    setView = (name) => {
        this.setState({'view': name});
    }

    render() {
        let view = '';
        let button = (
            <div className={'explore-buttons flex-horizontal'}>
                <button onClick={() => {
                    this.setView('projects')
                }} className={this.state.view === 'projects' ? 'active' : ''}>
                    Proyectos
                </button>
                <button onClick={() => {
                    this.setView('people')
                }} className={this.state.view === 'people' ? 'active' : ''}>
                    Personas
                </button>
            </div>
        );

        if (this.state.view === 'projects') {
            view = [
                <br />,
                <strong>Por tus habilidades te recomendamos</strong>,
                <Projects myProjects={this.props.projects} projects={this.state.projects} tag={null}></Projects>,
                <strong>Por tu interés en machine learning te recomendamos</strong>,
                <Projects myProjects={this.props.projects} projects={this.state.projects} tag={'machine learning'}></Projects>,
            ];
        } else if (this.state.view === 'people') {
            view = [<br/>, <strong>Por tus habilidades te recomendamos</strong>, <People people={this.state.people}></People>,
                <br/>, <strong>Por tus conexiones te recomendamos</strong>,
                <People people={this.state.people}></People>];
        } else if (this.state.view === 'search') {
            view = <People people={this.state.people}></People>;
            button = null;
        }

        return (
            <div>
                <Search setView={this.setView}></Search>
                {button}
                {view}
            </div>
        );
    }
}

export default Explore;
