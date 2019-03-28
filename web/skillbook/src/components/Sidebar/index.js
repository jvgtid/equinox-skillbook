import React from 'react';
import Skills from './Skills';
import Badges from './Badges';
import './index.css';

const skills = [
    { name: 'Javascript', score: 9 },
    { name: 'Python', score: 7 },
    { name: 'React', score: 7 },
    { name: 'Django', score: 6 },
    { name: 'Scala', score: 2 },
    { name: 'Spark', score: 2 },
    { name: 'Elastic Search', score: 1 },
];
const badges = [
    { type: 'general', color: '#005a74', icon: 'JS', title: 'Mejor programador de Javascript' },
    { type: 'general', color: '#005a74', icon: 'Py', title: 'Mejor programador de Python' },
    { type: 'expertise', color: '#80a696', icon: 'V', title: 'Veterano de Telefonica' },
    { type: 'app', color: '#f05f55', icon: 'Ac', title: 'Miembro muy activo de SkillBook' },
];

class Sidebar extends React.Component {
    state = {

    };

    render() {
        const width = window.innerWidth * 0.16 - 20;
        return (
            <div className={'sidebar-container flex-vertical'}>
                <div className={ 'user-img' } style={{ height: width }}>
                    <div className={'img'}></div>
                </div>
                <div className={'user-name'}>
                    { 'MARIANO GONZALEZ SALAZAR' }
                </div>
                <Skills data={ skills }/>
                <Badges data={ badges }/>
            </div>
        );
    }
}

export default Sidebar;
