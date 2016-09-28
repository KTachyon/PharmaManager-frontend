import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import DrugsList from './DrugsList';
import SearchBar from '../SearchBar';
import * as actions from '../../actions/remoteActions';
import request from 'browser-request';
import { DrugRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';

import { Panel, Col, Button } from 'react-bootstrap';

export const DrugsView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { drugs : [] };
    },

    componentDidMount() {
        var self = this;

        request(DrugRequests().getAll(), function(error, response, body) {
            if (error) {
                // TODO: handle error, respect body
                return;
            }

            if (response.statusCode >= 400) {
                // TODO: handle error, respect body
                return;
            }

            self.setState({ drugs : fromJS( JSON.parse(body) ) });
        });
    },

    getDrugs() {
        return this.state.searchDrugs || this.state.drugs || [];
    },

    search(value) {
        var self = this;

        if (value.length > 2) {
            request(DrugRequests().search(value), function(error, response, body) {
                if (error) {
                    // TODO: handle error, respect body
                    return;
                }

                if (response.statusCode >= 400) {
                    // TODO: handle error, respect body
                    return;
                }

                self.setState({ searchDrugs : fromJS(body) });
            });
        } else {
            self.setState({ searchDrugs : undefined });
        }
    },

    createDrug() {
        console.log('createDrug');
    },

    render: function() {
        return <Panel>
            <div id="placeholder"></div>
            <Col sm={4}>
                <SearchBar search={this.search} />
            </Col>
            <Col sm={4}>
                <Button onClick={this.createPatient}>Create Drug</Button>
            </Col>
            <Col sm={12}>
                <DrugsList drugs={this.getDrugs()} />
            </Col>
        </Panel>;
    }
});

function mapStateToProps(state) {
    return {
        drugs: state.get('drugs')
    };
}

export const DrugsViewContainer = connect(mapStateToProps, actions)(DrugsView);
