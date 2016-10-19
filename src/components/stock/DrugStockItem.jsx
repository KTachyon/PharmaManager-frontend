import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { ListGroupItem, ButtonToolbar, Button } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugStock() {
        return this.props.obj;
    },

    update() {
        return this.props.update(this.getDrugStock());
    },

    render() {
        let drugStock = this.getDrugStock();
        let drug = drugStock.get('drug');

        let descriptor = `${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) @ ${drugStock.get('unitCount')} units`;

        return <div>
            <div id="modalPlaceholder"></div>
            <ListGroupItem>
                {descriptor}
                <ButtonToolbar>
                    <Button onClick={this.update}>Update stock</Button>
                </ButtonToolbar>
            </ListGroupItem>
        </div>;
    }
});
