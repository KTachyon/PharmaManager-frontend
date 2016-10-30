import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import itemStyle from '../../style/item.css';

import { ListGroupItem } from 'react-bootstrap';
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

        let even = true;

        return <div>
            <ListGroupItem>
                <p>Patient: <Link to={`patients/${patient.get('id')}`}>{patient.get('name')}</Link></p>
                {stocks.map(stock => {
                    even = !even;

                    let drug = stock.get('Drug');

                    return <div key={`${patient.get('id')}_${drug.get('id')}`} className={`${itemStyle.item} ${even ? 'even' : 'odd'}`}>
                        <div className={itemStyle.leftBound}>
                            <p><Link to={`drugs/${drug.get('id')}`}>{`${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`}</Link></p>
                        </div>
                        <div className={itemStyle.rightBound}>
                            <p style={{ color : 'red' }}>Stock status: {stock.get('stock') + '/' + stock.get('required')}</p>
                        </div>
                    </div>;
                })}
            </ListGroupItem>
        </div>;
    }
});
