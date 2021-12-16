import React from 'react'
import {connect} from "react-redux";
import {
    Row,
    Col,
    Breadcrumb,
    Menu,
    Dropdown,
    Layout,
    Typography,
} from 'antd'
import {hasAction} from "../../config";
import {setPageConf} from "../../actions/projection_actions"
import {
    ApiOutlined,
    CaretDownOutlined, CarryOutOutlined, ClockCircleOutlined,
    ControlOutlined,
    CreditCardOutlined,
    NumberOutlined, PicCenterOutlined,
    PictureOutlined
} from "@ant-design/icons";
import About from "./About";
import Holboo from "./Holboo";
import LogoAndPhotos from "./LogoAndPhotos";
import {locale} from '../../lang'
const {SubMenu} = Menu;
const {Sider, Content} = Layout;
const { Title, Text } = Typography;
const reducer = ({main, projection}) => ({main, projection})

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menu: 'about',
            submenu: 'name'
        };
        document.title = 'Байгууллага | TATATUNGA';
    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        const menus = ['about', 'holboo', 'logo_zurag'];
        const section = ((this.props.match || {}).params || {}).section || '';
        if(!hasAction(['edit_company_informations'], employee) || !menus.includes(section)){
            this.props.history.replace('/not-found');
        }else{
            this.props.dispatch(setPageConf({menu: section, submenu: this.getSubmenu(section)}));
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const menus = ['about', 'holboo', 'logo_zurag'];
        const section = ((this.props.match || {}).params || {}).section || '';
        if(!menus.includes(section)){
            this.props.history.replace('/not-found')
        }
        if(((prevProps.match || {}).params || {}).section !== section){
            this.props.dispatch(setPageConf({
                menu: section, submenu: this.getSubmenu(section)
            }));
        }
    }
    setPageConf(e){
        this.props.history.push(`/organization/${e.menu}`);
        this.props.dispatch(setPageConf({menu: e.menu, submenu: e.submenu}));
    }
    getSubmenu(menu){
        switch (menu) {
            case 'about': return 'name';
            case 'holboo': return 'mail';
            case "logo_zurag": return 'logo';
            default: return 'name';
        }
    }
    render() {
        const {
            main: {
                employee
            },
            projection: {
                pageConf
            }
        } = this.props
        return (
            <Row justify="center" align="center" className={'hrx-settings'}>
                <Col span={20}>
                    <div style={{marginBottom: 15}}>
                        <Breadcrumb>
                            <Breadcrumb.Item>Төлөвлөлт</Breadcrumb.Item>
                        </Breadcrumb>
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item key="about" title="Байгууллагын тухай" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'name'})}>
                                    {locale ('common_organization.baiguullagiin_tuhai')}
                                </Menu.Item>
                                <Menu.Item key="holboo" title="Холбоо барих" onClick={(e) => this.setPageConf({menu: 'holboo', submenu: 'mail'})}>
                                    {locale ('common_organization.holboo_barih')}
                                </Menu.Item>
                                <Menu.Item key="logo_zurag" title="Лого, зураг" onClick={(e) => this.setPageConf({menu: 'logo_zurag', submenu: 'logo'})}>
                                    {locale ('common_organization.logo_zurag')}
                                </Menu.Item>
                            </Menu>
                        }>
                            {
                                this.state.menu === 'about' ?
                                    <Breadcrumb.Item>
                                        <span>
                                            <span onClick={() => this.setPageConf({menu: 'about', submenu: 'name'})}>{locale ('common_organization.baiguullagiin_tuhai')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                                        </span>
                                    </Breadcrumb.Item>
                                : this.state.menu === 'holboo' ?
                                    <Breadcrumb.Item>
                                        <span>
                                            <span onClick={() => this.setPageConf({menu: 'holboo', submenu: 'mail'})}>{locale ('common_organization.holboo_barih')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                                        </span>
                                    </Breadcrumb.Item>
                                : this.state.menu === 'logo_zurag' ?
                                    <Breadcrumb.Item>
                                        <span>
                                            <span onClick={() => this.setPageConf({menu: 'logo_zurag', submenu: 'logo'})}>{locale ('common_organization.logo_zurag')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                                        </span>
                                    </Breadcrumb.Item>
                                : null
                            }
                        </Dropdown>
                    </div>
                    <Layout>
                        <Sider>
                            <Menu
                                defaultSelectedKeys={['name']}
                                selectedKeys={[pageConf.submenu]}
                                defaultOpenKeys={['about', 'holboo', 'logo_zurag']}
                                openKeys={['about', 'holboo', 'logo_zurag']}
                                mode="inline"
                                onClick={(e) => this.setState({submenu: e.key})}
                            >
                                <SubMenu key="about" icon={<ControlOutlined />} title="Байгууллагын тухай" onTitleClick={(e) => this.setPageConf({menu: 'about', submenu: 'name'})}>
                                    <Menu.Item key="name" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'name'})}>{locale ('common_organization.ner')}</Menu.Item>
                                    <Menu.Item key="mission" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'mission'})}>{locale ('common_organization.erhem_zorilgo')}</Menu.Item>
                                    <Menu.Item key="vision" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'vision'})}>{locale ('common_organization.alsiin_haraa')}</Menu.Item>
                                    <Menu.Item key="slogan" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'slogan'})}>{locale ('common_organization.uria_ug')}</Menu.Item>
                                    <Menu.Item key="value" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'value'})}>{locale ('common_organization.unet_zuil')}</Menu.Item>
                                    <Menu.Item key="desc" onClick={(e) => this.setPageConf({menu: 'about', submenu: 'desc'})}>{locale ('common_organization.taniltsuulga')}</Menu.Item>
                                    {/*<Menu.Item key="domain" onClick={(e) => this.setPageConf({menu: 'about'})}>Домэйн</Menu.Item>*/}
                                    {/*<Menu.Item key="isCons" onClick={(e) => this.setPageConf({menu: 'about'})}>Консалтинг</Menu.Item>*/}
                                    {/*<Menu.Item key="actions" onClick={(e) => this.setPageConf({menu: 'about'})}>Үйлдлүүд</Menu.Item>*/}
                                </SubMenu>
                                <SubMenu key="holboo" title="Холбоо барих" icon={<NumberOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'holboo', submenu: 'mail'})}>
                                    <Menu.Item key="mail" onClick={(e) => this.setPageConf({menu: 'holboo', submenu: 'mail'})}>{locale ('common_organization.email')}</Menu.Item>
                                    <Menu.Item key="web" onClick={(e) => this.setPageConf({menu: 'holboo', submenu: 'web'})}>{locale ('common_organization.website')}</Menu.Item>
                                    <Menu.Item key="phone" onClick={(e) => this.setPageConf({menu: 'holboo', submenu: 'phone'})}>{locale ('common_organization.utas')}</Menu.Item>
                                    <Menu.Item key="addr" onClick={(e) => this.setPageConf({menu: 'holboo', submenu: 'addr'})}>{locale ('common_organization.hayg')}</Menu.Item>
                                </SubMenu>
                                {hasAction(['edit_company_informations'], employee) ?
                                    <SubMenu key="logo_zurag" title="Лого, зураг" icon={<PictureOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'logo_zurag', submenu: 'logo'})}>
                                        <Menu.Item key="logo" onClick={(e) => this.setPageConf({menu: 'logo_zurag', submenu: 'logo'})}>{locale ('common_organization.logo')}</Menu.Item>
                                        <Menu.Item key="cover" onClick={(e) => this.setPageConf({menu: 'logo_zurag', submenu: 'cover'})}>{locale ('common_organization.cover')}</Menu.Item>
                                        <Menu.Item key="slider" onClick={(e) => this.setPageConf({menu: 'logo_zurag', submenu: 'slider'})}>{locale ('common_organization.zurgiin_tsomog')}</Menu.Item>
                                    </SubMenu>
                                : null
                                }
                            </Menu>
                        </Sider>
                        <Layout className='hrx-layout'>
                            {
                                pageConf.menu === 'about' ?
                                    <About {...this.props}/>
                                : pageConf.menu === 'holboo' ?
                                    <Holboo {...this.props}/>
                                : pageConf.menu === 'logo_zurag' ?
                                    <LogoAndPhotos {...this.props}/>
                                : null
                            }
                        </Layout>
                    </Layout>
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(Index)