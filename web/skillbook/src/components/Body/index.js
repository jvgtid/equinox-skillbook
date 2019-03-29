import React from 'react';
import LoginBox from '../LoginBox';
import Header from '../Header';
import Sidebar from '../Sidebar';
import Landing from '../Landing';
import Explore from '../Explore';
import BG from './bg.jpg';
import './index.css';


class Body extends React.Component {
    state = {
        login: true,
        view: 'home'
    };

    changeView = (pageName) => {
        this.setState({ view: pageName })
        
    };

    enterSite = (res) => {
        this.setState({ login: false, user: res.user, top_langs: res.languages, top_projects: res.projects })
    };

    render() {
        let content = '';
        const style = {};
        if (this.state.login) {
            content =  <LoginBox enterSite={ this.enterSite }/>;
            style['backgroundImage'] = `url("./${BG}")`;
        } else {
            content = [<Header changeView={ this.changeView } />];
            if (this.state.view === 'home') {
                content = content.concat([
                    <Sidebar user={this.state.user} />,
                    <Landing top_langs={this.state.top_langs} top_projects={this.state.top_projects} />
                ]);
            } else {
                content = content.concat([
                    <Explore projects={this.state.user.projects} languages={this.state.user.languages} />
                ]);
            }
        }

        return (
            <div className={'body-container'} style={style}>
                { content }
            </div>
        );
    }
}

export default Body;
