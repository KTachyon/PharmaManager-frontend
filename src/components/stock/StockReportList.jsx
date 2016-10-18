import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import StockReportItem from './StockReportItem';

import { ListGroup } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getReport: function() {
        return this.props.report;
    },

    render: function() {
        if (!this.getReport()) {
            return <div>Loading...</div>;
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
