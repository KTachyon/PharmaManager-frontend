import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugStockList from './DrugStockList';
import RequestPromise from '../../utils/RequestPromise';
import { DrugStockRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';

import { Panel, Col } from 'react-bootstrap';

export const DrugStockView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { drugStocks : fromJS([]) };
    },

    componentDidMount() {
        RequestPromise(DrugStockRequests( this.props.patientID ).getAll()).then((body) => {
            this.setState({ drugStocks : fromJS(body) });
        });
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
