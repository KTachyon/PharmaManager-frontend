import React from 'react';

import { Form, FormControl, FormGroup } from 'react-bootstrap';

export default React.createClass({

    getInitialState() {
        return { searchValue : '' };
    },

    updateSearchValue(event) {
        var searchValue = event.currentTarget.value;
        this.setState({ searchValue });
        this.props.search(searchValue);
    },

    render() {
        return <Form>
            <FormGroup>
                <FormControl type="text" placeholder="Search..." value={this.state.searchValue} onChange={this.updateSearchValue} />
            </FormGroup>
        </Form>;
    }

});
