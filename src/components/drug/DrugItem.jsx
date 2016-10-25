import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import itemStyle from '../../style/item.css';

import { Glyphicon } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrug() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getDrug());
    },

    update() {
        return this.props.update(this.getDrug());
    },

    render() {
        let drug = this.getDrug();

        return <div className={`${itemStyle.item} ${this.props.even ? 'even' : 'odd'}`}>
            <div className={itemStyle.leftBound}>
                <p><Link to={`drugs/${drug.get('id')}`}>{`${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`}</Link></p>
            </div>
            <div className={itemStyle.rightBound}>
                <Glyphicon glyph="pencil" className={itemStyle.itemBtn} onClick={this.update} />
                <Glyphicon glyph="remove" className={`${itemStyle.itemBtn} ${itemStyle.danger}`} onClick={this.delete} />
            </div>
        </div>;
    }
});
