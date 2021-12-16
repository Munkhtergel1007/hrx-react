import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {renderRoutes} from 'react-router-config';
import {
    Link
} from 'react-router-dom';
import {
    UserOutlined,
    HomeFilled,
    LogoutOutlined,
    UserAddOutlined,
    DatabaseFilled,
    SwitcherFilled,
    WalletOutlined
} from '@ant-design/icons';
import {Layout, Menu, Tooltip, Button } from 'antd';
const {Header, Content, Sider} = Layout;
const reducer = ({ main }) => ({ main });


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    render() {
        let { route: {routes} } = this.props;
        return (
            'home'
        );
    }
}

export default  connect(reducer)(Login);