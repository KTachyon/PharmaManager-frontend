import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PatientsList from './PatientsList';
import SearchBar from '../SearchBar';
import RequestPromise from '../../utils/RequestPromise';
import { PatientRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { PatientForm } from './PatientForm';
import { toastr } from 'react-redux-toastr';

import searchStyle from '../../style/search.css';
import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Glyphicon } from 'react-bootstrap';

export const PatientsView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { patients : [] };
    },

    componentDidMount() {
        RequestPromise(PatientRequests().getAll()).then((body) => {
            this.setState({ patients : fromJS(body) });
        }).catch((error) => {
            toastr.error('Patient fetch failed: ' + error.message);
        });
    },

    getPatients() {
        return this.state.searchPatients || this.state.patients || [];
    },

    search(value) {
        if (value.length > 2) {
            RequestPromise(PatientRequests().search(value)).then((body) => {
                this.setState({ searchPatients : fromJS(body) });
            }).catch((error) => {
                toastr.error('Search failed: ' + error.message);
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
        }).catch((error) => {
            toastr.error('Delete failed: ' + error.message);
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
        return <div>
            <div ref="placeholder"></div>
            <div className={searchStyle.searchContainer}>
                <SearchBar search={this.search} />
                <Glyphicon glyph="plus" onClick={this.createPatient} className={searchStyle.createBtn} />
            </div>
            <PatientsList patients={this.getPatients()} update={this.updatePatient} delete={this.deletePatient} />
        </div>;
    }
});
