import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import { generateUUID } from '../../utils/Generator';
import { PosologyRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';
import DrugSearchForm from '../drug/DrugSearchForm';

import moment from 'moment';
import _ from 'lodash';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';
import { toastr } from 'react-redux-toastr';

import intakeStyle from '../../style/intake.css';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal, Radio } from 'react-bootstrap';

export const PosologyForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        let posology = this.props.posology || fromJS({ properties : [] });

        if (!posology.get('properties')) {
            posology = posology.set('properties', []);
        }

        if (!posology.get('intake')) {
            posology = posology.set('intake', fromJS([]));
        }

        if (!posology.get('scheduleType')) {
            posology = posology.set('scheduleType', 'DAILY');
        }

        return {
            selfShow : true,
            posology : posology,
            drug : posology.get('drug')
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
        let requestSavePosology = this.getPosology().set('DrugId', this.state.drug.get('id'));

        RequestPromise(PosologyRequests(this.props.patientID).upsert(requestSavePosology)).then((posology) => {
            this.props.onUpdate(posology); this.exit();
        }).catch((error) => {
            toastr.error('Save failed: ' + error.message);
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
        RequestPromise(PosologyRequests(this.props.patientID).delete(this.getPosology().get('id'))).then(() => {
            this.props.onDelete(this.getPosology()); this.exit();
        }).catch((error) => {
            toastr.error('Delete failed: ' + error.message);
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

    getDateValue(key) {
        return this.getPosology().get(key) ? moment( this.getPosology().get(key) ).format('YYYY-MM-DD') : undefined;
    },

    dateValueChanged(key) {
        return (event) => {
            this.updatePosology( this.getPosology().set(key, moment(event.currentTarget.value).toDate()) );
        };
    },

    gridValueChanged(key, position) {
        return (event) => {
            let value = this.getPosology().get(key).set(position, parseFloat(event.currentTarget.value));
            let newPosology = this.getPosology().set(key, value);

            this.updatePosology( newPosology );
        };
    },

    getGridValueFor(key, position) {
        return this.getPosology().get(key).get(position);
    },

    scheduleTypeChanged() {
        return (event) => {
            let newPosology = this.getPosology().set('scheduleType', event.currentTarget.value).set('intake', fromJS([]));

            this.updatePosology( newPosology );
        };
    },

    buildMonthlyIntakeGrid() {
        let colorClass = this.getGridValueFor('intake', 0) ? intakeStyle.fill : intakeStyle.zero;
        let cssClasses = `${colorClass} ${intakeStyle.intakeRow}`;

        return <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Intake</Col>
            <Col sm={2}>
                <FormControl
                    type="number"
                    step="0.5"
                    value={this.getGridValueFor('intake', 0)}
                    onChange={this.gridValueChanged('intake', 0)}
                    className={cssClasses}
                />
            </Col>
        </FormGroup>;
    },

    buildDailyIntakeGrid() {
        let intakeComponent = [];

        for (let idx = 0; idx < 4; idx++) {
            let colorClass = this.getGridValueFor('intake', idx) ? intakeStyle.fill : intakeStyle.zero;
            let cssClasses = `${colorClass} ${intakeStyle.intakeRow}`;

            intakeComponent.push(
                <FormControl
                    key={`intakeGrid${idx}`}
                    type="number"
                    step="0.5"
                    value={this.getGridValueFor('intake', idx)}
                    onChange={this.gridValueChanged('intake', idx)}
                    className={cssClasses}
                />
            );
        }

        return <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Intake</Col>
            <Col sm={1}>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Breakfast</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Lunch</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Afternoon</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Diner</p>
            </Col>
            <Col sm={2}>{intakeComponent}</Col>
        </FormGroup>;
    },

    buildWeeklyIntakeGrid() {
        let startMoment = moment(this.getPosology().get('startDate'));

        let days = [ ];

        for (let i = 0; i < 7; i++) {
            days.push(moment(startMoment).add(i, 'days'));
        }

        let weekDays = _.map(days, (day) => {
            return day.format('ddd');
        });

        let intakeComponent = _.map(weekDays, (day, position) => {
            return <p className={`${intakeStyle.intakeCell} ${intakeStyle.intakeHeader}`} key={`intakeHead${position}`}>{day}</p>;
        });

        let weekParts = 7 * 4;
        let startPart = startMoment.day() * 4;

        for (let idx = 0; idx < weekParts; idx++) {
            let currentPart = (idx + startPart) % weekParts;

            let colorClass = this.getGridValueFor('intake', currentPart) ? intakeStyle.fill : intakeStyle.zero;
            let cssClasses = `${colorClass} ${intakeStyle.intakeRow} ${intakeStyle.intakeCell} ${intakeStyle.flat}`;

            intakeComponent.push(
                <input
                    key={`intakeGrid${idx}`}
                    type="number"
                    step="0.5"
                    value={this.getGridValueFor('intake', currentPart)}
                    onChange={this.gridValueChanged('intake', currentPart)}
                    className={cssClasses}
                />
            );
        }

        return <FormGroup>
            <Col componentClass={ControlLabel} sm={2}>Intake</Col>
            <Col sm={1}>
                <p className={intakeStyle.intakeCorner}>&nbsp;</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Breakfast</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Lunch</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Afternoon</p>
                <p className={`${intakeStyle.intakeLabel} ${intakeStyle.intakeRow}`}>Diner</p>
            </Col>
            <Col sm={7}>{intakeComponent}</Col>
        </FormGroup>;
    },

    buildIntakeGrid() {
        switch (this.getPosology().get('scheduleType')) {
            case 'DAILY' :
                return this.buildDailyIntakeGrid();
            case 'WEEKLY' :
                return this.buildWeeklyIntakeGrid();
            case 'MONTHLY' :
                return this.buildMonthlyIntakeGrid();
            default :
                throw new Error('Bad scheduleType');
        }
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
                    <Modal.Title>{posology.get('id') ? 'Update' : 'Create'} posology</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Start date
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Start date" value={this.getDateValue('startDate')} onChange={this.dateValueChanged('startDate')} />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Discontinue at
                            </Col>
                            <Col sm={3}>
                                <FormControl type="date" placeholder="Discontinue at" value={this.getDateValue('discontinueAt')} onChange={this.dateValueChanged('discontinueAt')} />
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
                                Schedule Type
                            </Col>
                            <Col sm={3}>
                                <Radio name="scheduleType" value="DAILY" checked={posology.get('scheduleType') === 'DAILY'} onChange={this.scheduleTypeChanged()}>Daily</Radio>
                                <Radio name="scheduleType" value="WEEKLY" checked={posology.get('scheduleType') === 'WEEKLY'} onChange={this.scheduleTypeChanged()}>Weekly</Radio>
                                <Radio name="scheduleType" value="MONTHLY" checked={posology.get('scheduleType') === 'MONTHLY'} onChange={this.scheduleTypeChanged()}>Monthly</Radio>
                            </Col>
                        </FormGroup>
                        {this.buildIntakeGrid()}
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={2}>
                                Notes
                            </Col>
                            <Col sm={8}>
                                <FormControl componentClass="textarea" placeholder="Notes" value={posology.get('notes')} onChange={this.namedValueChanged('notes')} />
                            </Col>
                            <Col sm={1}>
                                <Button onClick={this.addProperty}>Add property</Button>
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
