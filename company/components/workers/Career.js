import React from "react";
import {
    insertEmpViolation, onChangeHandler,
    startEdit,
    stopEdit,
    unMountViolation,
    uploadViolation,
    deleteEmpViolation,
    getViolationInfo,
    getUserRewards,
    editUserRewards,
    deleteUserRewards
} from "../../actions/employee_actions";
import Cookies from "js-cookie";
import { locale } from "../../lang";
import {hasAction, isValidDate, msg, string} from "../../config";
import {Button, Col, DatePicker, Divider, Form, Input, Popconfirm, Row, Table, Upload} from "antd";
import {
    DeleteOutlined,
    EditOutlined, UploadOutlined
} from '@ant-design/icons';
import moment from "moment";
import {connect} from 'react-redux'
const reducer = ({main, employee}) => ({main, employee});

class CareerComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visibleReward: false,
            reward_date: '',
            reward_name: '',
            reward_ground: '',
            reward_id: ''
        }
    }
    componentDidMount() {
        const {
            dispatch,
            employee: {
                empSingle
            }
        } = this.props
        dispatch(getViolationInfo({emp: (empSingle.user || {})._id }))
        dispatch(getUserRewards((empSingle.user || {})._id))
    };
    handleCancel(){
        this.setState({
            visibleReward: false,
            reward_date: '',
            reward_name: '',
            reward_ground: '',
            reward_id: ''
        })
    }
    componentWillUnmount() {
        this.props.dispatch(unMountViolation());
    }

    insertViolationInfo(vals) {
        const {
            dispatch,
            employee: {
                empSingle = {},
                editViolation
            }
        } = this.props;
        let values = Object.values(editViolation);
        if(values.some((c) => string(c) !== '')){
            if(!editViolation.aboutViolation || editViolation.aboutViolation === '') {
                return msg('error', 'Зөрчлийн тухай мэдээлэл оруулна уу')
            } else if(!editViolation.date || isValidDate(editViolation.aboutViolation)){
                return msg('error', 'Зөрчлийн огноо оруулна уу')
            } else if(!editViolation.tushaalText || editViolation.tushaalText === '') {
                return msg('error', 'Тушаал оруулна уу')
            } else {
                dispatch(insertEmpViolation({...editViolation, user: (empSingle.user || {})._id } ))
            }
        }
    }
    uploadViolation(file) {
        console.log(file)
        this.props.dispatch(uploadViolation(file.file))
    }
    // editViolationInfoHandler(id, action) {
    //     const {
    //         dispatch,
    //         employee: {
    //             empSingle = {}
    //         }
    //     } = this.props
    //     dispatch(editEmpViolation({id: id, emp: empSingle.user._id, comp: empSingle.company, action: action}))
    // }
    startEdit(vals) {
        this.props.dispatch(startEdit({...vals}))
    }
    stopEdit() {
        this.props.dispatch(stopEdit())
    }
    onChangeHandler(e, name) {
        const {dispatch} = this.props
        if(name === 'date') {
            dispatch(onChangeHandler({name:name, value: e}));
        } else {
            dispatch(onChangeHandler({name:e.target.name, value: e.target.value}));
        }
    }
    submitUserReward(vals){
        const {
            dispatch,
            employee: {
                empSingle = {}
            }
        } = this.props
        dispatch(editUserRewards({
            ...vals,
            id: this.state.reward_id,
            user: (empSingle.user || {})._id
        })).then(c => {
            if(c.json.success){
                this.handleCancel()
            }
        })
    }
    render() {
        const {
            employee: {
                insertingViolation,
                violation,
                gettingViolation,
                editViolation,
                visible,
                empSingle,
                rewards,
                gettingRewards
            },
            main:{employee}
        } = this.props
        // let fields = [
        //     {
        //         name: 'name',
        //         value: editingViolation ? editViolation.aboutViolation : null
        //     },
        //     {
        //         name: 'date',
        //         value: editingViolation ? editViolation.date : null
        //     },
        //     {
        //         name: 'tushaalText',
        //         value: editingViolation ? editViolation.tushaalText : null
        //     },
        //     {
        //         name: 'tushaalFile',
        //         value: editingViolation ? editViolation.tushaalFile : null
        //     },
        // ]
        let hadAction = hasAction(['create_employee', 'edit_employee'], employee);
        return (
            <React.Fragment>
                {/*Reward*/}
                <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                    <Col span={20}>
                        <div style={{margin: '50px auto 30px'}}>
                            <Divider orientation="left" plain>
                                <b style={{fontSize: 16}}>{locale("employee_single.reward.base")}</b>
                            </Divider>
                        </div>
                        <Table
                            dataSource={rewards}
                            size='small'
                            bordered={true}
                            pagination={false}
                            loading={gettingRewards}
                            columns={[
                                {
                                    title: '№',
                                    key: '№',
                                    render: (record, txt, idx) => idx + 1
                                },
                                {
                                    title: locale("common_employee.first_name"),
                                    key: 'name',
                                    render: record => record.reward_name
                                },
                                {
                                    title: locale("employee_single.reward.date"),
                                    key: 'date',
                                    render: record => record.date && moment(record.date).format('YYYY-MM-DD')
                                },
                                {
                                    title: locale("common_employee.uildel"),
                                    key: 'actions',
                                    render: record => (
                                        <div>
                                            <Button
                                                size='small'
                                                onClick={() => this.setState({
                                                    visibleReward: true,
                                                    reward_date: record.date,
                                                    reward_name: record.reward_name,
                                                    reward_ground: record.reward_ground,
                                                    reward_id: record._id
                                                })}
                                                style={{marginRight: 10}}
                                            >
                                               {locale("common_employee.edit")}
                                            </Button>
                                            <Popconfirm
                                                title={locale("employee_single.reward.date")}
                                                okText={locale("yes")}
                                                cancelText={locale("yes")}
                                                onConfirm={() => this.props.dispatch(deleteUserRewards({
                                                    user: this.props.employee.empSingle.user._id,
                                                    id: record._id
                                                }))}
                                            >
                                                <Button
                                                    type='danger'
                                                    size='small'
                                                >
                                                    {locale("common_employee.delete")}
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    )
                                }
                            ]}
                            footer={() =>
                                this.state.visibleReward ?
                                    <Form
                                        size='small'
                                        layout='vertical'
                                        onFinish={this.submitUserReward.bind(this)}
                                        fields={[
                                            {name: 'reward_name', value: this.state.reward_name},
                                            {name: 'reward_date', value: isValidDate(this.state.reward_date) ? moment(this.state.reward_date) : null},
                                            {name: 'reward_ground', value: this.state.reward_ground}
                                        ]}
                                    >
                                        <Row>
                                            <Col span={12} style={{paddingRight: 10}}>
                                                <Form.Item
                                                    label={locale("employee_single.reward.name")}
                                                    name='reward_name'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.reward.enterName")
                                                        }
                                                    ]}
                                                >
                                                    <Input value={this.state.reward_name} onChange={(e) => this.setState({reward_name: e.target.value})} placeholder='Тушаалын нэр' />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12} style={{paddingLeft: 10}}>
                                                <Form.Item
                                                    label='Шагнагдсан огноо'
                                                    name='reward_date'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: locale("employee_single.reward.date")
                                                        }
                                                    ]}
                                                >
                                                    <DatePicker style={{width: '100%'}} value={this.state.reward_date} onChange={(e) => this.setState({reward_date: e})} placeholder='Шагнагдсан огноо' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={12} style={{paddingRight: 10}}>
                                                <Form.Item
                                                    label={locale("employee_single.reward.based")}
                                                    name='reward_ground'
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: 'Шагнагдсан үндэслэл оруулна уу'
                                                        }
                                                    ]}
                                                >
                                                    <Input.TextArea value={this.state.reward_ground} onChange={(e) => this.setState({reward_ground: e.target.value})} placeholder='Шагнагдсан үндэслэл' />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Col span={24} style={{ textAlign: 'right' }}>
                                            <Button
                                                type={'default'}
                                                // loading={insertingViolation}
                                                onClick={this.handleCancel.bind(this)}
                                                style={{marginRight: 10}}
                                            >
                                                Болих
                                            </Button>
                                            <Button
                                                // onClick={() => this.setState({visibleReward: true})}
                                                type='primary'
                                                htmlType='submit'
                                                size='small'
                                            >
                                                {this.state.reward_id === '' ? 'Шагнал нэмэх' : 'Шинэчлэх'}
                                            </Button>
                                        </Col>
                                    </Form>
                                : <Col span={24} style={{textAlign: 'right'}}>
                                    <Button
                                        onClick={() => this.setState({visibleReward: true})}
                                        type='primary'
                                        size='small'
                                    >
                                        Шагнал нэмэх
                                    </Button>
                                </Col>
                            }
                        />
                    </Col>
                </Row>
                {/*Violation*/}
                <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                    <Col span={20}>
                        <div style={{margin: '50px auto 30px'}}>
                            <Divider orientation="left" plain>
                                <b style={{fontSize: 16}}>Зөрчил</b>
                            </Divider>
                        </div>
                        <Table
                            size={'small'}
                            bordered={true}
                            footer={() =>
                                visible ?
                                    <Form
                                        size={'small'}
                                        layout="vertical"
                                        // fields={fields}
                                        onFinish={this.insertViolationInfo.bind(this)}
                                    >
                                        <p><b>Зөрчил нэмэх</b></p>
                                        <div className={'main-info'}>
                                            <div className={'info_inps'}>
                                                <Row>
                                                    <Col span={12} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label="Зөрчлийн тухай"
                                                            // name='aboutViolation'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Зөрчлийн тухай оруулна уу.'
                                                                }
                                                            ]}
                                                        >
                                                            <Input name='aboutViolation' value={editViolation.aboutViolation} onChange={this.onChangeHandler.bind(this)} placeholder={'Зөрчлийн тухай'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={12} style={{paddingLeft: 10}}>
                                                        <Form.Item
                                                            label="Огноо"
                                                            // name='date'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Зөрчлийн огноо сонгоно уу.'
                                                                }
                                                            ]}
                                                        >
                                                            <DatePicker name='date' value={editViolation.date ? moment(editViolation.date) : null} onChange={(e, date) => this.onChangeHandler(date, 'date')} placeholder='Огноо сонгох' style={{width: '100%'}}/>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={12} style={{paddingRight: 10}}>
                                                        <Form.Item
                                                            label="Тушаал"
                                                            // name='tushaalText'
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Тушаал оруулна уу.'
                                                                }
                                                            ]}
                                                        >
                                                            <Input.TextArea name='tushaalText' value={editViolation.tushaalText} onChange={this.onChangeHandler.bind(this)} placeholder={'Тушаал'}/>
                                                        </Form.Item>
                                                    </Col>
                                                    {/*<Col span={12} style={{paddingLeft: 10}}>*/}
                                                    {/*    <Form.Item*/}
                                                    {/*        label="Тушаал файл"*/}
                                                    {/*    >*/}
                                                    {/*        <Upload*/}
                                                    {/*            showUploadList={false}*/}
                                                    {/*            accept={".pdf"}*/}
                                                    {/*            customRequest={(e) => this.uploadViolation(e)}*/}
                                                    {/*        >*/}
                                                    {/*            <Button*/}
                                                    {/*                size='small'*/}
                                                    {/*                icon={<UploadOutlined/>}*/}
                                                    {/*            >*/}
                                                    {/*                Тушаал оруулах*/}
                                                    {/*            </Button>*/}
                                                    {/*        </Upload>*/}
                                                    {/*    </Form.Item>*/}
                                                    {/*</Col>*/}
                                                </Row>
                                                <Col span={24} style={{ textAlign: 'right' }}>
                                                    <Button
                                                        type={'default'}
                                                        loading={insertingViolation}
                                                        onClick={this.stopEdit.bind(this)}
                                                        style={{marginRight: 10}}
                                                    >
                                                        Болих
                                                    </Button>
                                                    <Button
                                                        htmlType="submit"
                                                        type={'primary'}
                                                        loading={insertingViolation}
                                                        disabled={insertingViolation || !hadAction}
                                                    >
                                                        Зөрчил нэмэх
                                                    </Button>
                                                </Col>
                                            </div>
                                        </div>
                                    </Form>
                                    : <Col span={24} style={{textAlign: 'right'}}>
                                        <Button
                                            onClick={this.startEdit.bind(this, {})}
                                            type='primary'
                                            size='small'
                                        >
                                            Зөрчил нэмэх
                                        </Button>
                                    </Col>
                            }
                            dataSource={violation || []}
                            pagination={false}
                            loading={gettingViolation}
                            columns={[
                                {
                                    title: '№',
                                    key: '№',
                                    width: 50,
                                    align: 'center',
                                    render: (record, text, idx) => idx + 1
                                },
                                {
                                    title: 'Зөрчил',
                                    key: 'Зөрчил',
                                    align: 'center',
                                    render: (record) => record.aboutViolation
                                },
                                {
                                    title: 'Огноо',
                                    key: 'Огноо',
                                    align: 'center',
                                    render: (record) => record.date && moment(record.date).format('YYYY-MM-DD')
                                },
                                {
                                    title: 'Тушаал',
                                    key: 'Тушаал',
                                    align: 'center',
                                    render: (record) => record.tushaalText
                                },
                                {
                                    title: 'Үйлдэл',
                                    key: 'Үйлдэл',
                                    align: 'center',
                                    render: (record) => (
                                        <div>
                                            <Button
                                                icon={<EditOutlined/>}
                                                style={{marginRight: '10px'}}
                                                size='small'
                                                onClick={this.startEdit.bind(this, record)}
                                            >
                                                Засах
                                            </Button>
                                            <Popconfirm
                                                title='Зөрчил устгах уу?'
                                                okText='Тийм'
                                                cancelText='Үгүй'
                                                onConfirm={() => this.props.dispatch(deleteEmpViolation({id: record._id, user: empSingle.user._id}))}
                                            >
                                                <Button
                                                    icon={<DeleteOutlined/>}
                                                    size='small'
                                                    type='danger'
                                                >
                                                    Устгах
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(CareerComponent)