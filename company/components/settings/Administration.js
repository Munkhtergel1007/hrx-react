import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {locale} from "../../lang";
import config, {
    hasAction,
    printStaticRole,
} from "../../config";
import {
    PlusOutlined
} from '@ant-design/icons';
import {
    Layout, Menu, Button, Spin,
    Form, Row, Col, Input,
    Typography, List, Avatar,
    Select, DatePicker, Modal,
    Popconfirm,
} from 'antd';
import {
    getAllAdmins,
    createHrManager, derankEmployee,
    createAttendanceCollector, getAllRoles,
} from '../../actions/settings_actions';
import { getAllEmployees, getEmployeeStandard} from '../../actions/employee_actions'
import {DeleteOutlined} from "@ant-design/icons";
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Administration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            staticRole: '',
            modalVisible: false,
            employee: {},
            username: '',
            password: '',
        }
    }
    componentDidMount() {
        const {main: {employee}} = this.props;
        if(!hasAction(['edit_roles'], employee)){
            this.props.history.replace('/not-found');
        }else {
            this.props.dispatch(getAllAdmins())
            this.props.dispatch(getEmployeeStandard({staticRole: 'employee'}))
        }
    }
    handleCancel(){
        this.setState({
            staticRole: '',
            modalVisible: false,
            employee: {},
            username: '',
            password: '',
        })
    }
    chooseEmployee(e){
        const {
            settings: {employees}
        } = this.props
        let empIdx = employees.findIndex(c => c._id === e)
        this.setState({
            employee: employees[empIdx]
        })
    }
    submitForm(vals){
        if(this.state.staticRole === 'hrManager'){
            this.props.dispatch(createHrManager(vals)).then(c => {
                if(c.json.success){
                    this.handleCancel()
                }
            })
        } else if (this.state.staticRole === 'attendanceCollector'){
            this.props.dispatch(createAttendanceCollector(vals)).then(c => {
                if(c.json.success){
                    this.handleCancel()
                }
            })
        }
    }
    render(){
        const {
            main: {company},
            settings: {
                gettingAdmins,
                admins,
                employees,
                changingAdmins
            }
        } = this.props
        const roles = ['hrManager', 'attendanceCollector']
        return (
            <React.Fragment>
                {!gettingAdmins ?
                    <Row justify="center" align="center" style={{width: '100%'}} className={'settings-roles administration'}>
                        <Col span={18}>
                            <div style={{width: '100%', height: 30, marginBottom: 30}}>
                                <Button onClick={() => this.setState({modalVisible: true})} type='primary' style={{float: 'right'}} icon={<PlusOutlined />} loading={changingAdmins}>
                                    {locale('common_alba.Nemeh')}
                                </Button>
                            </div>
                            <List
                                itemLayout='horizontal'
                                dataSource={admins}
                                renderItem={item => (
                                    <List.Item
                                        className={'administrationLi'}
                                        extra={
                                            item.staticRole !== 'attendanceCollector' && item.staticRole !== 'lord' && (item.company || 'a').toString() === (company._id || '').toString() ?
                                                <Popconfirm
                                                    title={'Энэ хэрэглэгчийн албан тушаалыг ажилтан болгох уу?'}
                                                    okText={'Тийм'} cancelText={'Үгүй'}
                                                    onConfirm={() => this.props.dispatch(derankEmployee({_id: item._id}))}
                                                >
                                                    <Button className={'buttonAdmins'} icon={<DeleteOutlined />} danger type={'primary'} />
                                                </Popconfirm>
                                                :
                                                null
                                        }
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={'/images/default-avatar.png'} />}
                                            title={item.staticRole === 'attendanceCollector' ?
                                                <span>{(item.user || {}).username}</span> : <span>{(item.user || {}).first_name} {(item.user || {}).last_name}</span>
                                            }
                                            description={printStaticRole(item.staticRole)}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Col>
                    </Row>
                : <Spin/>
                }
                <Modal
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={[
                        <Button
                            type='default'
                            onClick={() => this.state.staticRole === '' ? this.handleCancel() : this.setState({staticRole: ''})}
                        >
                            {this.state.staticRole === '' ? locale('common_alba.Bolih') : locale('common_alba.Butsah') }
                        </Button>,
                        this.state.staticRole !== '' ?
                            <Button
                                type='primary'
                                htmlType='submit'
                                form={this.state.staticRole}
                                loading={changingAdmins}
                            >
                                {locale('common_alba.Nemeh')}
                            </Button>
                        : null
                    ]}
                >
                    {
                        this.state.staticRole === '' ?
                            roles.map(c => (
                                <Row
                                    key={Math.random()}
                                    style={{justifyContent: 'center', marginBottom: 10}}
                                >
                                    <Button
                                        type='primary'
                                        icon={<PlusOutlined />}
                                        onClick={() => this.setState({staticRole: c})}
                                    >
                                        {printStaticRole(c)}
                                    </Button>
                                </Row>
                            ))
                        : this.state.staticRole === 'hrManager' ?
                            <Form
                                layout='vertical'
                                id='hrManager'
                                onFinish={this.submitForm.bind(this)}
                            >
                                <Form.Item
                                    label= {locale('common_alba.Ajiltan')}
                                    name='employee'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Ажилтан сонгоно уу'
                                        }
                                    ]}
                                >
                                    <Select
                                        placeholder= {locale('common_alba.A Songoh')}
                                        onChange={e => this.chooseEmployee(e)}
                                    >
                                        {employees.map(c => (
                                            <Select.Option value={c._id}>{`${c.user.first_name} ${c.user.last_name}`}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                {
                                    Object.keys(this.state.employee).length !== 0 ?
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar src={'/images/default-avatar.png'} />}
                                                title={<span>{((this.state.employee || {}).user || {}).first_name} {((this.state.employee || {}).user || {}).last_name}</span>}
                                                description={printStaticRole((this.state.employee || {}).staticRole)}
                                            />
                                        </List.Item>
                                    : null
                                }
                            </Form>
                        : this.state.staticRole === 'attendanceCollector' ?
                            <Form
                                layout='vertical'
                                id='attendanceCollector'
                                onFinish={this.submitForm.bind(this)}
                            >
                                <Form.Item
                                    name='username'
                                    label= {locale('common_alba.Nevtreh ner')}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Нэвтрэх нэр оруулна уу'
                                        }
                                    ]}
                                >
                                    <Input value={this.state.username} onChange={e => this.setState({username: e.target.value})} />
                                </Form.Item>
                                <Form.Item
                                    name='password'
                                    label= {locale('common_alba.Nuuts ug')}
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Нууц үг оруулна уу'
                                        }
                                    ]}
                                >
                                    <Input.Password value={this.state.password} onChange={e => this.setState({password: e.target.value})} />
                                </Form.Item>
                            </Form>
                        : null
                    }
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Administration);