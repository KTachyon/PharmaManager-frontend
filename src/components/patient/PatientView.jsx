import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import RequestPromise from '../../utils/RequestPromise';
import { PatientRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';

import { PosologyView } from '../posology/PosologyView';
import { DrugBoxView } from '../boxes/DrugBoxView';
import { DrugStockView } from '../stock/DrugStockView';
import { Panel } from 'react-bootstrap';

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
        RequestPromise(PatientRequests().get( this.getPatientID() )).then((body) => {
            this.setState({ patient : fromJS(body) });
        });
    },

    render() {
        let patient = this.getPatient();

        if (!patient) {
            return <div>Loading...</div>;
        }

        return <Panel>
            <h1>{patient.get('name')}</h1>
            <p>{`NIF: ${patient.get('nif')}`}</p>
            <p>{`SNS: ${patient.get('sns')}`}</p>
            <hr />
            <h2>Posology</h2>
            <PosologyView patientID={this.getPatientID()} posologies={patient.get('Posologies')} />
            <hr />
            <h2>Boxes</h2>
            <DrugBoxView patientID={this.getPatientID()} drugBoxes={patient.get('DrugBoxes')} />
            <hr />
            <h2>Stock</h2>
            <DrugStockView patientID={this.getPatientID()} drugStocks={patient.get('DrugStocks')} />
        </Panel>;
    }
});
