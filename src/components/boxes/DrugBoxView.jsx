import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugBoxList from './DrugBoxList';
import RequestPromise from '../../utils/RequestPromise';
import { DrugBoxRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { DrugBoxForm } from './DrugBoxForm';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Panel, Col, Button } from 'react-bootstrap';

export const DrugBoxView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { drugBoxes : this.props.drugBoxes };
    },

    getDrugBoxes() {
        return this.state.drugBoxes;
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

    onDrugBoxUpdate(drugBox) {
        drugBox = fromJS(drugBox);

        let existingDrugBox = this.getDrugBoxes().find((object) => {
            return object.get('id') === drugBox.get('id');
        });

        if (existingDrugBox) {
            let newDrugBoxes = this.getDrugBoxes().update(
                this.getDrugBoxes().findIndex((item) => { return item.get('id') === drugBox.get('id'); }),
                () => { return drugBox; }
            );

            this.setState({ drugBoxes : newDrugBoxes });
        } else {
            this.setState({ drugBoxes : this.getDrugBoxes().push(drugBox) });
        }
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
            this.setState({ drugBoxes : this.getDrugBoxes().filter(p => p.get('id') !== drugBox.get('id')) });
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
