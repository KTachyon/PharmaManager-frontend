import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PatientsList from './PatientsList';
import SearchBar from '../SearchBar';
import RequestPromise from '../../utils/RequestPromise';
import { PatientRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { PatientForm } from './PatientForm';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Panel, Col, Button } from 'react-bootstrap';

export const PatientsView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { patients : [] };
    },

    componentDidMount() {
        RequestPromise(PatientRequests().getAll()).then((body) => {
            this.setState({ patients : fromJS(body) });
        });
    },

    getPatients() {
        return this.state.searchPatients || this.state.patients || [];
    },

    search(value) {
        if (value.length > 2) {
            RequestPromise(PatientRequests().search(value)).then((body) => {
                this.setState({ searchPatients : fromJS(body) });
            });
        } else {
            this.setState({ searchPatients : undefined });
        }
    },

    createPatient() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <PatientForm close={closeModal} onUpdate={this.onPatientUpdate} />,
            container
        );
    },

    onPatientUpdate(patient) {
        patient = fromJS(patient);

        let existingPatient = this.getPatients().find((object) => {
            return object.get('id') === patient.get('id');
        });

        if (existingPatient) {
            let newPatients = this.getPatients().update(
                this.getPatients().findIndex((item) => { return item.get('id') === patient.get('id'); }),
                () => { return patient; }
            );

            this.setState({ patients : newPatients });
        } else {
            this.setState({ patients : this.getPatients().push(patient) });
        }
    },

    deletePatient(patient) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DestructiveOpConfirmation close={closeModal}
                title="Are you sure?"
                text="This operation is not reversible."
                //cancel={this.hideModal}
                proceed={() => { this.onPatientDelete(patient); }}
            />,
            container
        );
    },

    onPatientDelete(patient) {
        RequestPromise(PatientRequests().delete(patient.get('id'))).then(() => {
            this.setState({ patients : this.getPatients().filter(p => p.get('id') !== patient.get('id')) });
        });
    },

    updatePatient(patient) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);
        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <PatientForm
                close={closeModal}
                patient={patient}
                onUpdate={this.onPatientUpdate}
                onDelete={this.onPatientDelete}
            />,
            container
        );
    },

    render() {
        return <Panel>
            <div ref="placeholder"></div>
            <Col sm={4}>
                <SearchBar search={this.search} />
            </Col>
            <Col sm={4}>
                <Button onClick={this.createPatient}>Create Patient</Button>
            </Col>
            <Col sm={12}>
                <PatientsList patients={this.getPatients()} update={this.updatePatient} delete={this.deletePatient} />
            </Col>
        </Panel>;
    }
});
