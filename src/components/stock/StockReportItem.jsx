import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { ListGroupItem } from 'react-bootstrap';
import {Link} from 'react-router';

export default React.createClass({
    mixins : [PureRenderMixin],

    getStockReportItem() {
        return this.props.obj;
    },

    render() {
        let reportItem = this.getStockReportItem();
        let patient = reportItem.get('Patient');
        let drug = reportItem.get('Drug');

        return <div>
            <ListGroupItem>
                <p>Patient: <Link to={`patients/${patient.get('id')}`}>{patient.get('name')}</Link></p>
                <p>Drug: <Link to={`patients/${drug.get('id')}`}>{drug.get('name')}</Link></p>
                <p>Stock status: {reportItem.get('stock') + '/' + reportItem.get('required')}</p>
            </ListGroupItem>
        </div>;
    }
});
