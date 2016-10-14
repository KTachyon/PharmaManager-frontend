import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { generateUUID } from '../../utils/Generator';
import { DrugRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal } from 'react-bootstrap';

export const DrugForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        let drug = this.props.drug || fromJS({ properties : [] });

        if (!drug.get('properties')) {
            drug = drug.set('properties', []);
        }

        return {
            selfShow : true,
            drug : drug
        };
    },

    updateDrug(newDrug) {
        this.setState({ drug : newDrug });
    },

    getDrug() {
        return this.state.drug;
    },

    addProperty() {
        var properties = this.getDrug().get('properties');
        var newProperties = properties.push( fromJS({ id : generateUUID() }) );
        var newState = this.getDrug().set('properties', newProperties);

        this.updateDrug(newState);
    },

    removeProperty(id) {
        return () => {
            var properties = this.getDrug().get('properties');
            var newProperties = properties.filter( (obj) => {
                return obj.get('id') !== id;
            });

            var newState = this.getDrug().set('properties', newProperties);

            this.updateDrug(newState);
        };
    },

    close() {
        this.exit();
    },

    save() {
        RequestPromise(DrugRequests().upsert(this.getDrug())).then((drug) => {
            this.props.onUpdate(drug); this.exit();
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
                //cancel={this.hideModal}
                proceed={this.finishDelete}
            />,
            container
        );
    },

    finishDelete() {
        RequestPromise(DrugRequests().delete(this.getDrug().get('id'))).then(() => {
            this.props.onDelete(this.getDrug()); this.exit();
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
            var properties = this.getDrug().get('properties');
            var newProperties = properties.update(
                properties.findIndex((property) => {
                    return property.get('id') === id;
                }),
                (item) => { return item.set(key, event.currentTarget.value); }
            );

            var newState = this.getDrug().set('properties', newProperties);

            this.updateDrug(newState);
        };
    },

    namedValueChanged(key) {
        return (event) => {
            this.updateDrug( this.getDrug().set(key, event.currentTarget.value) );
        };
    },

    render() {
        let deleteButton;
        let drug = this.getDrug();

        if (drug.get('id')) {
            deleteButton = <Button bsStyle="danger" onClick={this.delete}>Delete drug</Button>;
        }

        return <div>
            <div ref="placeholder"></div>
            <Modal bsSize="large" show={this.state.selfShow} onHide={this.cancel} onExited={this.onExited}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Drug</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Drug Name
                            </Col>
                            <Col sm={8}>
                                <FormControl type="text" placeholder="Drug name" value={drug.get('name')} onChange={this.namedValueChanged('name')} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Dose
                            </Col>
                            <Col sm={3}>
                                <FormControl type="text" placeholder="Dosage value" value={drug.get('dose')} onChange={this.namedValueChanged('dose')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Unit
                            </Col>
                            <Col sm={3}>
                                <FormControl type="text" placeholder="Dosage unit" value={drug.get('unit')} onChange={this.namedValueChanged('unit')} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
                            </Col>
                        </FormGroup>
                        {drug.get('properties').map((obj) => {
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
                    <Button bsStyle="primary" onClick={this.save}>Save drug</Button>
                    {deleteButton}
                    <Button onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }

});
