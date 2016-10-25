import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { DrugStockRequests } from '../../RequestBuilder';
import RequestPromise from '../../utils/RequestPromise';
import { toastr } from 'react-redux-toastr';

import { Button, FormGroup, FormControl, Form, ControlLabel, Col, Modal } from 'react-bootstrap';

export const DrugStockUpdateForm = React.createClass({
    mixins : [PureRenderMixin],

    getInitialState() {
        return {
            selfShow : true,
            amount : 0
        };
    },

    update(amount) {
        this.setState({ amount });
    },

    getDrugStock() {
        return this.props.drugStock;
    },

    close() {
        this.exit();
    },

    save() {
        let drugId = this.props.drugStock.get('drug').get('id');

        RequestPromise(DrugStockRequests(this.props.patientID).updateStock(this.state.amount, drugId)).then(() => {
            this.props.onUpdate(); this.exit();
        }).catch((error) => {
            toastr.error('Save failed: ' + error.message);
        });
    },

    cancel() {
        this.exit();
    },

    exit() {
        this.setState({ selfShow : false });
    },

    onExited() {
        this.props.close();
    },

    amountChanged(event) {
        this.update( parseInt(event.currentTarget.value) );
    },

    render() {
        return <div>
            <div ref="placeholder"></div>
            <Modal bsSize="small" show={this.state.selfShow} onHide={this.cancel} onExited={this.onExited}>
                <Modal.Header closeButton>
                    <Modal.Title>Update stock</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form horizontal>
                        <FormGroup>
                            <Col componentClass={ControlLabel} sm={4}>
                                Change stock by
                            </Col>
                            <Col sm={8}>
                                <FormControl type="number" placeholder="# of units" value={this.state.amount} onChange={this.amountChanged} />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button bsStyle="primary" onClick={this.save}>Update stock</Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }

});
