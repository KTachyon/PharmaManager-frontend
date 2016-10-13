import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugBoxItem from './DrugBoxItem';

import { ListGroup } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugBoxes: function() {
        return this.props.drugBoxes;
    },

    render: function() {
        if (!this.getDrugBoxes()) {
            return <div>Loading...</div>;
        }

        return <ListGroup>
            {this.getDrugBoxes().map(drugBox =>
                <DrugBoxItem key={drugBox.get('id')} obj={drugBox} update={this.props.update} delete={this.props.delete} />
            )}
        </ListGroup>;
    }
});
