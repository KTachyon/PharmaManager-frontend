import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { generateUUID } from '../../utils/Generator';
import { DrugBoxRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';
import DrugSearchForm from '../drug/DrugSearchForm';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal } from 'react-bootstrap';

export const DrugBoxForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        let drugBox = this.props.drugBox || fromJS({ properties : [] });

        if (!drugBox.get('properties')) {
            drugBox = drugBox.set('properties', []);
        }

        return {
            selfShow : true,
            drugBox : drugBox,
            drug : drugBox.get('drug')
        };
    },

    updateDrugBox(newDrugBox) {
        this.setState({ drugBox : newDrugBox });
    },

    getDrugBox() {
        return this.state.drugBox;
    },

    addProperty() {
        let drugBox = this.getDrugBox();

        let properties = drugBox.get('properties');
        let newProperties = properties.push( fromJS({ id : generateUUID() }) );
        let newState = drugBox.set('properties', newProperties);

        this.updateDrugBox(newState);
    },

    removeProperty(id) {
        return () => {
            let drugBox = this.getDrugBox();

            let properties = drugBox.get('properties');
            let newProperties = properties.filter( (obj) => {
                return obj.get('id') !== id;
            });

            let newState = drugBox.set('properties', newProperties);

            this.updateDrugBox(newState);
        };
    },

    close() {
        this.exit();
    },

    save() {
        let requestSaveDrugBox = this.getDrugBox().set('DrugId', this.state.drug.get('id'));

        RequestPromise(DrugBoxRequests(this.props.patientID).upsert(requestSaveDrugBox)).then((drugBox) => {
            this.props.onUpdate(drugBox); this.exit();
        });
    },

    delete() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DestructiveOpConfirmation close={closeModal}
                title="Are you sure?"
                text="This operation is not reversible."
                proceed={this.finishDelete}
            />,
            container
        );
    },

    selectDrug() {
        var container = ReactDOM.findDOMNode(this.refs.drugSelector);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugSearchForm close={closeModal}
                onSelect={(drug) => { this.setState({ drug : fromJS(drug) }); }}
            />,
            container
        );
    },

    finishDelete() {
        RequestPromise(DrugBoxRequests(this.props.patientID).delete(this.getDrugBox().get('id'))).then(() => {
            this.props.onDelete(this.getDrugBox()); this.exit();
        });
    },

    cancel() {
        this.exit();
    },

    exit() {
        this.setState({ selfShow : false });
    },

    onExited() {
        this.props.close();
    },

    propertyChanged(id, key) {
        return (event) => {
            let drugBox = this.getDrugBox();

            let properties = drugBox.get('properties');
            let newProperties = properties.update(
                properties.findIndex((property) => {
                    return property.get('id') === id;
                }),
                (item) => { return item.set(key, event.currentTarget.value); }
            );

            let newState = drugBox.set('properties', newProperties);

            this.updateDrugBox(newState);
        };
    },

    namedValueChanged(key) {
        return (event) => {
            this.updateDrugBox( this.getDrugBox().set(key, event.currentTarget.value) );
        };
    },

    render() {
        let deleteButton;
        let drugBox = this.getDrugBox();

        if (drugBox.get('id')) {
            deleteButton = <Button bsStyle="danger" onClick={this.delete}>Delete Box</Button>;
        }

        let drug = this.state.drug;
        let drugText = drug ? `${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})` : 'Not selected';

        return <div>
            <div ref="placeholder"></div>
            <div ref="drugSelector"></div>
            <Modal bsSize="large" show={this.state.selfShow} onHide={this.cancel} onExited={this.onExited}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Box</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Brand
                            </Col>
                            <Col sm={3}>
                                <FormControl type="text" placeholder="Brand" value={drugBox.get('brand')} onChange={this.namedValueChanged('brand')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Production #
                            </Col>
                            <Col sm={3}>
                                <FormControl type="text" placeholder="Production Number" value={drugBox.get('productionNumber')} onChange={this.namedValueChanged('productionNumber')} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Expires at
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Expires at" value={drugBox.get('expiresAt') || undefined} onChange={this.namedValueChanged('expiresAt')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Opened at
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Opened at" value={drugBox.get('openedAt') || undefined} onChange={this.namedValueChanged('openedAt')} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Drug
                            </Col>
                            <Col sm={3}>
                                <Button onClick={this.selectDrug}>{drugText}</Button>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Unit count
                            </Col>
                            <Col sm={3}>
                                <FormControl type="number" placeholder="Unit count" value={drugBox.get('unitCount')} onChange={this.namedValueChanged('unitCount')} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
                            </Col>
                        </FormGroup>
                        {drugBox.get('properties').map((obj) => {
                            return <FormGroup key={obj.get('id')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Key
                                </Col>
                                <Col sm={3}>
                                    <FormControl type="text" placeholder="Key" value={obj.get('key')} onChange={this.propertyChanged(obj.get('id'), 'key')} />
                                </Col>
                                <Col sm={1}></Col>
                                <Col componentClass={ControlLabel} sm={1}>
                                    Value
                                </Col>
                                <Col sm={3}>
                                    <FormControl type="text" placeholder="Value" value={obj.get('value')} onChange={this.propertyChanged(obj.get('id'), 'value')} />
                                </Col>
                                <Col sm={1}>
                                    <Button bsStyle="danger" onClick={this.removeProperty(obj.get('id'))}>Delete</Button>
                                </Col>
                            </FormGroup>;
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.save}>Save Box</Button>
                    {deleteButton}
                    <Button onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }

});
