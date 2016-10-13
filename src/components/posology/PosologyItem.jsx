import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { ListGroupItem, Button, ButtonToolbar } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPosology() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getPosology());
    },

    update() {
        return this.props.update(this.getPosology());
    },

    render() {
        let posology = this.getPosology();
        let drug = posology.get('drug');

        return <div>
            <div id="modalPlaceholder"></div>
            <ListGroupItem>
                {`Take ${posology.get('intakeQuantity')} ${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) every ${posology.get('intakeInterval')} hours`}
                <ButtonToolbar>
                    <Button onClick={this.update}>Update</Button>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </ButtonToolbar>
            </ListGroupItem>
        </div>;
    }
});
