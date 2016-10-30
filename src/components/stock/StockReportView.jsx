import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import RequestPromise from '../../utils/RequestPromise';
import { DrugStockRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { toastr } from 'react-redux-toastr';

import FullPageLoader from '../loader/FullPageLoader';

import StockReportItem from './StockReportItem';
import { ListGroup } from 'react-bootstrap';

export const StockReportView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return {};
    },

    getReport() {
        return this.state.report;
    },

    componentDidMount() {
        RequestPromise(DrugStockRequests().getReport()).then((body) => {
            this.setState({ report : fromJS(body) });
        }).catch((error) => {
            toastr.error('Report fetch failed: ' + error.message);
        });
    },

    render() {
        let report = this.getReport();

        if (!report) {
            return <FullPageLoader />;
        }

        return <ListGroup>
            {this.getReport().map(stockReportItem =>
                <StockReportItem
                    key={stockReportItem.get('PatientId') + '_' + stockReportItem.get('DrugId')}
                    obj={stockReportItem}
                />
            )}
        </ListGroup>;
    }
});
