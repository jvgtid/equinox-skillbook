import React from 'react';
import PeopleBox from './PeopleBox';
import './index.css';

class People extends React.Component {
    state = {};

    render() {
        let projects = [];

        for (let p of this.props.people) {
            projects.push(<PeopleBox person={p}></PeopleBox>)
        }

        return <div className='people'>{projects}</div>;
    }
}

export default People;
