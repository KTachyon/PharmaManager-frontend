import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import itemStyle from '../../style/item.css';

export default React.createClass({
    mixins : [PureRenderMixin],

    getDrug() {
        return this.props.obj;
    },

    select() {
        return this.props.onSelect(this.getDrug());
    },

    render() {
        let drug = this.getDrug();

        return <div onClick={this.select} className={`${itemStyle.item} ${this.props.even ? itemStyle.even : itemStyle.odd}`}>
            <div className={itemStyle.leftBound}>
                <p>{`${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})`}</p>
            </div>
        </div>;
    }
});
