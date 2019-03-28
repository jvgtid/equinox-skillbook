import React from 'react';
import './index.css';

class Sidebar extends React.Component {
    state = {

    };

    render() {
        const width = window.innerWidth * 0.16;
        return (
            <div className={'sidebar-container flex-vertical'}>
                <div className={ 'user-img' } style={{ height: width }}>
                    <div className={'img'}></div>
                </div>
                <div className={'user-name'}>
                    { 'MARIANO GONZALEZ SALAZAR' }
                </div>

            </div>
        );
    }
}

export default Sidebar;
