import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import { Input, Form, Button, Row, Col, Card, Typography, Avatar } from 'antd';
import {
    login
} from '../actions/auth_actions';
const { Title } = Typography;
const reducer = ({ auth, main }) => ({ auth, main });


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
        const { auth = {}, main: {company = {}} } = this.props;
        return (
            <Row type="flex" justify="center" align="middle" style={{minHeight: '100vh'}}>
                <Col lg={4} sm={8} xs={12}>
                    <Card>
                        <div style={{textAlign: 'center'}}>
                            {(company.logo || {}).path && <Avatar shape="square" size={64} src={(company.logo || {}).url + (company.logo || {}).path} />}
                            <Title level={4}>{company.name}</Title>
                        </div>
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
                                        message: 'Нэвтрэх нэр оруулна уу!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Нэвтрэх нэр" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Нууц үг оруулна уу!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Нууц үг"
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