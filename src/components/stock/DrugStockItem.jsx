import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { ListGroupItem } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugStock() {
        return this.props.obj;
    },

    render() {
        let drugStock = this.getDrugStock();
        let drug = drugStock.get('drug');

        let descriptor = `${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) @ ${drugStock.get('unitCount')} units`;

        return <div>
            <div id="modalPlaceholder"></div>
            <ListGroupItem>
                {descriptor}
            </ListGroupItem>
        </div>;
    }
});
