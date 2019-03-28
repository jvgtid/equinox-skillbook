import React from 'react';
import './index.css';

class Search extends React.Component {
    state = {value: ''};

    handleChange = (event) => {
        this.setState({ value: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        alert(this.state.value);
        this.props.setView('search');
    }

    render() {
        return (
            <div className='search'>
                <form onSubmit={this.handleSubmit}>
                ¿Qué tecnología quieres aprender? <input type='text' value={this.state.value} onChange={this.handleChange} />
                </form>
            </div>
        );
    }
}

export default Search;
