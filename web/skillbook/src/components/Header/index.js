import React from 'react';
import './index.css';

class Header extends React.Component {
    state = {
        homeStyle: {
            backgroundColor: '#6f7571',
        },
        exploreStyle: {
            backgroundColor: '#606d69',
        }
    };

    changeView = (name) => {
        this.props.changeView(name);
        // ugly
        this.setState({
            homeStyle: {
                backgroundColor: name === 'home' ? '#6f7571' : '#606d69',
            },
            exploreStyle: {
                backgroundColor: name === 'explore' ? '#6f7571' : '#606d69',
            }
        })
    }

    render() {
        return (
            <div className={'header-container flex-horizontal'}>
                <div id='home' className={'header-button'} style={this.state.homeStyle} onClick={() => {return this.changeView('home')}}>
                    Inicio
                </div>
                <div id='explore' className={'header-button'} style={this.state.exploreStyle} onClick={() => {return this.changeView('explore')}}>
                    Explorar
                </div>
            </div>
        );
    }
}

export default Header;
