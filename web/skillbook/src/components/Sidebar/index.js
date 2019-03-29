import React from 'react';
import Skills from './Skills';
import Badges from './Badges';
import './index.css';

const badges = [
    { type: 'general', color: '#005a74', icon: 'JS', title: 'Javascript Master - Mejor programador de Javascript' },
    { type: 'general', color: '#005a74', icon: 'Py', title: 'Python Master - Mejor programador de Python' },
    { type: 'expertise', color: '#80a696', icon: 'V', title: 'Veteran - Veterano de Telefónica' },
    { type: 'expertise', color: '#80a696', icon: 'IK', title: 'Issue Killer - Rapidez en la resolución de Issues' },
    { type: 'app', color: '#f05f55', icon: 'Ac', title: 'Active - Miembro muy activo de SkillBook' },
];

class Sidebar extends React.Component {
    state = {

    };
    skills = [];

    render() {
        for (let skill of Object.keys(this.props.user.languages)) {
            this.skills.push({
                name: skill,
                score: this.props.user.languages[skill]
            })
        }
        this.skills = this.skills.sort((a, b) => b.score - a.score);
        this.picture = `url("${this.props.user.picture}")`;

        console.log(this.picture)

        const width = window.innerWidth * 0.16 - 20;
        return (
            <div className={'sidebar-container flex-vertical'}>
                <div className={ 'user-img' } style={{ height: width }}>
                    <div className={'img'} style={{backgroundImage: this.picture}} />
                </div>
                <div className={'user-name'}>
                    { this.props.user.name.toUpperCase() }
                </div>
                <Skills data={ this.skills }/>
                <Badges data={ badges }/>
            </div>
        );
    }
}

export default Sidebar;
