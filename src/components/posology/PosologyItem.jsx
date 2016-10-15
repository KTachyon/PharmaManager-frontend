import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import _ from 'lodash';

import { ListGroupItem, Button, ButtonToolbar } from 'react-bootstrap';

const timeMap = [
    'Breakfast',
    'Lunch',
    'Mid Afternoon',
    'Dinner'
];

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

        let descriptor = `Take ${posology.get('intakeQuantity')} ${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) @ `;

        let times = posology.get('intakeTimes').reduce(function(memo, value, position) {
            if (value) {
                memo = memo.length ? memo + ', ' : memo;
                memo = memo + timeMap[position];
            }

            return memo;
        }, '');

        descriptor = descriptor + '[ ' + times + ' ]';

        let finalDescriptor = posology.get('cancelled') ?
            <p style="color:red">{descriptor + '(CANCELLED)'}</p> :
            <p>{descriptor}</p>;

        return <div>
            <div id="modalPlaceholder"></div>
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
