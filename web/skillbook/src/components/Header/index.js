import React from 'react';
import './index.css';

class Header extends React.Component {
    state = {

    };

    render() {
        return (
            <div className={ 'header-container flex-horizontal'}>
                <div className={'header-button'}>
                    Inicio
                </div>
                <div className={'header-button'}>
                    Explorar
                </div>
            </div>
        );
    }
}

export default Header;
