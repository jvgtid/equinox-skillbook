import React from 'react';
import PeopleBox from './PeopleBox';
import {makeRequest} from "../../../utils/request";
import './index.css';

class People extends React.Component {
    state = {};

    componentDidMount = () => {

        const onSuccess = (response) => {
            this.setState({projects: response})
        };

        makeRequest('generic_info_projects', [], onSuccess)
    }

    render() {
        let projects = [];

        for (let p of this.props.people) {
            projects.push(<PeopleBox person={p}></PeopleBox>)
        }

        return <div className='people'>{projects}</div>;
    }
}

export default People;
