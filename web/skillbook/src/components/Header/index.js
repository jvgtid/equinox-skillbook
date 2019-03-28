import React from 'react';
import './index.css';

class Header extends React.Component {
    state = {
        homeStyle: {
            backgroundColor: '#6e6e6e',
        },
        exploreStyle: {
            backgroundColor: '#5e5e5e',
        }
    };

    changeView = (name) => {
        this.props.changeView(name);
        // ugly
        this.setState({
            homeStyle: {
                backgroundColor: name === 'home' ? '#6e6e6e' : '#5e5e5e',
            },
            exploreStyle: {
                backgroundColor: name === 'explore' ? '#6e6e6e' : '#5e5e5e',
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
