import React from 'react';
import Icon from '../../../Icon';
import { ICONS } from "../../../../constants";
import './index.css';
import Skills from "../../../Sidebar/Skills";
import Badges from "../../../Sidebar/Badges";

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
];


class PeopleBox extends React.Component {
    state = {
        showInfo: false,
    };

    showInfo = () => {
        this.setState({ showInfo: true })
    };

    render() {
        let userInfo = '';
        if(this.state.showInfo) {
            userInfo = (
                <div className={'user-profile-container flex-vertical'}>
                    <div className={ 'user-img' } style={{ height: 300, width: 300}}>
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

        return (
            <div className='box'>
                {userInfo}
                <div className='pHeader'>
                    <a className='avatar' href={this.props.person.url}>
                        <img src={this.props.person.avatar} alt='user-avatar'></img>
                    </a>
                    <strong>{this.props.person.name}</strong>
                    <span>@{this.props.person.username}</span>
                    <div className={'eye-icon'} onClick={ this.showInfo }>
                        <Icon icon={ICONS.eye} size={30} color={ '#60b6ca' } />
                    </div>
                </div>
                <hr />
                <div className='status'>
                </div>
            </div>
        );
    }
}

export default PeopleBox;
