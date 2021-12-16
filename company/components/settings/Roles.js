import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {locale} from "../../lang";
import config, {
    uuidv4,
    formattedActionsArray, hasAction,
} from "../../config";
import {
    PlusOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Checkbox,
    Button,
    Card,
    Spin,
    Form,
    Row,
    Col,
    Input,
    Drawer,
    Typography,
    Popconfirm,
    Empty,
    Divider,
    Modal, Select,
    DatePicker
} from 'antd';
import {
    getAllRoles,
    createRole,
    deleteRole,
    getOrientation,
    getJobDescriptions,
    clearActions,
    addActions
} from '../../actions/settings_actions';
import RoleActions from "./include/RoleActions";
import {SwatchesPicker} from 'react-color'
import MediaLib from "../media/MediaLib";
const { Title, Text } = Typography;
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Roles extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            desc: '',
            _id: '',
            actions: [],
            visible: false,
            deletingRole: false,
            key: null,
            orientation: {},
            jobDescription: {},
            selectedOrientation: {},
            selectedJobDescription: {},
            searchOrientation: '',
            searchJobDescription: ''
            // modalVisible: false,
            // optionsEnv: [],
            // optionsExtra: []
        }
        document.title = 'Тохиргоо | Албан тушаал  |  TATATUNGA';
    }
    componentDidMount() {
        const {main: {employee}} = this.props;
        if(!hasAction(['read_roles'], employee)){
            this.props.history.replace('/not-found');
        }else {
            this.props.dispatch(getAllRoles());
            this.props.dispatch(getOrientation({search: ''}));
            this.props.dispatch(getJobDescriptions({search: ''}));
        }
    }
    changeCompanyMain(vals){
        const {settings: {actions}} = this.props;
        vals.actions = actions;
        vals._id = this.state._id || null;
        vals.orientation = (this.state.selectedOrientation || {})._id;
        vals.jobDescription = (this.state.selectedJobDescription || {})._id;
        this.props.dispatch(createRole(vals)).then((c) => {
            if(c.json.success){
                this.setState({visible: false});
            }
        });
    }
    deleteAction(roleId, companyId){
        this.setState({...this.state, key: null, deletingRole: false});
        this.props.dispatch(deleteRole({_id: roleId, comId: companyId}));
    }
    // checkAction(e){
    //     const { target: {value, checked} } = e;
    //     let actions = this.state.actions;
    //     if(checked){
    //         if(actions.indexOf(value) === -1){
    //             actions.push(value);
    //         }
    //     } else {
    //         actions = actions.filter(c => c !== value);
    //     }
    //     this.setState({actions: actions});
    // }
    searchJobDescriptions(e){
        const {dispatch} = this.props;
        clearTimeout(this.state.timeOutJob);
        let timeOutJob = setTimeout(function(){
            dispatch(getJobDescriptions({search: e}));
        }, 300);
        this.setState({timeOutJob: timeOutJob, searchJobDescription: e})
    }
    searchOrientation(e){
        const {dispatch} = this.props;
        clearTimeout(this.state.timeOutOrien);
        let timeOutOrien = setTimeout(function(){
            dispatch(getOrientation({search: e}));
        }, 300);
        this.setState({timeOut: timeOutOrien, searchOrientation: e})
    }
    findJobDescriptions(e){
        const{ settings: {jobDescriptions}} = this.props;
        let found = {};
        (jobDescriptions || []).map((job) => {
            if((job._id || '').toString() === (e || 'as').toString()){
                found = job;
            }
        })
        this.setState({selectedJobDescription: found});
    }
    findOrientation(e){
        const{ settings: {orientation}} = this.props;
        let found = {};
        (orientation || []).map(orien => {
            if((orien._id || 'as').toString() === (e || '').toString()){
                found = orien;
            }
        })
        this.setState({selectedOrientation: found});
    }
    render() {
        const { main: {company}, settings: { roles, gettingRoles, creatingRole, gettingOrientation, orientation, gettingJobDescriptions, jobDescriptions, actions } } = this.props;

        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}} className={'settings-roles'}>
                    <Col span={18}>
                        <div style={{width: '100%', height: 30, marginBottom: 30}}>
                            {/* <Button onClick={() => this.setState({modalVisible: true})}>Чиглүүлэх хөтөлбөр</Button> */}
                            {
                                this.state.deletingRole !== true ?
                                    <React.Fragment>
                                        {
                                            roles.length !== 0 ?
                                                <Button type='danger' onClick={() => this.setState({deletingRole: true})} icon={<DeleteOutlined />}>
                                                    Албан тушаал устгах
                                                </Button>
                                                :
                                                null
                                        }
                                        <Button type='primary' onClick={() => this.setState({
                                            orientation: {}, selectedOrientation: {}, selectedJobdescription: {},
                                            jobDescription: {}, visible: true, name: '', desc: '', actions: [], _id: ''})} style={{float: 'right'}} icon={<PlusOutlined />}>
                                            {locale('common_A_Tushaal.A_T_Uusgeh')}
                                        </Button>
                                    </React.Fragment>
                                    :
                                    <Button type='danger' onClick={() => this.setState({deletingRole: false})} icon={<DeleteOutlined />}>
                                        Болих
                                    </Button>
                            }
                        </div>
                        {/*<Button onClick={() => this.setState({visible: true, name: '', desc: '', actions: [], _id: ''})} style={{width: '100%', height: 40}} icon={<PlusOutlined />}>Үүрэг үүсгэх</Button>*/}
                        {
                            gettingRoles ?
                                <div style={{textAlign: 'center', marginTop: 30}}>
                                    <Spin />
                                </div>
                            : roles.length > 0 ?
                                roles.map(item =>
                                    <Row key={item._id} style={{marginTop: 20, marginBottom: 20, backgroundColor: '#fbfbfb'}}>
                                        <Col span={this.state.deletingRole !== true ? 24 : 22}>
                                            <Card key={uuidv4()} className={'role-card'} onClick={() => this.state.deletingRole !== true ?
                                                this.setState({...item, selectedJobDescription: item.jobDescription, selectedOrientation: item.orientation, orientation: {}, jobDescription: {}, visible: true},
                                                    () => this.props.dispatch(addActions(item))) : null}
                                            >
                                                <Title level={5}>{item.name}</Title>
                                                <Text type="secondary" className={'role-actions-list'}>
                                                    {
                                                        formattedActionsArray().map((c, i) => {
                                                            if(c.actions.some(ca => (item.actions || []).indexOf(ca.key) > -1)){
                                                                return <span key={c.value}>{c.value}<span>,</span></span>;
                                                            } else {
                                                                return null;
                                                            }
                                                        })
                                                    }
                                                </Text>
                                            </Card>
                                        </Col>
                                        {
                                            this.state.deletingRole !== true ?
                                                null
                                                :
                                                <Col span={2} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <Popconfirm
                                                        title={'Устгах уу?'}
                                                        onConfirm={this.deleteAction.bind(this, item._id, company._id)}
                                                        visible={this.state.key === item._id}
                                                        onCancel={() => this.setState({...this.state, key: null})}
                                                        okText="Тийм"
                                                        cancelText="Үгүй"
                                                    >
                                                        <Button onClick={() => this.setState({...this.state, key: item._id})} icon={<DeleteOutlined />} shape='circle'/>
                                                    </Popconfirm>
                                                </Col>
                                        }

                                    </Row>
                                )
                            : <Empty />
                        }
                    </Col>
                </Row>
                <Drawer
                    title={this.state._id !== '' ? "Албан тушаал шинэчлэх" : locale('common_A_Tushaal.A_T_Uusgeh')}
                    maskClosable={false}
                    onClose={() => this.setState({visible: false, name: '', desc: '', actions: [], _id: ''})}
                    width={720}
                    visible={this.state.visible}
                    key={'drawer-roles'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button
                                style={{marginRight: 20}}
                                htmlType="button"
                                onClick={() => this.setState({
                                    visible: false,
                                    name: '', desc: '',
                                    actions: [], _id: '',
                                    orientation: {},
                                    jobDescription: {},
                                    selectedOrientation: {},
                                    selectedJobDescription: {},
                                    searchJobDescription: '',
                                    searchOrientation: ''
                                }, () => {
                                    this.props.dispatch(clearActions());
                                })}
                            >
                                {locale('common_A_Tushaal.Bolih')}
                            </Button>
                            <Button
                                // style={{float: 'left'}}
                                htmlType="submit"
                                form='role'
                                type={'primary'}
                                loading={creatingRole}
                                disabled={
                                    creatingRole
                                }
                            >
                                {this.state._id !== '' ? 'Шинэчлэх' : locale('common_A_Tushaal.Uusgeh')}
                            </Button>
                        </div>
                    }
                >
                    <Row justify="center" align="center">
                        <Col span={22}>
                            <Form
                                id='role'
                                size={'small'}
                                layout="vertical"
                                onFinish={this.changeCompanyMain.bind(this)}
                                fields={[
                                    {name: 'name', value: this.state.name},
                                    {name: 'desc', value: this.state.desc},
                                    {name: 'jobDescription', value: (this.state.jobDescription || {})._id},
                                    {name: 'orientation', value: (this.state.orientation || {})._id},
                                ]}
                                initialValues={{
                                    jobDescription: null,
                                    orientation: null,
                                }}
                            >
                                <Form.Item
                                    label= {locale('common_A_Tushaal.Ner')}
                                    name="name"
                                    rules={[
                                        {
                                            required: this.state.name === '',
                                            message: locale('common_A_Tushaal.Ner oruuln uu'),
                                        },
                                    ]}
                                >
                                    <Input value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} placeholder= {locale('common_A_Tushaal.A_Tushaalin ner')} />
                                </Form.Item>
                                <Form.Item
                                    label= {locale('common_A_Tushaal.A_Tushaalin tuhai')}
                                    name={"desc"}
                                    rules={[
                                        {
                                            required: this.state.desc === '',
                                            message: locale('common_A_Tushaal.Alban_T tuhai oruuln uu'),
                                        },
                                    ]}
                                >
                                    <Input.TextArea value={this.state.desc} onChange={(e) => this.setState({desc: e.target.value})} placeholder= {locale('common_A_Tushaal.A_Tushaalin tuhai')} />
                                </Form.Item>
                                <Form.Item
                                    label= {locale('common_A_Tushaal.Uildluud')}
                                    name={'actions'}
                                >
                                    <div className={'actions'}>
                                        {/*{*/}
                                        {/*    formattedActionsArray().map((c, i) =>*/}
                                        {/*        c.actions.some((ca) => company.actions.indexOf(ca.key) > -1) ?*/}
                                        {/*            <div key={uuidv4()}>*/}
                                        {/*                <Divider />*/}
                                        {/*                <label style={{ color: "#808080" }}>*/}
                                        {/*                    {c.value}*/}
                                        {/*                </label>*/}
                                        {/*                <br/>*/}
                                        {/*                <br/>*/}
                                        {/*                <Checkbox.Group options={c.actions.map(cc => {*/}
                                        {/*                    if(company.actions.indexOf(cc.key) > -1){*/}
                                        {/*                        return {*/}
                                        {/*                            label: cc.value,*/}
                                        {/*                            value: cc.key,*/}
                                        {/*                            onChange: (e) => this.checkAction(e),*/}
                                        {/*                            disabled: (((company || {}).actions || []).indexOf(cc.key) === -1)*/}
                                        {/*                        }*/}
                                        {/*                    } else {*/}
                                        {/*                        return null;*/}
                                        {/*                    }*/}
                                        {/*                }).filter(cc => cc)} value={this.state.actions}/>*/}
                                        {/*                {(i + 1) === formattedActionsArray().length && <Divider />}*/}
                                        {/*            </div>*/}
                                        {/*            : null*/}
                                        {/*    )*/}
                                        {/*}*/}
                                        <RoleActions />
                                    </div>
                                </Form.Item>
                                {
                                    ((this.state.selectedJobDescription || {}).title) ?
                                        <div>Сонгосон ажлын байрны тодорхойлолт: <b>{(this.state.selectedJobDescription || {}).title}</b></div>
                                        :
                                        null
                                }
                                <Form.Item
                                    label= {locale('common_A_Tushaal.A_B_todorhoilolt')}
                                    rules={[
                                        {
                                            required: ((this.state.selectedJobDescription || {}).title || '') === '',
                                            message: locale('common_A_Tushaal.Ajlin bairnii_T songon uu'),
                                        },
                                    ]}
                                    name={'jobDescription'}
                                >
                                    <Select
                                        showArrow={false}
                                        key={'jobDescriptionSelect'}
                                        showSearch={true}
                                        searchValue={this.state.searchJobDescription}
                                        allowClear={false}
                                        style={{ width: '100%' }}
                                        placeholder= {locale('common_A_Tushaal.A_B_T_nereer haih')}
                                        loading={gettingJobDescriptions}
                                        onSelect={(e) => this.findJobDescriptions(e)}
                                        onSearch={this.searchJobDescriptions.bind(this)}
                                        notFoundContent={<Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_A_Tushaal.A_B_T baihgui baina')}</span>} />}
                                        filterOption={false}
                                        value={(this.state.jobDescription || {})._id}
                                    >
                                        {
                                            (jobDescriptions || []).map(desc => <Select.Option value={desc._id} key={desc._id}>{desc.title}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                                {
                                    ((this.state.selectedOrientation || {}).title) ?
                                        <div>Сонгосон чиглүүлэх хөтөлбөр: <b>{(this.state.selectedOrientation || {}).title}</b></div>
                                        :
                                        null
                                }
                                <Form.Item
                                    label= {locale('common_A_Tushaal.CH_Hotolbor')}
                                    rules={[
                                        {
                                            required: ((this.state.selectedOrientation || {}).title || '') === '',
                                            message: locale('common_A_Tushaal.Chigluuleh hotolbor songon uu'),
                                        },
                                    ]}
                                    name={'orientation'}
                                >
                                    <Select
                                        showArrow={false}
                                        key={'orientationSelect'}
                                        showSearch={true}
                                        searchValue={this.state.searchOrientation}
                                        allowClear={false}
                                        style={{ width: '100%' }}
                                        placeholder= {locale('common_A_Tushaal.CH_H_nereer haih')}
                                        loading={gettingOrientation}
                                        onSelect={(e) => this.findOrientation(e)}
                                        defaultActiveFirstOption={false}
                                        onSearch={this.searchOrientation.bind(this)}
                                        notFoundContent={<Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_A_Tushaal.CH_H baihgui baina')}</span>} />}
                                        filterOption={false}
                                        value={(this.state.orientation || {})._id}
                                    >
                                        {
                                            (orientation || []).map(orien => <Select.Option value={orien._id} key={orien._id}>{orien.title}</Select.Option>)
                                        }
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Drawer>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Roles);