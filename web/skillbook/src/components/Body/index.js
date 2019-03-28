import React from 'react';
import LoginBox from '../LoginBox';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Landing from '../Landing';
import Explore from '../Explore';
import './index.css';


class Body extends React.Component {
    state = {
        login: true,
        view: 'home'
    };

    changeView = (pageName) => {
        this.setState({ view: pageName })
        
    };

    enterSite = () => {
        this.setState({ login: false })
    };

    render() {
        let content = '';
        if (this.state.login) {
            content =  <LoginBox enterSite={ this.enterSite }/>;
        } else {
            content = [<Header changeView={ this.changeView } />];
            if (this.state.view === 'home') {
                content = content.concat([
                    <Landing />,
                    <Sidebar />
                ]);
            } else {
                content = content.concat([
                    <Explore />
                ]);
            }
        }

        return (
            <div className={'body-container'}>
                { content }
            </div>
        );
    }
}

export default Body;
