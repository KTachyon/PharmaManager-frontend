import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugBoxItem from './DrugBoxItem';

import FullPageLoader from '../loader/FullPageLoader';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugBoxes: function() {
        return this.props.drugBoxes;
    },

    render: function() {
        if (!this.getDrugBoxes()) {
            return <FullPageLoader />;
        }

        let even = true;

        return <div>
            {this.getDrugBoxes().map((drugBox) => {
                even = !even;

                return <DrugBoxItem
                    key={drugBox.get('id')}
                    obj={drugBox}
                    even={even}
                    update={this.props.update}
                    delete={this.props.delete}
                />;
            })}
        </div>;
    }
});
