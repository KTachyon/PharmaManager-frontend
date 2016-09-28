import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default React.createClass({
    render() {
        return <Modal bsSize="small" show={this.props.showModal} onHide={this.props.cancel}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{this.props.text}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={this.props.cancel}>Cancel</Button>
                <Button bsStyle="danger" onClick={this.props.proceed}>Delete</Button>
            </Modal.Footer>
        </Modal>;
    }
});
