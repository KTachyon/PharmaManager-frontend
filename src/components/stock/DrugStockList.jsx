import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugStockItem from './DrugStockItem';

import { ListGroup } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugStocks: function() {
        return this.props.drugStocks;
    },

    render: function() {
        if (!this.getDrugStocks()) {
            return <div>Loading...</div>;
        }

        return <ListGroup>
            {this.getDrugStocks().map(drugStock =>
                <DrugStockItem key={drugStock.get('id')} obj={drugStock} update={this.props.update} />
            )}
        </ListGroup>;
    }
});
