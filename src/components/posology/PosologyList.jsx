import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PosologyItem from './PosologyItem';

import FullPageLoader from '../loader/FullPageLoader';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPosologies: function() {
        return this.props.posologies;
    },

    render: function() {
        if (!this.getPosologies()) {
            return <FullPageLoader />;
        }

        let even = true;

        return <div>
            {this.getPosologies().map((posology) => {
                even = !even;

                return <PosologyItem
                    key={posology.get('id')}
                    obj={posology}
                    even={even}
                    update={this.props.update}
                    delete={this.props.delete}
                />;
            })}
        </div>;
    }
});
