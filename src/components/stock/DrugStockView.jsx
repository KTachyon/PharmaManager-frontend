import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugStockList from './DrugStockList';

import { DrugStockUpdateForm } from './DrugStockUpdateForm';
import { DrugBoxForm } from '../boxes/DrugBoxForm';

import { Panel, Col } from 'react-bootstrap';

export const DrugStockView = React.createClass({
    mixins : [PureRenderMixin],

    getDrugStocks() {
        return this.props.drugStocks;
    },

    onStockUpdate() {
        this.props.onServerUpdate();
    },

    updateDrugStock(drugStock) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);
        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugStockUpdateForm
                close={closeModal}
                patientID={this.props.patientID}
                drugStock={drugStock}
                onUpdate={this.onStockUpdate}
            />,
            container
        );
    },

    createDrugBox(drugStock) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugBoxForm
                close={closeModal}
                patientID={this.props.patientID}
                drug={drugStock.get('drug')}
                onUpdate={this.onStockUpdate}
            />,
            container
        );
    },

    render: function() {
        return <Panel>
            <div ref="placeholder"></div>
            <Col sm={12}>
                <DrugStockList
                    drugStocks={this.getDrugStocks()}
                    update={this.updateDrugStock}
                    createBox={this.createDrugBox}
                />
            </Col>
        </Panel>;
    }
});
