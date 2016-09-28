import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import * as actions from '../../actions/remoteActions';

export const PatientView = React.createClass({
    mixins : [PureRenderMixin],

    getPatient() {
        return this.props.patients.find((object) => { return object.get('id') == this.props.params.patient_id; });
    },

    render() {
        return <div>
            <h1>{this.getPatient().get('name')}</h1>
            <p>This is the patient view!</p>
        </div>;
    }
});

function mapStateToProps(state) {
    return {
        patients: state.get('patients')
    };
}

export const PatientViewContainer = connect(mapStateToProps, actions)(PatientView);
