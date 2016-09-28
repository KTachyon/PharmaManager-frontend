import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import { ListGroupItem } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPatient() {
        return this.props.obj;
    },

    render() {
        return <ListGroupItem>
            <Link to={`patients/${this.getPatient().get('id')}`}>{this.getPatient().get('name')}</Link>
        </ListGroupItem>;
    }
});
