import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugStockList from './DrugStockList';

import { Panel, Col } from 'react-bootstrap';

export const DrugStockView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { drugStocks : this.props.drugStocks };
    },

    getDrugStocks() {
        return this.state.drugStocks;
    },

    render: function() {
        return <Panel>
            <div ref="placeholder"></div>
            <Col sm={12}>
                <DrugStockList drugStocks={this.getDrugStocks()} />
            </Col>
        </Panel>;
    }
});
