import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import { Button } from 'react-bootstrap';

export const AppView = React.createClass({
    mixins : [PureRenderMixin],

    render: function() {
        return <div>
            <p><Link to={'patients'}>Patients</Link></p>
            <p><Link to={'drugs'}>Drugs</Link></p>
            <p><Link to={'report'}>Stock Report</Link></p>
            <Button onClick={this.props.logout}>Logout</Button>
        </div>;
    }
});
