import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugBoxList from './DrugBoxList';
import RequestPromise from '../../utils/RequestPromise';
import { DrugBoxRequests } from '../../RequestBuilder';
import { DrugBoxForm } from './DrugBoxForm';
import { toastr } from 'react-redux-toastr';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Panel, Col, Button } from 'react-bootstrap';

export const DrugBoxView = React.createClass({
    mixins : [PureRenderMixin],

    getDrugBoxes() {
        return this.props.drugBoxes;
    },

    createDrugBox() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugBoxForm patientID={this.props.patientID} close={closeModal} onUpdate={this.onDrugBoxUpdate} />,
            container
        );
    },

    onDrugBoxUpdate() {
        this.props.onServerUpdate();
    },

    deleteDrugBox(drugBox) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DestructiveOpConfirmation close={closeModal}
                title="Are you sure?"
                text="This operation is not reversible."
                //cancel={this.hideModal}
                proceed={() => { this.onDrugBoxDelete(drugBox); }}
            />,
            container
        );
    },

    onDrugBoxDelete(drugBox) {
        RequestPromise(DrugBoxRequests( this.props.patientID ).delete(drugBox.get('id'))).then(() => {
            this.props.onServerUpdate();
        }).catch((error) => {
            toastr.error('Delete failed: ' + error.message);
        });
    },

    updateDrugBox(drugBox) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);
        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugBoxForm
                close={closeModal}
                patientID={this.props.patientID}
                drugBox={drugBox}
                onUpdate={this.onDrugBoxUpdate}
                onDelete={this.onDrugBoxDelete}
            />,
            container
        );
    },

    render: function() {
        return <Panel>
            <div ref="placeholder"></div>
            <Col sm={4}>
                <Button onClick={this.createDrugBox}>Create DrugBox</Button>
            </Col>
            <Col sm={12}>
                <DrugBoxList drugBoxes={this.getDrugBoxes()} update={this.updateDrugBox} delete={this.deleteDrugBox} />
            </Col>
        </Panel>;
    }
});
