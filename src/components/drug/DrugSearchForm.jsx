import React from 'react';
import RequestPromise from '../../utils/RequestPromise';
import { DrugRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import DrugSearchItem from './DrugSearchItem';
import SearchBar from '../SearchBar';
import { toastr } from 'react-redux-toastr';

import { Modal, Button, Col, ListGroup } from 'react-bootstrap';

export default React.createClass({
    getInitialState() {
        return {
            show : true,
            drugs : []
        };
    },

    componentDidMount() {
        RequestPromise(DrugRequests().getAll()).then((body) => {
            this.setState({ drugs : fromJS(body) });
        }).catch((error) => {
            toastr.error('Fetching drugs failed: ' + error.message);
        });
    },

    getDrugs() {
        return this.state.searchDrugs || this.state.drugs || [];
    },

    hide() {
        this.setState({ show : false });
    },

    onExit() {
        this.props.close();
    },

    cancel() {
        this.hide();
    },

    select(item) {
        this.props.onSelect(item);
        this.hide();
    },

    search(value) {
        if (value.length > 2) {
            RequestPromise(DrugRequests().search(value)).then((body) => {
                this.setState({ searchDrugs : fromJS(body) });
            }).catch((error) => {
                toastr.error('Search failed: ' + error.message);
            });
        } else {
            this.setState({ searchDrugs : undefined });
        }
    },

    render() {
        return <Modal bsSize="small" show={this.state.show} onExited={this.onExit} onHide={this.cancel}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height : '314px' }}>
                <Col sm={12}>
                    <SearchBar search={this.search} />
                </Col>
                <Col sm={12} style={{ height : '250px', overflow : 'auto' }}>
                    <ListGroup>
                        {this.getDrugs().map(drug =>
                            <DrugSearchItem key={drug.get('id')} obj={drug} onSelect={this.select} />
                        )}
                    </ListGroup>
                </Col>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.cancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>;
    }
});
