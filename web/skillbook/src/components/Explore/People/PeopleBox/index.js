import React from 'react';
import './index.css';

class PeopleBox extends React.Component {
    state = {};

    render() {
        return (
            <div className='box'>
                <div className='header'>
                    <a className='avatar' href={this.props.person.url}>
                        <img src={this.props.person.avatar}></img>
                    </a>
                    <strong>{this.props.person.name}</strong>
                    <span>@{this.props.person.username}</span>
                </div>
                <hr />
                <div className='status'>
                </div>
            </div>
        );
    }
}

export default PeopleBox;
