import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugStockItem from './DrugStockItem';

import FullPageLoader from '../loader/FullPageLoader';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugStocks: function() {
        return this.props.drugStocks;
    },

    render: function() {
        if (!this.getDrugStocks()) {
            return <FullPageLoader />;
        }

        let even = true;

        return <div>
            {this.getDrugStocks().map((drugStock) => {
                even = !even;

                return <DrugStockItem
                    key={drugStock.get('id')}
                    obj={drugStock}
                    even={even}
                    update={this.props.update}
                    createBox={this.props.createBox}
                />;
            })}
        </div>;
    }
});
