import React, { Component } from "react";
import { connect } from 'react-redux';
import {renderRoutes} from 'react-router-config';
import config from "../config";
// import Header from "./include/Header";
// import Footer from "./include/Footer";

const reducer = ({ main}) => ({ main});

class Home extends Component {
    constructor(props) {
        super(props);
        config.config({history: this.props.history});
        console.log('props.main.domain', props.main.domain);
        console.log('config host', config.get('host'));
    }
    render() {
        const { route: {routes}} = this.props;
        return (
            <React.Fragment>
                <div className="main-main">
                    {/* <Header/> */}
                    {renderRoutes(routes)}
                    {/* <Footer/> */}
                </div>
            </React.Fragment>
        );
    }
}

export default  connect(reducer)(Home);
