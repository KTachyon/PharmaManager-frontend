import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import itemStyle from '../../style/item.css';

import { Glyphicon } from 'react-bootstrap';

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

        return <div className={`${itemStyle.item} ${this.props.even ? 'even' : 'odd'}`}>
            <div className={itemStyle.leftBound}>
                <p>{descriptor}</p>
            </div>
            <div className={itemStyle.rightBound}>
                <Glyphicon glyph="pencil" className={itemStyle.itemBtn} onClick={this.update} />
                <Glyphicon glyph="remove" className={`${itemStyle.itemBtn} ${itemStyle.danger}`} onClick={this.delete} />
            </div>
        </div>;
    }
});
