import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import RequestPromise from '../../utils/RequestPromise';
import { DrugStockRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import StockReportList from './StockReportList';

import FullPageLoader from '../loader/FullPageLoader';

import { Panel } from 'react-bootstrap';

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
        });
    },

    render() {
        let report = this.getReport();

        if (!report) {
            return <FullPageLoader />;
        }

        return <Panel>
            <StockReportList report={report} />
        </Panel>;
    }
});
