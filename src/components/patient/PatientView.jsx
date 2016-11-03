import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import RequestPromise from '../../utils/RequestPromise';
import { PatientRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { toastr } from 'react-redux-toastr';

import { PosologyView } from '../posology/PosologyView';
import { DrugStockView } from '../stock/DrugStockView';
import { Panel } from 'react-bootstrap';

import FullPageLoader from '../loader/FullPageLoader';

export const PatientView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return {};
    },

    getPatient() {
        return this.state.patient;
    },

    getPatientID() {
        return this.props.params.patient_id;
    },

    componentDidMount() {
        this.onUpdateAny();
    },

    onUpdateAny() {
        return RequestPromise(PatientRequests().get( this.getPatientID() )).then((body) => {
            this.setState({ patient : fromJS(body) });
        }).catch((error) => {
            toastr.error('Updated patient fetch failed: ' + error.message);
        });
    },

    render() {
        let patient = this.getPatient();

        if (!patient) {
            return <FullPageLoader />;
        }

        return <Panel>
            <h1>{patient.get('name')}</h1>
            <p>{`NIF: ${patient.get('nif')}`}</p>
            <p>{`SNS: ${patient.get('sns')}`}</p>
            <hr />
            <h2>Posology</h2>
            <PosologyView patientID={this.getPatientID()} onServerUpdate={this.onUpdateAny} posologies={patient.get('Posologies')} />
            <hr />
            <h2>Stock</h2>
            <DrugStockView patientID={this.getPatientID()} onServerUpdate={this.onUpdateAny} drugStocks={patient.get('DrugStocks')} />
        </Panel>;
    }
});
