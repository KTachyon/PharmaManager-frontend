import React from 'react';
import RequestPromise from '../utils/RequestPromise';
import { AuthRequests } from '../RequestBuilder';
import { toastr } from 'react-redux-toastr';

import { LoginView } from './auth/LoginView';
import FullPageLoader from './loader/FullPageLoader';

export default React.createClass({

    getInitialState : function() {
        return {};
    },

    componentDidMount : function() {
        return RequestPromise(AuthRequests().session()).then(() => {
            this.setState({ loggedIn : true, checked : true });
        }).catch(() => {
            this.setState({ loggedIn : false, checked : true });
        });
    },

    login : function(email, password) {
        return RequestPromise(AuthRequests().login(email, password)).then(() => {
            this.setState({ loggedIn : true, email : undefined, password : undefined });
        }).catch((error) => {
            toastr.error('Login failed: ' + error.message);
            this.setState({ loggedIn : false });
        });
    },

    logout : function() {
        return RequestPromise(AuthRequests().logout()).then(() => {
            this.setState({ loggedIn : false });
        }).catch((error) => {
            toastr.error('Logout failed: ' + error.message);
            this.setState({ loggedIn : true });
        });
    },

    render: function() {
        if (!this.state.checked) {
            return <FullPageLoader />;
        }

        if (!this.state.loggedIn) {
            return <LoginView login={this.login} />;
        }

        return React.cloneElement(this.props.children, { logout: this.logout });
    }
});
