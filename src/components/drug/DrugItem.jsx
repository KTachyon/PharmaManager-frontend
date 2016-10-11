import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import { ListGroupItem, Button, ButtonToolbar } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrug() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getDrug());
    },

    update() {
        return this.props.update(this.getDrug());
    },

    render() {
        let drug = this.getDrug();

        return <div>
            <div id="modalPlaceholder"></div>
            <ListGroupItem>
                <Link to={`drugs/${drug.get('id')}`}>{`${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`}</Link>
                <ButtonToolbar>
                    <Button onClick={this.update}>Update</Button>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </ButtonToolbar>
            </ListGroupItem>
        </div>;
    }
});
