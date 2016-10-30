import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import { DrugStockRequests } from '../RequestBuilder';
import RequestPromise from '../utils/RequestPromise';
import { toastr } from 'react-redux-toastr';

import { Button } from 'react-bootstrap';
import FullPageLoader from './loader/FullPageLoader';

export const AppView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return {};
    },

    weeklyStockUpdate : function() {
        this.setState({ weeklyStockUpdating : true });

        return RequestPromise(DrugStockRequests().weeklyStockUpdate()).then(() => {
            this.setState({ weeklyStockUpdating : false });
        }).catch((error) => {
            toastr.error('Weekly stock update failed: ' + error.message);
            this.setState({ weeklyStockUpdating : false });
        });
    },

    render: function() {
        if (this.state.weeklyStockUpdating) {
            return <FullPageLoader />;
        }

        return <div>
            <p><Link to={'patients'}>Patients</Link></p>
            <p><Link to={'drugs'}>Drugs</Link></p>
            <p><Link to={'report'}>Stock Report</Link></p>
            <Button onClick={this.weeklyStockUpdate}>Weekly Stock Update</Button>
            <Button onClick={this.props.logout}>Logout</Button>
        </div>;
    }
});
