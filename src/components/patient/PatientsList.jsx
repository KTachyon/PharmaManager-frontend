import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PatientItem from './PatientItem';

import FullPageLoader from '../loader/FullPageLoader';

export default React.createClass({
    mixins : [PureRenderMixin],

    getPatients: function() {
        return this.props.patients;
    },

    render: function() {
        if (!this.getPatients()) {
            return <FullPageLoader />;
        }

        let even = true;

        return <div>
            {this.getPatients().map((patient) => {
                even = !even;

                return <PatientItem
                    key={patient.get('id')}
                    obj={patient}
                    even={even}
                    update={this.props.update}
                    delete={this.props.delete}
                />;
            })}
        </div>;
    }
});
