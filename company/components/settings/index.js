import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {
    hasAction,
} from "../../config";
import {
    PictureOutlined,
    NumberOutlined,
    ControlOutlined,
    CreditCardOutlined,
    BranchesOutlined,
    ApiOutlined,
    PicCenterOutlined,
    CarryOutOutlined,
    CaretDownOutlined,
    ClockCircleOutlined,
    TagsOutlined,
    ForkOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Row,
    Col,
    Typography,
    Breadcrumb,
    Dropdown,
    DatePicker,
} from 'antd';
import Roles from "./Roles";
import Timetable from "./Timetable";
import Tags from "./Tags";
import Charges from "./Charges";
import Alba from "./Alba";
import Administration from "./Administration";
import {setPageConf} from "../../actions/settings_actions";
import Subsidiary from "./Subsidiary";
import {locale} from "../../lang";
const {SubMenu} = Menu;
const {Sider, Content} = Layout;
const { Title, Text } = Typography;
const {RangePicker} = DatePicker
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });


class Settings extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            menu: 'administration',
            submenu: 'administration1'
        };
        document.title = 'Тохиргоо  |  TATATUNGA';
        let menus = ['administration', 'roles', 'tags', 'timetable', 'subsidiary'];
        let disabled = ['alba', 'tseneglelt'];
        const section = ((props.match || {}).params || {}).section || '';
        if(menus.includes(section)){
            props.dispatch(setPageConf({menu: section, submenu: this.getSubmenu(section)}));
        }else{
            props.history.replace('/not-found');
        }
    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        const menus = ['administration', 'roles', 'tags', 'timetable', 'subsidiary'];
        const section = ((this.props.match || {}).params || {}).section || '';
        if(!hasAction(['edit_company_informations'], employee) || !menus.includes(section)){
            this.props.history.replace('/not-found');
        }else{
            this.props.dispatch(setPageConf({menu: section, submenu: this.getSubmenu(section)}));
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        const menus = ['administration', 'roles', 'tags', 'timetable', 'subsidiary'];
        const section = ((this.props.match || {}).params || {}).section || '';
        if(!menus.includes(section)){
            this.props.history.replace('/not-found')
        }
        if(((prevProps.match || {}).params || {}).section !== section){
            this.props.dispatch(setPageConf({menu: section, submenu: this.getSubmenu(section)}));
        }
    }
    getBreadCrumb(page){
        switch (page) {
            case 'roles':
                return (
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => this.setPageConf({menu: 'roles', submenu: 'roles1'})}>{locale('common_settings.Alban tushaal')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                );
            // case 'vacation':
            //     return (
            //         <Breadcrumb.Item>
            //             <span>
            //                 <span onClick={() => this.setState({menu: 'vacation', submenu: 'vacation1'})}>Ээлжийн амралт <CaretDownOutlined style={{fontSize: 10}}/></span>
            //             </span>
            //         </Breadcrumb.Item>
            //     );
            case 'tags':
                return (
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => this.setPageConf({menu: 'tags', submenu: 'tags1'})}>{locale('common_settings.Temdeglegee')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                );
            case 'administration':
                return (
                    <Breadcrumb.Item>
                            <span>
                                <span onClick={() => this.setPageConf({menu: 'administration', submenu: 'administration1'})}>{locale('common_settings.Udirdlaga')}<CaretDownOutlined style={{fontSize: 10}}/></span>
                            </span>
                    </Breadcrumb.Item>
                );
            case 'timetable':
                return (
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => this.setPageConf({menu: 'timetable', submenu: 'timeline'})}>{locale('common_settings.TS_Huvaari')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                );
            case 'subsidiary':
                return (
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => this.setPageConf({menu: 'subsidiary', submenu: 'subsidiary_company'})}>{locale('common_settings.Ohin compani')} <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                );
            case 'tseneglelt':
                return (
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => this.setPageConf({menu: 'tseneglelt', submenu: 'recruitment'})}>Цэнэглэлт <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                );
            case 'alba':
                return (
                    <Breadcrumb.Item>
                        <span>
                            <span onClick={() => this.setPageConf({menu: 'alba', submenu: 'heltes'})}>Алба <CaretDownOutlined style={{fontSize: 10}}/></span>
                        </span>
                    </Breadcrumb.Item>
                );
            default: return null;
        }
    }
    getSubmenu(menu){
        switch (menu) {
            case 'administration': return 'administration1';
            case 'roles': return 'roles1';
            case "tags": return 'tags1';
            case 'timetable': return 'timeline';
            case 'subsidiary': return 'subsidiary_company';
            case 'tseneglelt': return 'recruitment';
            case 'alba': return 'heltes';
            default: return 'administration1';
        }
    }
    setPageConf(e){
        this.props.history.push(`/settings/${e.menu}`);
        this.setState({submenu: e.submenu}, () => {
            this.props.dispatch(setPageConf({menu: e.menu, submenu: e.submenu}));
        });
    }
    render(){
        const { main: {company = {}, user = {}, employee = {}}, settings: {pageConf} } = this.props;
        return (
            <Row justify="center" align="center" className={'hrx-settings'}>
                <Col span={20}>
                    <div style={{marginBottom: 15}}>
                        <Breadcrumb>
                            <Breadcrumb.Item>{locale('common_settings.Tohirgoo')}</Breadcrumb.Item>
                            <Dropdown overlay={
                                <Menu>
                                    {hasAction(['edit_roles'], employee) ?
                                        <Menu.Item key="administration" title="Удирдлага" onClick={(e) => this.setPageConf({menu: 'administration', submenu: 'administration1'})}>
                                            {locale('common_settings.Udirdlaga')}
                                        </Menu.Item>
                                        :
                                        null
                                    }
                                    {hasAction(['read_roles'], employee) ?
                                        <Menu.Item key="roles" title="Албан тушаал" onClick={(e) => this.setPageConf({menu: 'roles', submenu: 'roles1'})}>
                                            {locale('common_settings.Alban tushaal')}
                                        </Menu.Item>
                                        :
                                        null
                                    }
                                    {hasAction(['edit_tags'], employee) ?
                                        <Menu.Item key='tags' title='Тэмдэглэгээ' onClick={(e) => this.setPageConf({menu: 'tags', submenu: 'tags1'})}>
                                            {locale('common_settings.Temdeglegee')}
                                        </Menu.Item>
                                        :
                                        null
                                    }
                                    {hasAction(['deal_with_timetable'], employee) ?
                                        <Menu.Item key="timetable" title="Цагийн хуваарь" onClick={(e) => this.setPageConf({menu: 'timetable', submenu: 'timeline'})}>
                                            {locale('common_settings.TS_Huvaari')}
                                        </Menu.Item>
                                        :
                                        null
                                    }
                                    {hasAction(['read_subsidiary'], employee) ?
                                        <Menu.Item key="subsidiary" title="Охин компани" onClick={(e) => this.setPageConf({menu: 'subsidiary', submenu: 'subsidiary_company'})}>
                                            {locale('common_settings.Ohin compani')}
                                        </Menu.Item>
                                        : null
                                    }
                                    {hasAction(['request_charge'], employee) ?
                                        <Menu.Item key="tseneglelt" disabled title="Цэнэглэлт" onClick={(e) => this.setState({menu: 'tseneglelt', submenu: 'recruitment'})}>
                                            Цэнэглэлт
                                        </Menu.Item>
                                        :
                                        null
                                    }
                                    {hasAction(['edit_company_informations'], employee) ?
                                        <Menu.Item key="alba" title="Алба" disabled onClick={(e) => this.setState({menu: 'alba', submenu: 'heltes'})}>
                                            Алба
                                        </Menu.Item>
                                        :
                                        null
                                    }
                                    {/*<Menu.Item key="vacation" title="Ээлжийн амралт" onClick={(e) => this.setState({menu: 'vacation', submenu: 'vacation1'})}>*/}
                                    {/*    Ээлжийн амралт*/}
                                    {/*</Menu.Item>*/}
                                </Menu>
                            }>
                                {this.getBreadCrumb(pageConf.menu)}
                            </Dropdown>
                        </Breadcrumb>
                    </div>
                    <Layout>
                        <Sider>
                            <Menu
                                defaultSelectedKeys={['administration1']}
                                selectedKeys={[pageConf.submenu]}
                                defaultOpenKeys={['administration', 'roles', 'tags', 'timetable', 'subsidiary']}
                                openKeys={['administration', 'roles', 'tags', 'timetable', 'subsidiary']}
                                mode="inline"
                                onClick={(e) => this.setState({submenu: e.key})}
                            >
                                {hasAction(['edit_roles'], employee) ?
                                    <SubMenu key="administration" title= {locale('common_settings.Udirdlaga')} icon={<ForkOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'administration', submenu: 'administration1'})}>
                                        <Menu.Item key="administration1" onClick={(e) => this.setPageConf({menu: 'administration', submenu: 'administration1'})}>{locale('common_settings.Udirdlaga')}</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                                {hasAction(['read_roles'], employee) ?
                                    <SubMenu key="roles" title= {locale('common_settings.Alban tushaal')} icon={<CarryOutOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'roles', submenu: 'roles1'})}>
                                        <Menu.Item key="roles1" onClick={(e) => this.setPageConf({menu: 'roles', submenu: 'roles1'})}>{locale('common_settings.Alban tushaal')}</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                                {/*{hasAction(['create_vacation'], employee) ?*/}
                                {/*    <SubMenu key='vacation' title="Ээлжийн амралт" icon={<CalendarOutlined />} onTitleClick={(e) => this.setState({menu: 'vacation', submenu: 'vacation1'})}>*/}
                                {/*        <Menu.Item key="vacation1" onClick={(e) => this.setState({menu: 'vacation'})}>Ээлжийн амралт</Menu.Item>*/}
                                {/*    </SubMenu>*/}
                                {/*    :*/}
                                {/*    null*/}
                                {/*}*/}
                                {hasAction(['edit_tags'], employee) ?
                                    <SubMenu key="tags" title= {locale('common_settings.Temdeglegee')} icon={<TagsOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'tags', submenu: 'tags1'})}>
                                        <Menu.Item key="tags1" onClick={(e) => this.setPageConf({menu: 'tags', submenu: 'tags1'})}>{locale('common_settings.Temdeglegee')}</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                                {hasAction(['deal_with_timetable'], employee) ?
                                    <SubMenu key="timetable" title= {locale('common_settings.TS_Huvaari')} icon={<ClockCircleOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'timetable', submenu: 'timeline'})}>
                                        <Menu.Item key="timeline" onClick={(e) => this.setPageConf({menu: 'timetable', submenu: 'timeline'})}>{locale('common_settings.TS_Huvaari')}</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                                {hasAction(['read_subsidiary'], employee) ?
                                    <SubMenu key="subsidiary" title= {locale('common_settings.Ohin compani')} icon={<BranchesOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'subsidiary', submenu: 'subsidiary_company'})}>
                                        <Menu.Item key="subsidiary_company" onClick={(e) => this.setPageConf({menu: 'subsidiary', submenu: 'subsidiary_company'})}>{locale('common_settings.Ohin compani')}</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                                {hasAction(['request_charge'], employee) ?
                                    <SubMenu disabled={true} key="tseneglelt" title="Цэнэглэлт" icon={<ApiOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'tseneglelt', submenu: 'recruitment'})}>
                                        <Menu.Item disabled={true} key="recruitment" onClick={(e) => this.setPageConf({menu: 'tseneglelt', submenu: 'recruitment'})}>Зарлал</Menu.Item>
                                        <Menu.Item disabled={true} key="filesize" onClick={(e) => this.setPageConf({menu: 'tseneglelt', submenu: 'recruitment'})}>Файлын хэмжээ</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                                {hasAction(['edit_company_informations'], employee) ?
                                    <SubMenu disabled={true} key="alba" title="Алба" icon={<PicCenterOutlined />} onTitleClick={(e) => this.setPageConf({menu: 'alba', submenu: 'heltes'})}>
                                        <Menu.Item disabled={true} key="heltes" onClick={(e) => this.setPageConf({menu: 'alba', submenu: 'heltes'})}>Хэлтэс</Menu.Item>
                                    </SubMenu>
                                    :
                                    null
                                }
                            </Menu>
                        </Sider>
                        <Layout className={'hrx-layout'}>
                            {
                                pageConf.menu === 'roles' ?
                                    <Roles {...this.props}/>
                                // : this.state.menu === 'vacation' ?
                                //     <Vacation {...this.props}/>
                                : pageConf.menu === 'timetable' ?
                                    <Timetable {...this.props} />
                                : pageConf.menu === 'tags' ?
                                    <Tags {...this.props} />
                                : pageConf.menu === 'subsidiary' ?
                                    <Subsidiary {...this.props} />
                                : pageConf.menu === 'tseneglelt' ?
                                    <Charges {...this.props}/>
                                : pageConf.menu === 'alba' ?
                                    <Alba {...this.props}/>
                                : pageConf.menu === 'administration' ?
                                    <Administration {...this.props} />
                                : null
                            }
                        </Layout>
                    </Layout>
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(Settings);