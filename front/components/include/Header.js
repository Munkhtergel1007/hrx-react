import React, { Component } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import config from '../../config';
const reducer = ({ main }) => ({ main });

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    render() {
        const { main: { categories, user } } = this.props;

        return (
            'header gshsh '
        );
    }
}

export default  connect(reducer)(Header);