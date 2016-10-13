import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { ListGroupItem, Button, ButtonToolbar } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugBox() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getDrugBox());
    },

    update() {
        return this.props.update(this.getDrugBox());
    },

    render() {
        let drugBox = this.getDrugBox();
        let drug = drugBox.get('drug');

        let descriptor =`${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) (${drugBox.get('brand')}) - ${drugBox.get('unitCount')} units`;

        return <div>
            <div id="modalPlaceholder"></div>
            <ListGroupItem>
                {descriptor}
                <ButtonToolbar>
                    <Button onClick={this.update}>Update</Button>
                    <Button bsStyle="danger" onClick={this.delete}>Delete</Button>
                </ButtonToolbar>
            </ListGroupItem>
        </div>;
    }
});
