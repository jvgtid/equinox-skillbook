import React from 'react';
import Icon from '../../Icon';
import { ICONS } from "../../../constants";
import './index.css';

const Badge = ({ type, color, value, title }) => {
    let bg = '';
    let size = 0;
    bg = ICONS.badge;
    size = 370;
    return (
        <div className={'badge'} title={title}>
            <Icon icon={bg} size={60} viewPort={size} color={ color } />
            <div className={'circle'} />
            <div className={'value'}>
                { value }
            </div>
        </div>
    );
};

class Badges extends React.Component {
    state = {

    };

    render() {
        const barges = this.props.data.map(el => (
            <Badge type={ el.type } color={ el.color } value={el.icon} title={el.title} />
        ));
        return (
            <div className={'badges-container'}>
                <div className={'badges-title'}>
                    { 'Tus insignias' }
                </div>
                <div className={ 'badges-content flex-horizontal' }>
                    { barges }
                </div>
            </div>
        );
    }
}

export default Badges;
