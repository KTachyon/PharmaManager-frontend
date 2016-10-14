import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { generateUUID } from '../../utils/Generator';
import { PatientRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal } from 'react-bootstrap';

export const PatientForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        let patient = this.props.patient || fromJS({ properties : [] });

        if (!patient.get('properties')) {
            patient = patient.set('properties', []);
        }

        return {
            selfShow : true,
            patient : patient
        };
    },

    updatePatient(newPatient) {
        this.setState({ patient : newPatient });
    },

    getPatient() {
        return this.state.patient;
    },

    addProperty() {
        var properties = this.getPatient().get('properties');
        var newProperties = properties.push( fromJS({ id : generateUUID() }) );
        var newState = this.getPatient().set('properties', newProperties);

        this.updatePatient(newState);
    },

    removeProperty(id) {
        return () => {
            var properties = this.getPatient().get('properties');
            var newProperties = properties.filter( (obj) => {
                return obj.get('id') !== id;
            });

            var newState = this.getPatient().set('properties', newProperties);

            this.updatePatient(newState);
        };
    },

    close() {
        this.exit();
    },

    save() {
        RequestPromise(PatientRequests().upsert(this.getPatient())).then((patient) => {
            this.props.onUpdate(patient); this.exit();
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
        RequestPromise(PatientRequests().delete(this.getPatient().get('id'))).then(() => {
            this.props.onDelete(this.getPatient()); this.exit();
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
            var properties = this.getPatient().get('properties');
            var newProperties = properties.update(
                properties.findIndex((property) => {
                    return property.get('id') === id;
                }),
                (item) => { return item.set(key, event.currentTarget.value); }
            );

            var newState = this.getPatient().set('properties', newProperties);

            this.updatePatient(newState);
        };
    },

    namedValueChanged(key) {
        return (event) => {
            this.updatePatient( this.getPatient().set(key, event.currentTarget.value) );
        };
    },

    render() {
        let deleteButton;
        let patient = this.getPatient();

        if (patient.get('id')) {
            deleteButton = <Button bsStyle="danger" onClick={this.delete}>Delete patient</Button>;
        }

        return <div>
            <div ref="placeholder"></div>
            <Modal bsSize="large" show={this.state.selfShow} onHide={this.cancel} onExited={this.onExited}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Patient Name
                            </Col>
                            <Col sm={7}>
                                <FormControl type="text" placeholder="Patient Name" value={patient.get('name')} onChange={this.namedValueChanged('name')} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                NIF
                            </Col>
                            <Col sm={3}>
                                <FormControl type="text" placeholder="NIF" value={patient.get('nif')} onChange={this.namedValueChanged('nif')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                SNS
                            </Col>
                            <Col sm={3}>
                                <FormControl type="text" placeholder="SNS" value={patient.get('sns')} onChange={this.namedValueChanged('sns')} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
                            </Col>
                        </FormGroup>
                        {patient.get('properties').map((obj) => {
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
                    <Button bsStyle="primary" onClick={this.save}>Save patient</Button>
                    {deleteButton}
                    <Button onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }

});
