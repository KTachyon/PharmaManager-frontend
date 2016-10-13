import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import PosologyList from './PosologyList';
import RequestPromise from '../../utils/RequestPromise';
import { PosologyRequests } from '../../RequestBuilder';
import { fromJS } from 'immutable';
import { PosologyForm } from './PosologyForm';

import DestructiveOpConfirmation from '../dialog/DestructiveOpConfirmation';

import { Panel, Col, Button } from 'react-bootstrap';

export const PosologyView = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return { posologies : [] };
    },

    componentDidMount() {
        RequestPromise(PosologyRequests( this.props.patientID ).getAll()).then((body) => {
            this.setState({ posologies : fromJS(body) });
        });
    },

    getPosologies() {
        return this.props.posologies || [];
    },

    createPosology() {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <PosologyForm patientID={this.props.patientID} close={closeModal} onUpdate={this.onPosologyUpdate} />,
            container
        );
    },

    onPosologyUpdate(posology) {
        posology = fromJS(posology);

        let existingPosology = this.getPosologies().find((object) => {
            return object.get('id') === posology.get('id');
        });

        if (existingPosology) {
            let newPosology = this.getPosologies().update(
                this.getPosologies().findIndex((item) => { return item.get('id') === posology.get('id'); }),
                () => { return posology; }
            );

            this.setState({ posologies : newPosology });
        } else {
            this.setState({ posologies : this.getPosologies().push(posology) });
        }
    },

    deletePosology(posology) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);

        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <DestructiveOpConfirmation close={closeModal}
                title="Are you sure?"
                text="This operation is not reversible."
                //cancel={this.hideModal}
                proceed={() => { this.onPosologyDelete(posology); }}
            />,
            container
        );
    },

    onPosologyDelete(posology) {
        RequestPromise(PosologyRequests( this.props.patientID ).delete(posology.get('id'))).then(() => {
            this.setState({ posologies : this.getPosologies().filter(p => p.get('id') !== posology.get('id')) });
        });
    },

    updatePosology(posology) {
        var container = ReactDOM.findDOMNode(this.refs.placeholder);
        let closeModal = () => {
            ReactDOM.unmountComponentAtNode(container);
        };

        ReactDOM.render(
            <PosologyForm
                close={closeModal}
                posology={posology}
                onUpdate={this.onPosologyUpdate}
                onDelete={this.onPosologyDelete}
            />,
            container
        );
    },

    render: function() {
        return <Panel>
            <div ref="placeholder"></div>
            <Col sm={4}>
                <Button onClick={this.createPosology}>Create Posology</Button>
            </Col>
            <Col sm={12}>
                <PosologyList posologies={this.getPosologies()} update={this.updatePosology} delete={this.deletePosology} />
            </Col>
        </Panel>;
    }
});