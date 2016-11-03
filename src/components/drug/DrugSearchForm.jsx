import React from 'react';
import ReactDOM from 'react-dom';
import RequestPromise from '../../utils/RequestPromise';
import { DrugRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import DrugSearchItem from './DrugSearchItem';
import SearchBar from '../SearchBar';
import { toastr } from 'react-redux-toastr';
import searchStyle from '../../style/search.css';
import modalListStyle from '../../style/modalList.css';

import { DrugForm } from './DrugForm';
import { Modal, Button, Glyphicon } from 'react-bootstrap';

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

    createDrug() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugForm close={closeModal} onUpdate={this.select} />,
            container
        );
    },

    render() {
        let even = true;

        return <Modal bsSize="small" show={this.state.show} onExited={this.onExit} onHide={this.cancel}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div ref="placeholder"></div>
                <div className={searchStyle.searchContainer}>
                    <SearchBar search={this.search} />
                    <Glyphicon glyph="plus" onClick={this.createDrug} className={searchStyle.createBtn} />
                </div>
                <div className={modalListStyle.modalList}>
                    {this.getDrugs().map((drug) => {
                        even = !even;

                        return <DrugSearchItem key={drug.get('id')} obj={drug} even={even} onSelect={this.select} />;
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.cancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>;
    }
});
