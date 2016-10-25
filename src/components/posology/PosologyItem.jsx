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

        let descriptor = `Take ${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`;

        let finalDescriptor = posology.get('cancelled') ?
            <p style="color:red">{descriptor + '(CANCELLED)'}</p> :
            <p>{descriptor}</p>;

        return <div>
            <ListGroupItem>
                {finalDescriptor}
                <ButtonToolbar>
                    <Button onClick={this.update}>Update</Button>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </ButtonToolbar>
            </ListGroupItem>
        </div>;
    }
});
