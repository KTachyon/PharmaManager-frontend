import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { ListGroupItem } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrug() {
        return this.props.obj;
    },

    select() {
        console.log(this.props);

        return this.props.onSelect(this.getDrug());
    },

    render() {
        let drug = this.getDrug();

        return <div onClick={this.select}>
            <ListGroupItem>
                {`${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`}
            </ListGroupItem>
        </div>;
    }
});
