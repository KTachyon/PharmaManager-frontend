import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugItem from './DrugItem';

import FullPageLoader from '../loader/FullPageLoader';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugs: function() {
        return this.props.drugs;
    },

    render: function() {
        if (!this.getDrugs()) {
            return <FullPageLoader />;
        }

        let even = true;

        return <div>
            {this.getDrugs().map((drug) => {
                even = !even;

                return <DrugItem
                    key={drug.get('id')}
                    obj={drug}
                    even={even}
                    update={this.props.update}
                    delete={this.props.delete} />;
            })}
        </div>;
    }
});
