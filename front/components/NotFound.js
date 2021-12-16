import React, { Component } from "react";
import { connect } from 'react-redux';

const reducer = ({ main }) => ({ main });

class NotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const { value } = event.target;
        this.setState(() => {
            return {
                value
            };
        });
    }

    render() {
        return (
            <React.Fragment>
                <p>404</p>
            </React.Fragment>
        );
    }
}

export default  connect(reducer)(NotFound);