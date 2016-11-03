import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import itemStyle from '../../style/item.css';
import { Glyphicon } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrugStock() {
        return this.props.obj;
    },

    update() {
        return this.props.update(this.getDrugStock());
    },

    createDrugBox() {
        return this.props.createBox(this.getDrugStock());
    },

    getDrugDescriptor() {
        let drugStock = this.getDrugStock();
        let drug = drugStock.get('drug');

        return `${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) @ ${drugStock.get('unitCount')} units`;
    },

    render() {
        return <div className={`${itemStyle.item} ${this.props.even ? itemStyle.even : itemStyle.odd}`}>
            <div ref="placeholder"></div>
            <div className={itemStyle.leftBound}>
                <p>{this.getDrugDescriptor()}</p>
            </div>
            <div className={itemStyle.rightBound}>
                <Glyphicon glyph="pencil" className={itemStyle.itemBtn} onClick={this.update} />
                <Glyphicon glyph="plus" className={itemStyle.itemBtn} onClick={this.createDrugBox} />
            </div>
        </div>;
    }
});
