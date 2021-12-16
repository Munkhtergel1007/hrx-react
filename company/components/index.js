import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {hasAction, companyAdministrator} from "../config";
import {renderRoutes} from 'react-router-config';
import {
    Route,
    Link
} from 'react-router-dom';
import {
    LogoutOutlined,
    RadarChartOutlined,
    SettingOutlined,
    TransactionOutlined,
    UsergroupAddOutlined,
    ReconciliationOutlined,
    FormOutlined,
    FieldTimeOutlined,
    PicCenterOutlined,
    InteractionOutlined,
    CopyrightOutlined,
    ApartmentOutlined,
    CloudOutlined,
    SwapRightOutlined, StockOutlined,
    ContainerOutlined, BellOutlined,
    ClusterOutlined,
    DollarCircleOutlined, FileOutlined,
    SwitcherOutlined, PullRequestOutlined,
    ProfileOutlined, RiseOutlined,
    CarryOutOutlined, UserOutlined,
    HourglassOutlined, CalendarOutlined,
    DownloadOutlined
} from '@ant-design/icons';
import Icon from '@ant-design/icons'
import {Layout, Menu, Tooltip, Button, Progress, Avatar, Typography, Popover, Badge } from 'antd';
const { Title } = Typography;
const {SubMenu} = Menu;
import * as actions from "../actions";
import moment from "moment";
import Login from "./Login";
import {getEmployee, getEmployeeCV} from "../actions/employee_actions";
import Cookies from "js-cookie";
const {Header, Content, Sider} = Layout;
const reducer = ({ main }) => ({ main });

class Symbol extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <svg fill="transparent" width="1em" height="1em" viewBox="0 0 900 900">
                <circle cx="450" cy="450" r="410" stroke={this.props.fill} strokeWidth="80" />
                <path
                    d="M250 250 L 650 250 L 650 350 L 500 350 L 500 750 L 400 750 L 400 350 L 250 350 L 250 250 Z"
                    fill={(this.props || {}).fill || 'rgb(38,38,38)'}
                />
                <path
                    d="M550 400 L 350 500 L 350 550 L 550 450 L 550 400 Z"
                    fill={(this.props || {}).fill || 'rgb(38,38,38)'}
                />
                <path
                    d="M 350 650 L 350 700 L 550 600 L 550 550 L 350 650 Z"
                    fill={(this.props || {}).fill || 'rgb(38,38,38)'}
                />
            </svg>
        )
    }
}


