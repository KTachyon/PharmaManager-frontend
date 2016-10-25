import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { ListGroupItem, Panel } from 'react-bootstrap';
import { Link } from 'react-router';

export default React.createClass({
    mixins : [PureRenderMixin],

    getStockReportItem() {
        return this.props.obj;
    },

    render() {
        let reportItem = this.getStockReportItem();
        let patient = reportItem.get('Patient');
        let stocks = reportItem.get('stocks');

        return <div>
            <ListGroupItem>
                <p>Patient: <Link to={`patients/${patient.get('id')}`}>{patient.get('name')}</Link></p>
                {stocks.map(stock => {
                        return <Panel key={`${patient.get('id')}_${stock.get('Drug')}`}>
                        <p>Drug: <Link to={`patients/${stock.get('Drug').get('id')}`}>{stock.get('Drug').get('name')}</Link></p>
                        <p>Stock status: {stock.get('stock') + '/' + stock.get('required')}</p>
                    </Panel>;
                })}
            </ListGroupItem>
        </div>;
    }
});
