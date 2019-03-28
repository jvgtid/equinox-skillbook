import React from 'react';
import Projects from './Projects';
import People from './People';
import Search from './Search';
import './index.css';

class Explore extends React.Component {
    state = {
        projects: [
            {
                name: 'Whatever',
                affinity: 0,
                members: 10,
                url: 'https://github.com/tomekw/whatever',
                common_tech: ['JS']
            },
            {
                name: 'Whatever2',
                affinity: 90,
                members: 5,
                url: 'https://github.com/tomekw/whatever',
                common_tech: ['JS', 'Python']
            }
        ],
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
        view: 'projects'
    };

    componentDidMount = () => {
        // TODO: Fetch API
    }

    setView = (name) => {
        this.setState({'view': name});
    }

    render() {
        let view = '';
        let button = <div><button onClick={() => { this.setView('projects') }} >Projects</button> <button onClick={() => { this.setView('people') }}>People</button></div>;

        if (this.state.view === 'projects') {
            view = <Projects projects={this.state.projects}></Projects>;
        } else if (this.state.view === 'people') {
            view = <People people={this.state.people}></People>;
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
