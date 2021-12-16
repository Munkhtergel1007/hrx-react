import React, { Component } from "react";
import { connect } from 'react-redux';

const reducer = ({ main }) => ({ main });

class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const { status } = this.props;
        if(status != 1) {
            return (
                this.props.children
            );
        } else {
            return (
                'loading'
            )
        }
    }
}

export default  connect(reducer)(Loader);
