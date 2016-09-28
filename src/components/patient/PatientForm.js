import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import * as actions from '../../actions/remoteActions';
import { generateUUID } from '../../utils/Generator';
import request from 'browser-request';
import { PatientRequests } from '../../RequestBuilder';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal } from 'react-bootstrap';

export const PatientForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return {
            showModal : false,
            patient : this.props.patient || fromJS({ properties : [] })
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
        let self = this;
        let id = this.getPatient().get('id');

        if (id) { // TODO: upsert request!
            request(PatientRequests().update(id, this.getPatient()), function(error, response) {
                if (error) {
                    // TODO: handle error, respect body
                    return;
                }

                if (response.statusCode >= 400) {
                    // TODO: handle error, respect body
                    return;
                }

                self.close();
            });
        } else {
            request(PatientRequests().create(this.getPatient()), function(error, response) {
                if (error) {
                    // TODO: handle error, respect body
                    return;
                }

                if (response.statusCode >= 400) {
                    // TODO: handle error, respect body
                    return;
                }

                self.close();
            });
        }
    },

    delete() {
        this.showModal();
    },

    finishDelete() {
        console.log('deleted');

        this.close();
    },

    cancel() {
        console.log('cancel');

        this.close();
    },

    logState() {
        console.log(this.getPatient().toJS());
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
                    <Button onClick={this.logState}>Log state</Button>
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
