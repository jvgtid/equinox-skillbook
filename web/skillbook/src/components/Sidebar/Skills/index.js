import React from 'react';
import Icon from '../../Icon';
import { ICONS } from "../../../constants";
import './index.css';

const Skill = ({ name, score }) => {
    const width = window.innerWidth * 0.16 - 20 - 20;
    const starWidth = width / 11;

    const stars = [];
    for (let i = 0; i < 10; i++) {
        const icon = i < score ? ICONS.star : ICONS.star_border;
        stars.push(
            <Icon icon={ icon } color={ '#63ace5' } size={ starWidth } />
        );
    }

    return (
        <div className={'skill'}>
            <div>
                { name }
            </div>
            <div>
                { stars }
            </div>
        </div>
    );
};

class Skills extends React.Component {
    state = {

    };

    render() {
        const skills = this.props.data.map(el => (
            <Skill name={ el.name } score={ el.score }/>
        ));
        return (
            <div className={'skills-container'}>
                <div className={'skills-title'}>
                    { 'Tus habilidades' }
                </div>
                <div className={ 'skills-content flex-vertical' }>
                    { skills }
                </div>
            </div>
        );
    }
}

export default Skills;
