import React from 'react';
import Icon from '../../../Icon';
import { ICONS } from "../../../../constants";
import './index.css';

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
            userInfo = <div>AAAAAAAAAAAAAAAAAAAAAAA</div>;
        }

        return (
            <div className='box'>
                {userInfo}
                <div className='pHeader'>
                    <a className='avatar' href={this.props.person.url}>
                        <img src={this.props.person.avatar}></img>
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
