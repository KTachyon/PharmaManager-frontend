import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import PatientsList from './PatientsList';
import SearchBar from '../SearchBar';
import * as actions from '../../actions/remoteActions';
import request from 'browser-request';
import { PatientRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { PatientForm } from './PatientForm';

import { Panel, Col, Button } from 'react-bootstrap';

export const PatientsView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { patients : [] };
    },

    componentDidMount() {
        var self = this;

        request(PatientRequests().getAll(), function(error, response, body) {
            if (error) {
                // TODO: handle error, respect body
                return;
            }

            if (response.statusCode >= 400) {
                // TODO: handle error, respect body
                return;
            }

            self.setState({ patients : fromJS( JSON.parse(body) ) });
        });
    },

    getPatients() {
        return this.state.searchPatients || this.state.patients || [];
    },

    search(value) {
        var self = this;

        if (value.length > 2) {
            request(PatientRequests().search(value), function(error, response, body) {
                if (error) {
                    // TODO: handle error, respect body
                    return;
                }

                if (response.statusCode >= 400) {
                    // TODO: handle error, respect body
                    return;
                }

                self.setState({ searchPatients : fromJS(body) });
            });
        } else {
            self.setState({ searchPatients : undefined });
        }
    },

    createPatient() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <PatientForm close={closeModal} />,
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
                <PatientsList patients={this.getPatients()} />
            </Col>
        </Panel>;
    }
});

function mapStateToProps(state) {
    return {
        patients: state.get('patients')
    };
}

export const PatientsViewContainer = connect(mapStateToProps, actions)(PatientsView);
