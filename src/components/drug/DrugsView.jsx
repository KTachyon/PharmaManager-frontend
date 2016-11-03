import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import DrugsList from './DrugsList';
import SearchBar from '../SearchBar';
import RequestPromise from '../../utils/RequestPromise';
import { DrugRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { DrugForm } from './DrugForm';
import { toastr } from 'react-redux-toastr';

import searchStyle from '../../style/search.css';
import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Glyphicon } from 'react-bootstrap';

export const DrugsView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { drugs : [] };
    },

    componentDidMount() {
        RequestPromise(DrugRequests().getAll()).then((body) => {
            this.setState({ drugs : fromJS(body) });
        }).catch((error) => {
            toastr.error('Drug fetch failed: ' + error.message);
        });
    },

    getDrugs() {
        return this.state.searchDrugs || this.state.drugs || [];
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
            <DrugForm close={closeModal} onUpdate={this.onDrugUpdate} />,
            container
        );
    },

    onDrugUpdate(drug) {
        drug = fromJS(drug);

        let existingDrug = this.getDrugs().find((object) => {
            return object.get('id') === drug.get('id');
        });

        if (existingDrug) {
            let newDrugs = this.getDrugs().update(
                this.getDrugs().findIndex((item) => { return item.get('id') === drug.get('id'); }),
                () => { return drug; }
            );

            this.setState({ drugs : newDrugs });
        } else {
            this.setState({ drugs : this.getDrugs().push(drug) });
        }
    },

    deleteDrug(drug) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DestructiveOpConfirmation close={closeModal}
                title="Are you sure?"
                text="This operation is not reversible."
                //cancel={this.hideModal}
                proceed={() => { this.onDrugDelete(drug); }}
            />,
            container
        );
    },

    onDrugDelete(drug) {
        RequestPromise(DrugRequests().delete(drug.get('id'))).then(() => {
            this.setState({ drugs : this.getDrugs().filter(p => p.get('id') !== drug.get('id')) });
        }).catch((error) => {
            toastr.error('Delete failed: ' + error.message);
        });
    },

    updateDrug(drug) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);
        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DrugForm
                close={closeModal}
                drug={drug}
                onUpdate={this.onDrugUpdate}
                onDelete={this.onDrugDelete}
            />,
            container
        );
    },

    render: function() {
        return <div>
            <div ref="placeholder"></div>
            <div className={searchStyle.searchContainer}>
                <SearchBar search={this.search} />
                <Glyphicon glyph="plus" onClick={this.createDrug} className={searchStyle.createBtn} />
            </div>
            <DrugsList drugs={this.getDrugs()} update={this.updateDrug} delete={this.deleteDrug} />
        </div>;
    }
});
