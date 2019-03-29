import React from 'react';
import {makeRequest} from "../../utils/request";
import './index.css';

class LoginBox extends React.Component {
    state = {
        username: '',
        password: ''
    };


    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleSubmit = e => {
        e.preventDefault();

        const onSuccess = (response) => {
            console.log('IT WORKS', response);
            this.props.enterSite(response);
        };

        makeRequest('user_info', { user_mail: this.state.username }, onSuccess);
    };

    render() {
        const { username, password } = this.state;

        return (
            <div className={'login-container'}>
                <div className={'title'}>
                    {'SKILLBOOK'}
                </div>
                <div className="col-md-6 col-md-offset-3">
                    <form name="form" onSubmit={this.handleSubmit}>
                        <div className={'form-group flex-vertical'}>
                            <label htmlFor="username">E-mail</label>
                            <input type="text" className="form-control" name="username"
                                   value={username} onChange={this.handleChange}/>
                        </div>
                        <div className={'form-group flex-vertical'}>
                            <label htmlFor="password">Contraseña</label>
                            <input type="password" className="form-control" name="password"
                                   value={password} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary">Iniciar sesión</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginBox;
