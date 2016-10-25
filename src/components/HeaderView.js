import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import headerStyle from '../style/header.css';

export const HeaderView = React.createClass({
    mixins : [PureRenderMixin],

    render: function() {
        var path = this.props.route.path;

        return <div>
            <div className={headerStyle.header}>
                <ul>
                    <li><Link className={path === 'patients' ? headerStyle.active : undefined} to={'patients'}>Patients</Link></li>
                    <li><Link className={path === 'drugs' ? headerStyle.active : undefined} to={'drugs'}>Drugs</Link></li>
                    <li><Link className={path === 'report' ? headerStyle.active : undefined} to={'report'}>Stock Report</Link></li>
                    <li><a onClick={this.props.logout}>Logout</a></li>
                </ul>
            </div>
            <div className={headerStyle.contentPadded}>{this.props.content}</div>
        </div>;
    }
});
