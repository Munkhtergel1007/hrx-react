import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
const reducer = ({ main }) => ({ main });

class Footer extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
    }

    render() {
        const { main: { categories, user } } = this.props;

        return (
            ' footer gshsh'
        );
    }
}

export default  connect(reducer)(Footer);