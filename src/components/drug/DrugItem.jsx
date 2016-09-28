import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import { ListGroupItem } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrug() {
        return this.props.obj;
    },

    render() {
        return <ListGroupItem>
            <Link to={`drugs/${this.getDrug().get('id')}`}>{this.getDrug().get('name')}</Link>
        </ListGroupItem>;
    }
});
