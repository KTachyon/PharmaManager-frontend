import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export default React.createClass({
    getInitialState() {
        return { show : true };
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

    proceed() {
        this.props.proceed();
        this.hide();
    },

    render() {
        return <Modal bsSize="small" show={this.state.show} onExited={this.onExit} onHide={this.cancel}>
            <Modal.Header closeButton>
                <Modal.Title>{this.props.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{this.props.text}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button bsStyle="primary" onClick={this.cancel}>Cancel</Button>
                <Button bsStyle="danger" onClick={this.proceed}>Delete</Button>
            </Modal.Footer>
        </Modal>;
    }
});
