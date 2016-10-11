import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import { ListGroupItem, Button, ButtonToolbar } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPatient() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getPatient());
    },

    update() {
        return this.props.update(this.getPatient());
    },

    render() {
        return <div>
            <div id="modalPlaceholder"></div>
            <ListGroupItem>
                <Link to={`patients/${this.getPatient().get('id')}`}>{this.getPatient().get('name')}</Link>
                <ButtonToolbar>
                    <Button onClick={this.update}>Update</Button>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </ButtonToolbar>
            </ListGroupItem>
        </div>;
    }
});
