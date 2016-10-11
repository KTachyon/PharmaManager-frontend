import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugItem from './DrugItem';

import { ListGroup } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugs: function() {
        return this.props.drugs;
    },

    render: function() {
        if (!this.getDrugs()) {
            return <div>Loading...</div>;
        }

        return <ListGroup>
            {this.getDrugs().map(drug =>
                <DrugItem key={drug.get('id')} obj={drug} update={this.props.update} delete={this.props.delete} />
            )}
        </ListGroup>;
    }
});
