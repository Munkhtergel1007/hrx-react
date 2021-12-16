import React from "react";
import { connect} from 'react-redux';
import {renderRoutes} from 'react-router-config';
import {
    Link,
    Route,
    Redirect
} from 'react-router-dom';
import {
    ApartmentOutlined,
    HomeFilled,
    LogoutOutlined,
    BlockOutlined,
    DollarCircleOutlined,
    AimOutlined,
    WalletOutlined,
    PlusOutlined
} from '@ant-design/icons';
import {Layout, Menu, Tooltip, Badge, Popconfirm, message, Button } from 'antd';
import * as actions from "../actions";
import { addAction } from "../actions/company_actions";
import Login from './Login';
const {Header, Content, Sider} = Layout;
const reducer = ({ main }) => ({ main });


class index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }
    press(){
        this.props.dispatch(addAction())
    }
    toggle() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    async flush() {
        const result = await actions.flush();
        console.log(result)
    };
    render() {
        let { route: {routes}, main = {} } = this.props;
        let firstParam = location.pathname.split('/');
        if(main.admin){
            return (
                <Layout className='main-layout'>
                    <Sider
                        theme='light'
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={() => this.setState({collapsed: !this.state.collapsed})}
                    >
                        <div className="sider-logo">
                            {this.state.collapsed?
                                <h3>HRX</h3>
                                :
                                <h3>tatatunga.mn</h3>
                            }
                        </div>
                        <Menu theme="light"  defaultSelectedKeys={[(firstParam[2] || 'home')]}  mode="inline">
                            <Menu.Item key="home" icon={<HomeFilled />}>
                                <Link to="/admin">
                                    <span>Нүүр</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="company" icon={<ApartmentOutlined />}>
                                <Link to="/admin/companies">
                                    <span>Компани</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="bundles" icon={<BlockOutlined />}>
                                <Link to="/admin/bundles">
                                    <span>Систем багц</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="transactions_company" icon={<DollarCircleOutlined />}>
                                <Link to="/admin/transactions_company">
                                    <span>
                                            Компани гүйлгээ
                                        <Badge status="error" />
                                    </span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="company_request" icon={<AimOutlined />}>
                                <Link to="/admin/company_requests">
                                    <span>
                                        Компани бүртгүүлэх хүсэлт
                                        <Badge status="error" />
                                    </span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="add_action" icon={<PlusOutlined />} style={{position: 'relative'}}>
                                <Popconfirm
                                    className="addAction"
                                    title="Үйлдэл шинэчлэглэх гэж байна!"
                                    onConfirm={() => this.press()}
                                    onCancel={() => message.error('Цуцлагдлаа')}
                                    okText='Тийм'
                                    cancelText='Үгүй'
                                    >
                                    <div style={{position: 'absolute', top:0, left: 0, width: '100%', height: '100%'}} />
                                </Popconfirm>
                                Үйлдэл нэмэх
                            </Menu.Item>
                    
                                
                            {/*<Button onClick={this.flush.bind(this)} type='default' size='small'>Clear</Button>*/}
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background" >
                            <Tooltip placement="bottom" title='Гарах'>
                                <a href="/logout" className='logout-button'><LogoutOutlined /></a>
                            </Tooltip>
                        </Header>

                        <Content className='bagshmn-content'>
                            {renderRoutes(routes)}
                        </Content>
                    </Layout>
                </Layout>
            );
        } else {
            return <Login />
        }
    }
}

export default  connect(reducer)(index);