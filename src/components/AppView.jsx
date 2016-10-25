import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';
import RequestPromise from '../utils/RequestPromise';
import { AuthRequests } from '../RequestBuilder';
import { toastr } from 'react-redux-toastr';

import { LoginView } from './auth/LoginView';
import FullPageLoader from './loader/FullPageLoader';

import { Button } from 'react-bootstrap';

export const AppView = React.createClass({
    mixins : [PureRenderMixin],

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

    emailChanged : function(event) {
        this.setState({ email : event.currentTarget.value });
    },

    passwordChanged : function(event) {
        this.setState({ password : event.currentTarget.value });
    },

    render: function() {
        if (!this.state.checked) {
            return <FullPageLoader />;
        }

        if (!this.state.loggedIn) {
            return <LoginView login={this.login} />;
        }

        return <div>
            <p><Link to={'patients'}>Patients</Link></p>
            <p><Link to={'drugs'}>Drugs</Link></p>
            <p><Link to={'report'}>Stock Report</Link></p>
            <Button onClick={this.logout}>Logout</Button>
        </div>;
    }
});
