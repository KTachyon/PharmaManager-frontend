import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import * as actions from '../../actions/remoteActions';
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
            showModal : false,
            patient : patient
        };
    },

    updatePatient(newPatient) {
        this.setState({ patient : newPatient });
    },

    showModal() {
        this.setState({ showModal : true });
    },

    hideModal() {
        this.setState({ showModal : false });
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
        this.props.close();
    },

    save() {
        RequestPromise(PatientRequests().upsert(this.getPatient())).then((patient) => {
            this.props.onUpdate(patient); this.close();
        });
    },

    delete() {
        this.showModal();
    },

    finishDelete() {
        RequestPromise(PatientRequests().delete(this.getPatient().get('id'))).then(() => {
            this.props.onDelete(this.getPatient()); this.close();
        });
    },

    cancel() {
        this.close();
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

    nameChanged : function(event) {
        this.updatePatient( this.getPatient().set('name', event.currentTarget.value) );
    },

    render() {
        let deleteButton;

        if (this.getPatient().get('id')) {
            deleteButton = <Button bsStyle="danger" onClick={this.delete}>Delete patient</Button>;
        }

        return <div>
            <DestructiveOpConfirmation showModal={this.state.showModal}
                title="Are you sure?"
                text="This operation is not reversible."
                cancel={this.hideModal}
                proceed={this.finishDelete}
            />
            <Modal bsSize="large" show={true} onHide={this.cancel}>
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
                                <FormControl type="text" placeholder="Patient Name" value={this.getPatient().get('name')} onChange={this.nameChanged} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
                            </Col>
                        </FormGroup>
                        {this.getPatient().get('properties').map((obj) => {
                            return <FormGroup key={obj.get('id')}>
                                <Col componentClass={ControlLabel} sm={2}>
                                    Key
                                </Col>
                                <Col sm={3}>
                                    <FormControl type="text" placeholder="Key" value={obj.get('key')} onChange={this.propertyChanged(obj.get('id'), 'key')} />
                                </Col>
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


function mapStateToProps(state) {
    return {
        patient: state.get('patient')
    };
}

export const PatientFormContainer = connect(mapStateToProps, actions)(PatientForm);
