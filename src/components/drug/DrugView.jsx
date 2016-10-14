import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export const DrugView = React.createClass({
    mixins : [PureRenderMixin],

    getDrug() {
        return this.props.drugs.find((object) => { return object.get('id') == this.props.params.drug_id; });
    },

    render() {
        return <div>
            <h1>{this.getDrug().get('name')}</h1>
            <p>This is the drug view!</p>
        </div>;
    }
});
