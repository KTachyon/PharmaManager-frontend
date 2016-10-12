import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import * as actions from '../../actions/remoteActions';
import { generateUUID } from '../../utils/Generator';
import { PosologyRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal } from 'react-bootstrap';

export const PosologyForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        let posology = this.props.posology || fromJS({ properties : [] });

        if (!posology.get('properties')) {
            posology = posology.set('properties', []);
        }

        return {
            selfShow : true,
            posology : posology
        };
    },

    updatePosology(newPosology) {
        this.setState({ posology : newPosology });
    },

    getPosology() {
        return this.state.posology;
    },

    addProperty() {
        let posology = this.getPosology();

        let properties = posology.get('properties');
        let newProperties = properties.push( fromJS({ id : generateUUID() }) );
        let newState = posology.set('properties', newProperties);

        this.updatePosology(newState);
    },

    removeProperty(id) {
        return () => {
            let posology = this.getPosology();

            let properties = posology.get('properties');
            let newProperties = properties.filter( (obj) => {
                return obj.get('id') !== id;
            });

            let newState = posology.set('properties', newProperties);

            this.updatePosology(newState);
        };
    },

    close() {
        this.exit();
    },

    save() {
        RequestPromise(PosologyRequests().upsert(this.getPosology())).then((posology) => {
            this.props.onUpdate(posology); this.exit();
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

    finishDelete() {
        RequestPromise(PosologyRequests().delete(this.getPosology().get('id'))).then(() => {
            this.props.onDelete(this.getPosology()); this.exit();
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
            let posology = this.getPosology();

            let properties = posology.get('properties');
            let newProperties = properties.update(
                properties.findIndex((property) => {
                    return property.get('id') === id;
                }),
                (item) => { return item.set(key, event.currentTarget.value); }
            );

            let newState = posology.set('properties', newProperties);

            this.updatePosology(newState);
        };
    },

    namedValueChanged(key) {
        return () => {
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
                                Start date
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Start date" value={patient.get('startDate')} onChange={this.namedValueChanged('startDate')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Discontinue at
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Discontinue at" value={patient.get('discontinueAt')} onChange={this.namedValueChanged('discontinueAt')} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Intake interval
                            </Col>
                            <Col sm={3}>
                                <FormControl type="number" placeholder="Intake interval" value={patient.get('intakeInterval')} onChange={this.namedValueChanged('intakeInterval')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Intake quantity
                            </Col>
                            <Col sm={3}>
                                <FormControl type="number" placeholder="Intake quantity" value={patient.get('intakeQuantity')} onChange={this.namedValueChanged('intakeQuantity')} />
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


function mapStateToProps(state) {
    return {
        posology: state.get('posology')
    };
}

export const PosologyFormContainer = connect(mapStateToProps, actions)(PosologyForm);
