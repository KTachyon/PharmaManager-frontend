import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PosologyItem from './PosologyItem';

import { ListGroup } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPosologies: function() {
        return this.props.posologies;
    },

    render: function() {
        if (!this.getPosologies()) {
            return <div>Loading...</div>;
        }

        return <ListGroup>
            {this.getPosologies().map(posology =>
                <PosologyItem key={posology.get('id')} obj={posology} update={this.props.update} delete={this.props.delete} />
            )}
        </ListGroup>;
    }
});
