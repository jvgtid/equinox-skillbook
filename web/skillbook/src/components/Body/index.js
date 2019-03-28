import React from 'react';
import LoginBox from '../LoginBox';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Landing from '../Landing';
import './index.css';


class Body extends React.Component {
    state = {
        login: true,
    };

    enterSite = () => {
        this.setState({ login: false })
    };

    render() {
        let content = '';
        if (this.state.login) {
            content =  <LoginBox enterSite={ this.enterSite }/>;
        } else {
            content = [
                <Header />,
                <Sidebar />,
                <Landing />
            ];
        }

        return (
            <div className={'body-container'}>
                { content }
            </div>
        );
    }
}

export default Body;
