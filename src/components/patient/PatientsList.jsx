import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PatientItem from './PatientItem';

import { ListGroup } from 'react-bootstrap';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPatients: function() {
        return this.props.patients;
    },

    render: function() {
        if (!this.getPatients()) {
            return <div>Loading...</div>;
        }

        return <ListGroup>
            {this.getPatients().map(patient =>
                <PatientItem key={patient.get('id')} obj={patient} update={this.props.update} />
            )}
        </ListGroup>;
    }
});
