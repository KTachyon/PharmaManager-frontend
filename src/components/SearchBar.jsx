import React from 'react';

import { FormControl } from 'react-bootstrap';

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
        return <FormControl type="text" placeholder="Search..." value={this.state.searchValue} onChange={this.updateSearchValue}  />;
    }

});