class index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            color: 'rgb(38,38,38)',
            collapsed: false,
        };
    }
    onLangChange(language) {
        const {main:{domain}} = this.props;
        console.log('company - cook, language');
        Cookies.set("lang", language, {domain:domain});
        window.location.assign("/");
        // this.setState({ openLang: false });
    }
    render() {
        let { route: {routes}, main: {domain, user = {}, company, employee, settings, references} } = this.props;
        let firstParam = location.pathname.split('/');
        if(company && user._id && user._id && (employee || {})._id){
            let percent = 0;
            let max_file_size = user.max_file_size;
            let used_file_size = ((user.used_file_size/1024/1024/1024) || 0);
            if(max_file_size){
                percent = Math.ceil(used_file_size * 100 / max_file_size);
            }
            let avatar = '/images/default-avatar.png';
            let worthy = false, worthyBreak = false, worthyVacation = false, worthyPerformance = false, worthySalary = false, worthyOrlogoZarlaga = false;
            if(hasAction(['edit_company_informations'], employee)){
                worthy = true;
            }
            if(hasAction(['deal_with_break'],employee)){
                worthyBreak = true;
            }
            if(hasAction(['read_orlogo_zarlaga'],employee)){
                worthyOrlogoZarlaga = true;
            }
            if(hasAction(['create_vacation'], employee)){
                worthyVacation = true
            }
            if(employee.staticRole !== 'employee' && employee.staticRole !== 'attendanceCollector'){
                worthyPerformance = true
            }
            if(hasAction(['read_salary', 'edit_salary'], employee)){
                worthySalary = true
            }
            // if(hasAction(['create_report'], employee)){
            //     worthyReport = true
            // }
            if (user.avatar && user.avatar && user.avatar.path !== '') {
                avatar = `${config.get('hostMedia')}${user.avatar.path}`;
            }
            return (
                <Layout className='main-layout'>
                    <Sider
                        theme='light'
                        breakpoint="lg"
                        collapsedWidth="0"
                        // theme='light'
                        // collapsible
                        // onBreakpoint={broken => {
                        //     console.log(broken);
                        // }}
                        // collapsed={this.state.collapsed}
                        // onCollapse={() => this.setState({collapsed: !this.state.collapsed})}
                        // style={{
                        //     overflow: 'auto',
                        //     height: '100vh',
                        //     position: 'fixed',
                        //     left: 0,
                        //     maxWidth:250,
                        //     minWidth:250,
                        //     width:250
                        // }}
                        // width='250px'
                    >
                        <div className="sider-logo">
                            {this.state.collapsed ?
                                <a href={config.get('host')}>
                                    <h3>TATATUNGA</h3>
                                </a>
                                :
                                <React.Fragment>
                                    <a href={config.get('host')}>
                                        <h3>tatatunga.mn</h3>
                                    </a>
                                    <Link to={`/worker/${employee._id}/anket`} onClick={() => {
                                        if(hasAction(['edit_employee'], employee, employee._id)) {
                                            this.props.dispatch(getEmployee(employee._id))
                                            this.props.dispatch(getEmployeeCV(employee._id))
                                        } else {
                                            this.props.history.replace('/not-found')
                                        }
                                    }}>
                                        <Avatar
                                            style={{marginTop: '20px'}}
                                            size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                            src={avatar}
                                        />
                                        <div style={{marginBottom: '20px'}}>
                                            {user.last_name ? user.last_name : ''}
                                            <Title level={5}>{user.first_name ? user.first_name : ''}</Title>
                                        </div>
                                    </Link>
                                </React.Fragment>
                            }
                        </div>

                        <Menu theme="light"  mode="inline" selectedKeys={[(firstParam[1] || 'home')]} defaultSelectedKeys={[(firstParam[1] || 'home')]}>
                            <Menu.Item key="my_profile" icon={<UserOutlined />}>
                                <Link to={`/worker/${employee._id}/anket`}>
                                    <span>Миний бүртгэл</span>
                                </Link>
                            </Menu.Item>

                            {
                                worthy === true ?
                                    <>
                                        <Menu.Item key="home" icon={<RadarChartOutlined />}>
                                            <Link to="/">
                                                <span>Самбар</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="organization" icon={<ApartmentOutlined />}>
                                            <Link to="/organization/about">
                                                <span>Байгууллага</span>
                                            </Link>
                                        </Menu.Item>
                                    </>
                                    :
                                    <Menu.Item key="company" icon={<CopyrightOutlined />}>
                                        <Link to="/">
                                            <span>Байгууллага</span>
                                        </Link>
                                    </Menu.Item>
                            }
                            <Menu.Item key="workers" icon={<UsergroupAddOutlined />}>
                                <Link to="/workers">
                                    <span>Ажилтан</span>
                                </Link>
                            </Menu.Item>
                            {
                                worthyPerformance ?
                                    <SubMenu key="work_plan_performance" icon={<CalendarOutlined />} title="Ажил төлөвлөлт">
                                        <Menu.Item key="work_plan" icon={<SwapRightOutlined />}>
                                            <Link to="/work_plan">
                                                <span>Төлөвлөгөө оруулах</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="performance" icon={<CarryOutOutlined />}>
                                            <Link to="/performance">
                                                <span>Гүйцэтгэл үнэлэх</span>
                                            </Link>
                                        </Menu.Item>
                                    </SubMenu>
                                    :
                                    <Menu.Item key="work_plan" icon={<CarryOutOutlined />}>
                                        <Link to="/work_plan">
                                            <span>Төлөвлөгөө оруулах</span>
                                        </Link>
                                    </Menu.Item>
                            }
                            {/* <SubMenu key="warehouse_management_system" icon={<CloudOutlined />} title="Агуулах удирдлага">
                                <Menu.Item key="category" icon={<CloudOutlined />}>
                                    <Link to="/category">
                                        <span>Ангилал</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="asset" icon={<CloudOutlined />}>
                                    <Link to="/asset">
                                        <span>Нэмэлт талбар</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="product" icon={<CloudOutlined />}>
                                    <Link to="/product">
                                        <span>Бүтээгдхүүн</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="warehouse" icon={<ClusterOutlined />}>
                                    <Link to="/warehouse">
                                        <span>Агуулах</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="restock" icon={<DownloadOutlined />}>
                                    <Link to="/restock">
                                        <span>Бараа татлага</span>
                                    </Link>
                                </Menu.Item>
                            </SubMenu> */}
                            <Menu.Item key="warehouse" icon={<ClusterOutlined />}>
                                    <Link to="/warehouse">
                                        <span>Агуулах удирдлага</span>
                                    </Link>
                                </Menu.Item>
                            <Menu.Item key="orlogo_zarlaga"  icon={<TransactionOutlined />}>
                                <Link to="/orlogo_zarlaga">
                                    <span className="selectedMenu">Орлого зарлага</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="task" icon={<StockOutlined />}>
                                <Link to="/task">
                                    <span>Ажил</span>
                                </Link>
                            </Menu.Item>
                            {/*{*/}
                            {/*    worthyOrlogoZarlaga ?*/}
                            {/*        <Menu.Item key="orlogo_zarlaga"  icon={<TransactionOutlined />}>*/}
                            {/*            <Link to="/orlogo_zarlaga">*/}
                            {/*                <span className="selectedMenu">Орлого зарлага</span>*/}
                            {/*            </Link>*/}
                            {/*        </Menu.Item>*/}
                            {/*        : null*/}
                            {/*}*/}
                            {/*<Menu.Item key="department" icon={ <PicCenterOutlined />}>*/}
                            {/*    <Link to="/department">*/}
                            {/*        <span>Хэлтэс</span>*/}
                            {/*    </Link>*/}
                            {/*</Menu.Item>*/}

                            <Menu.Item key="attendance" icon={<ReconciliationOutlined />}>
                                <Link to="/attendance">
                                    <span>Ирц</span>
                                </Link>
                            </Menu.Item>
                            {worthyBreak || worthyVacation ?
                                <SubMenu key="sub_att" icon={<FormOutlined />} title="Чөлөө, амралт">
                                    {
                                        worthyBreak === true ?
                                            <Menu.Item key="break" icon={<FieldTimeOutlined />}>
                                                <Link to="/break">
                                                    <span>Чөлөө</span>
                                                </Link>
                                            </Menu.Item>
                                            :
                                            null
                                    }
                                    {
                                        worthyVacation === true ?
                                            <Menu.Item key='vacation' icon={<HourglassOutlined />}>
                                                <Link to="/vacation">
                                                    <span>Ээлжийн амралт</span>
                                                </Link>
                                            </Menu.Item>
                                            :
                                            null
                                    }
                                </SubMenu>
                                :
                                null
                            }
                            <Menu.Item key="jobDesc" icon={<ProfileOutlined />}>
                                <Link to="/job-description">
                                    <span>АБТ</span>
                                </Link>
                            </Menu.Item>
                            {/*{*/}
                            {/*    worthy === true ?*/}
                            {/*        <SubMenu key='sub_projection' icon={<ContainerOutlined />} title='Төлөвлөлт' >*/}
                            {/*            */}
                            {/*        </SubMenu>*/}
                            {/*    : null*/}
                            {/*}*/}
                            {
                                companyAdministrator(employee) ?
                                    <React.Fragment>
                                        <Menu.Item key="orientation" icon={<RiseOutlined />}>
                                            <Link to="/orientation">
                                                <span>Чиглүүлэх хөтөлбөр</span>
                                            </Link>
                                        </Menu.Item>
                                        {/*<Menu.Item key="labor" icon={<SwitcherOutlined />}>*/}
                                        {/*    <Link to="/labor-relation">*/}
                                        {/*        <span>Хөдөлмөрийн харилцаа</span>*/}
                                        {/*    </Link>*/}
                                        {/*</Menu.Item>*/}
                                    </React.Fragment>
                                    :
                                    null
                            }
                            <Menu.Item key="salary"
                                       icon={
                                           <Icon
                                               component={Symbol}
                                           />
                                       }
                            >
                                <Link to="/salary">
                                    <span className="selectedMenu">Цалин</span>
                                </Link>
                            </Menu.Item>
                           {/*<Menu.Item key='report' icon={ <Icon component={FileOutlined} />}  >     */}
                           {/*    <Link to='/report'>*/}
                           {/*        <span>Тайлан</span>*/}
                           {/*    </Link>*/}
                           {/*</Menu.Item>*/}
                            {
                                worthy === true ?
                                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                                        <Link to="/settings/administration">
                                            <span>Тохиргоо</span>
                                        </Link>
                                    </Menu.Item>
                                    :
                                    null
                            }
                            {
                                !worthy ?
                                    <SubMenu key='work_relation' icon={<PullRequestOutlined />} title='Хөдөлмөрийн харилцаа' disabled >
                                        <Menu.Item key="employment_contract" icon={<ApartmentOutlined />}>
                                            <Link to="/employment/contract">
                                                <span>Хөдөлмөрийн гэрээ</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="company_rules" icon={<ProfileOutlined />}>
                                            <Link to="/company/rules">
                                                <span>Дүрэм журам</span>
                                            </Link>
                                        </Menu.Item>
                                        <Menu.Item key="organization_description" icon={<ProfileOutlined />}>
                                            <Link to="/organization/description">
                                                <span>Байгууллагын тодорхойлолт</span>
                                            </Link>
                                        </Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                            }
                            {
                                !worthy ?
                                    <Menu.Item key="customer_feedback" icon={<ProfileOutlined />} disabled>
                                        <Link to="/customer/feedback">
                                            <span>Санал хүсэлт</span>
                                        </Link>
                                    </Menu.Item>
                                    :
                                    null
                            }
                            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                                <a href="/logout">
                                    <span>Гарах</span>
                                </a>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout" style={{
                        // marginLeft: (this.state.collapsed ? 80 : 250),
                        position: 'relative' }}>
                        <Header style={{
                            backgroundColor: 'white', display: 'flex', height: 'max-content',
                            justifyContent: 'space-between', alignItems: 'center', zIndex: 10, lineHeight: 'unset'
                        }}>
                            <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                {
                                    company.logo && company.logo && company.logo.path !== '' ?
                                        <img
                                            style={{
                                                marginRight: 10, height: 30, width: 30,
                                                objectFit: 'cover', borderRadius: '50%', overflow: 'hidden',
                                                userSelect: 'none'
                                            }}
                                            src={`${config.get('hostMedia')}${company.logo.path}`} alt={'logo'}
                                            onError={(e) => e.target.src = '/images/default-company.png'}
                                        />
                                        :
                                        null
                                }
                                <h3 style={{fontSize: 20, marginBottom: 0, padding: "10px 0", whiteSpace: 'nowrap'}}>{company.name}</h3>
                            </div>
                            {/*<span onClick={Cookies.get('lang', {domain:domain}) !== 'kz' ? this.onLangChange.bind(this, 'kz') : null} style={Cookies.get('lang') !== 'kz' ? {color:'blue',cursor:'pointer', marginRight:10} : {marginRight:10}}>Kazakh</span>*/}
                            {/*<span onClick={Cookies.get('lang', {domain:domain}) !== 'rs' ? this.onLangChange.bind(this, 'rs') : null} style={Cookies.get('lang') !== 'rs' ? {color:'blue',cursor:'pointer'} : {}}>Russia</span>*/}
                            <Popover
                                title={'Мэдээ, мэдээлэл'}
                                placement={'bottomRight'}
                                trigger={'click'}
                                overlayStyle={{width: 300}}
                                content={
                                    <>
                                        {
                                            (references || []).map(ref =>
                                                <Link to={`/reference/${ref._id}`} key={`${ref._id} - ${employee._id}`}>
                                                    {
                                                        `
                                                        ${
                                                            ((((ref || {}).employee || {}).user || {}).last_name || '').slice(0,1).toUpperCase()
                                                            +((((ref || {}).employee || {}).user || {}).last_name || '')
                                                                .slice(1,((((ref || {}).employee || {}).user || {}).last_name || '').length)
                                                        } овогтой ${
                                                            ((((ref || {}).employee || {}).user || {}).first_name || '').slice(0,1).toUpperCase()
                                                            +((((ref || {}).employee || {}).user || {}).first_name || '')
                                                                .slice(1,((((ref || {}).employee || {}).user || {}).first_name || '').length)
                                                        } тодорхойлох захидал
                                                        `
                                                    }
                                                </Link>
                                            )
                                        }
                                    </>
                                }
                            >
                                <Badge count={(references || []).length}>
                                    <Button icon={<BellOutlined />} shape={'circle'} />
                                </Badge>
                            </Popover>
                        </Header>
                        <Content className='hrx-content'>
                            {renderRoutes(routes)}
                        </Content>
                    </Layout>
                </Layout>
            );
        } else {
            return <Login />;
        }
    }
}

export default  connect(reducer)(index);
