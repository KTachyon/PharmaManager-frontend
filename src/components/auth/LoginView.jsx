import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import loginStyle from '../../style/login.css';

export const LoginView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState : function() {
        return { email : '', password : '' };
    },

    emailChanged : function(event) {
        this.setState({ email : event.currentTarget.value });
    },

    passwordChanged : function(event) {
        this.setState({ password : event.currentTarget.value });
    },

    login : function() {
        return this.props.login(this.state.email, this.state.password);
    },

    render: function() {
        return <div className={loginStyle['login-page']}>
            <div className={loginStyle['login-form']}>
                <form>
                    <input type="text" placeholder="email" onChange={this.emailChanged}/>
                    <input type="password" placeholder="password" onChange={this.passwordChanged}/>
                    <button onClick={this.login}>login</button>
                </form>
            </div>
        </div>;
    }
});
