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

    render() {
        let drugStock = this.getDrugStock();
        let drug = drugStock.get('drug');

        let descriptor = `${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')}) @ ${drugStock.get('unitCount')} units`;

        return <div className={`${itemStyle.item} ${this.props.even ? itemStyle.even : itemStyle.odd}`}>
            <div className={itemStyle.leftBound}>
                <p>{descriptor}</p>
            </div>
            <div className={itemStyle.rightBound}>
                <Glyphicon glyph="pencil" className={itemStyle.itemBtn} onClick={this.update} />
            </div>
        </div>;
    }
});
