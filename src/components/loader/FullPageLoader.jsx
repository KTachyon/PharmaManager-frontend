import React, { Component } from 'react';
import loaderStyle from '../../style/loader.css';

export default class FullPageLoader extends Component {

    render() {
        return <div className={loaderStyle.loader}></div>;
    }
}
