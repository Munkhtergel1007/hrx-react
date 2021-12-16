import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import {Layout, Input, Form, Button, Row, Col, Card } from 'antd';
import { login } from '../actions/login_actions';
const {Header, Content, Sider} = Layout;
const reducer = ({ auth }) => ({ auth });


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    onFinish(vals){
        this.props.dispatch(login(vals));
    }
    render() {
        const { auth } = this.props;
        return (
            <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                <Col lg={4} sm={8} xs={12}>
                    <Card>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={this.onFinish.bind(this)}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button loading={auth.loggingIn} type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default  connect(reducer)(Login);