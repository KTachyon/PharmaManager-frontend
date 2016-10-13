import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import * as actions from '../../actions/remoteActions';
import { generateUUID } from '../../utils/Generator';
import { PosologyRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';
import DrugSearchForm from '../drug/DrugSearchForm';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal, Checkbox } from 'react-bootstrap';

export const PosologyForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        let posology = this.props.posology || fromJS({ properties : [] });

        if (!posology.get('properties')) {
            posology = posology.set('properties', []);
        }

        if (!posology.get('intakeTimes')) {
            posology = posology.set('intakeTimes', fromJS([false, false, false, false]));
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
        RequestPromise(PosologyRequests(this.props.patientID).upsert(this.getPosology())).then((posology) => {
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

    selectDrug() {
        var container = ReactDOM.findDOMNode(this.refs.drugSelector);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugSearchForm close={closeModal}
                onSelect={(drug) => { this.setState({ drug : drug }); }}
            />,
            container
        );
    },

    finishDelete() {
        RequestPromise(PosologyRequests(this.props.patientID).delete(this.getPosology().get('id'))).then(() => {
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
        return (event) => {
            this.updatePosology( this.getPosology().set(key, event.currentTarget.value) );
        };
    },

    booleanValueChanged(key, position) {
        return (event) => {
            let newPosology = this.getPosology().get(key).set(position, event.currentTarget.value);

            this.updatePosology( newPosology );
        };
    },

    render() {
        let deleteButton;
        let posology = this.getPosology();

        if (posology.get('id')) {
            deleteButton = <Button bsStyle="danger" onClick={this.delete}>Delete posology</Button>;
        }

        let drug = this.state.drug;
        let drugText = drug ? `${drug.get('name')} (${drug.get('dose')} ${drug.get('unit')})` : 'Not selected';

        return <div>
            <div ref="placeholder"></div>
            <div ref="drugSelector"></div>
            <Modal bsSize="large" show={this.state.selfShow} onHide={this.cancel} onExited={this.onExited}>
                <Modal.Header closeButton>
                    <Modal.Title>Create posology</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Start date
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Start date" value={posology.get('startDate')} onChange={this.namedValueChanged('startDate')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Discontinue at
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Discontinue at" value={posology.get('discontinueAt')} onChange={this.namedValueChanged('discontinueAt')} />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Intake times
                            </Col>
                            <Col sm={3}>
                                <Checkbox checked={this.getPosology().get('intakeTimes').get(0)} onChange={this.booleanValueChanged('intakeTimes', 0)}>Breakfast</Checkbox>
                                <Checkbox checked={this.getPosology().get('intakeTimes').get(1)} onChange={this.booleanValueChanged('intakeTimes', 1)}>Lunch</Checkbox>
                                <Checkbox checked={this.getPosology().get('intakeTimes').get(2)} onChange={this.booleanValueChanged('intakeTimes', 2)}>Afternoon</Checkbox>
                                <Checkbox checked={this.getPosology().get('intakeTimes').get(3)} onChange={this.booleanValueChanged('intakeTimes', 3)}>Diner</Checkbox>
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Intake quantity
                            </Col>
                            <Col sm={3}>
                                <FormControl type="number" step="0.1" placeholder="Intake quantity" value={posology.get('intakeQuantity')} onChange={this.namedValueChanged('intakeQuantity')} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Drug
                            </Col>
                            <Col sm={3}>
                                <Button onClick={this.selectDrug}>{drugText}</Button>
                            </Col>
                        </FormGroup>
                        {posology.get('properties').map((obj) => {
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
                    <Button bsStyle="primary" onClick={this.save}>Save posology</Button>
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
