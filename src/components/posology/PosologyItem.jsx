import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import itemStyle from '../../style/item.css';

import { Glyphicon } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPosology() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getPosology());
    },

    update() {
        return this.props.update(this.getPosology());
    },

    render() {
        let posology = this.getPosology();
        let drug = posology.get('drug');

        let descriptor = `Take ${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`;

        let finalDescriptor = posology.get('cancelled') ?
            <p style="color:red">{descriptor + '(CANCELLED)'}</p> :
            <p>{descriptor}</p>;

        return <div className={`${itemStyle.item} ${this.props.even ? itemStyle.even : itemStyle.odd}`}>
            <div className={itemStyle.leftBound}>
                {finalDescriptor}
            </div>
            <div className={itemStyle.rightBound}>
                <Glyphicon glyph="pencil" className={itemStyle.itemBtn} onClick={this.update} />
                <Glyphicon glyph="remove" className={`${itemStyle.itemBtn} ${itemStyle.danger}`} onClick={this.delete} />
            </div>
        </div>;
    }
});
