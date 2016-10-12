import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import { Button } from 'react-bootstrap';
import DrugSearchForm from './drug/DrugSearchForm';

export default React.createClass({
    mixins : [PureRenderMixin],

    doTest() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);
        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugSearchForm close={closeModal} onSelect={this.selectedDrug}/>,
            container
        );
    },

    selectedDrug(item) {
        console.log(item.toJSON());
    },

    render() {
        return <div>
            <div ref="placeholder"></div>
            <Button onClick={this.doTest}>Click me!</Button>
        </div>;
    }
});
