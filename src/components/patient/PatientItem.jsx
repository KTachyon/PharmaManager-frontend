import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Link} from 'react-router';

import itemStyle from '../../style/item.css';

import { Glyphicon } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPatient() {
        return this.props.obj;
    },

    delete() {
        return this.props.delete(this.getPatient());
    },

    update() {
        return this.props.update(this.getPatient());
    },

    render() {
        return <div className={`${itemStyle.item} ${this.props.even ? 'even' : 'odd'}`}>
            <div className={itemStyle.leftBound}>
                <p><Link to={`patients/${this.getPatient().get('id')}`}>{this.getPatient().get('name')}</Link></p>
            </div>
            <div className={itemStyle.rightBound}>
                <Glyphicon glyph="pencil" className={itemStyle.itemBtn} onClick={this.update} />
                <Glyphicon glyph="remove" className={`${itemStyle.itemBtn} ${itemStyle.danger}`} onClick={this.delete} />
            </div>
        </div>;
    }
});
