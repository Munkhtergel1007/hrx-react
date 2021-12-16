import React, {Fragment} from "react";
import { connect } from 'react-redux';
import { locale } from "../../lang";
import Cookies from "js-cookie";

import {
    Route,
    Link
} from 'react-router-dom';
import {
    getAllEmployees, 
    deleteEmployee, 
    getSubsidiaryCompanies, 
    clearExcel,
    insertEmployees,
    uploadExcel
} from '../../actions/employee_actions'
import {getAllRoles} from "../../actions/settings_actions";
import config, {actionsArray, formattedActionsArray, hasAction, isValidDate, printStaticRole,printStaticRoleRus,printStaticRoleKaz} from "../../config";
import {
    PictureOutlined,
    NumberOutlined,
    ControlOutlined,
    CreditCardOutlined,
    ApiOutlined,
    CarryOutOutlined,
    PlusOutlined,
    DeleteOutlined,
    UploadOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Button,
    Row,
    Col,
    Input, Space,
    Table, Popconfirm, Form, Select, Popover, Typography,
    Card, Tooltip, Modal
} from 'antd';
const {SubMenu} = Menu;
const {Slider, Content} = Layout;
import moment from "moment";
const reducer = ({ main, employee, settings }) => ({ main, employee, settings });


class Workers extends React.Component {
    constructor(props){
        super(props);
        this.filterEmployees = this.filterEmployees.bind(this)
        this.state = {
            pageNum: 0,
            pageSize: 20,
            search: '',
            staticRole: 'all',
            role: 'all',
            company: 'all',
            import: false
        };
        document.title = 'Ажилтан  |  TATATUNGA';
    }
    componentDidMount() {
        const {
            dispatch
        } = this.props
        let pagination = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        }
        dispatch(getSubsidiaryCompanies())
        dispatch(getAllEmployees(pagination))
        dispatch(getAllRoles())
    }
    paginationChangeHandler(e) {
        this.setState({pageNum: e.current - 1})
        let pagination = {
            pageNum: e.current - 1,
            pageSize: this.state.pageSize
        }
        this.props.dispatch(getAllEmployees(pagination))
    }
    deleteEmployee(record) {
        const {
            dispatch
        } = this.props
        dispatch(deleteEmployee({emp: record._id}))
    }
    filterEmployees(vals) {
        // console.log(vals)
        this.props.dispatch(getAllEmployees(vals))
    }
    onClearExcel(){
        this.setState({import: false}, () => this.props.dispatch(clearExcel()));
    }
    importExel(event){
        if(event.target.files && (event.target.files[0] || {}).name){
            this.props.dispatch(uploadExcel(event.target.files));
        }
    }
    insert(){
        const {employee:{importedExcel, importLoading, imported}} = this.props;
        if(importLoading) return config.get('emitter').emit('warning', ("Уншиж байна!"));
        if(!imported) return config.get('emitter').emit('warning', ("Хуулагдсангүй!"));
        if(importedExcel && (importedExcel || []).length > 0){
            this.props.dispatch(insertEmployees({data: importedExcel})).then(c => {
                if((c.json || {}).success){
                    this.onClearExcel();
                    window.location.reload();
                }
            });
        }else{
            return config.get('emitter').emit('warning', ("Хоосон байна!"));
        }
    }
    render(){
        const {
            employee:{
                gettingAllEmployees,
                employees,
                all,
                gettingSubsidiaryCompanies,
                companies,
                importLoading,
            },
            main:{
                employee
            },
            settings: {
                roles,
                gettingRoles
            }
        } = this.props;
        const staticRoles = ['lord', 'hrManager', 'employee']
        let pagination = {
            total : all,
            current: this.state.pageNum + 1,
            pageSize : this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false,
            size: 'small'
        }
        const columns = [
            {
                title: '№',
                key: '№',
                width: 100,
                render: (text, record, idx) => (
                    (this.state.pageNum * this.state.pageSize) + idx + 1
                )
            },
            {
                title: locale("common_employee.firstname"),
                key: 'Нэр',
                ellipsis: true,
                render: (record) => (
                    <Tooltip
                        title={(record.user || {}).first_name}
                    >
                        {
                            hasAction(['edit_employee', 'create_employee'], employee) &&
                            ((record.company || {})._id || 'as').toString() === (employee.company || '').toString() ?
                                record.staticRole !== 'lord' ?
                                    <Link to={`/worker/${record._id}/anket`}>
                                        <span style={{color:'#1890ff'}}>{(record.user || {}).first_name}</span>
                                    </Link>
                                    :
                                    (record.user || {}).first_name
                                :
                                (record.user || {}).first_name
                        }
                    </Tooltip>
                )
            },
            {
                title: locale("common_employee.lastname"),
                key: 'Овог',
                ellipsis: true,
                render: (record) => (
                    <Tooltip
                        title={(record.user || {}).last_name}
                    >
                        {(record.user || {}).last_name}
                    </Tooltip>
                )
            },
            {
                title: locale("common_employee.company"),
                key: 'company',
                render: (record) =>
                    <Tooltip
                        title={(record.company || {}).name}
                    >
                        {(record.company || {}).name}
                    </Tooltip>
            },
            {
                title: locale("common_employee.position"), 
                key: 'Албан тушаал',
                render: (record) => (
                    record.role ?
                        record.role.name
                    : record.staticRole ? (
                        this.props.main.domain.toLowerCase() === "tapsir.com" || this.props.main.domain.toLowerCase() === "tapsir.mn" ?
                        <>
                            { Cookies.get("lang") === "rs" ? 
                            <> 
                                {printStaticRoleRus((record.staticRole || ''))}
                            </>
                            :
                            <>
                                {printStaticRoleKaz((record.staticRole || ''))}
                            </>
                            }
                        </>
                        :
                        <>
                            {printStaticRole((record.staticRole || ''))}
                        </>
                    )
                    : null
                )
            },
            {
                title: locale("common_employee.phone"),
                key: 'Утас',
                render: (record) => (
                    (record.user || {}).phone
                )
            },
            {
                title: locale("common_employee.email"),
                key: 'Мэйл',
                width: 200,
                ellipsis: true,
                render: (record) => (
                    <Tooltip
                        title={(record.user || {}).email}
                    >
                        {(record.user || {}).email}
                    </Tooltip>
                )
            },
            {
                title: locale("common_employee.started_working_date"),
                key: 'Ажиллаж эхэлсэн огноо',
                render: (record) => record.workFrom ? moment(record.workFrom).format('YYYY-MM-DD') : null
            },
            {
                title: locale("common_employee.status"),
                render: (record) => { 
                    if(record.vacation){
                        const pop = (
                            <div>
                                <div>{locale("common_employee.started_date")}: {moment(record.vacation.starting_date).format('YYYY-MM-DD')}</div>  
                                <div>{locale("common_employee.end_date")}: {moment(record.vacation.ending_date).format('YYYY-MM-DD')}</div>  
                            </div>
                        )
                        return <Popover content={pop}><Typography.Text type='danger' >{locale("common_employee.on_vacation")}</Typography.Text></Popover> 
                    }
                    return <Typography.Text type='success'>{locale("common_employee.working")}</Typography.Text>
                }
            },
            // hasAction(['delete_employee'], employee) ?
            //     {
            //         title: 'Үйлдэл',
            //         key: 'Үйлдэл',
            //         width: '200px',
            //         render: (record) => (
            //             ((record.company || {})._id || 'as').toString() === (employee.company || '').toString() ?
            //             <div>
            //                 <Popconfirm
            //                     placement="bottomRight"
            //                     title={`Ажилтанд хасалт хийхийг зөвшөөрч байна уу?`}
            //                     onConfirm={this.deleteEmployee.bind(this, record)}
            //                     okText="Тийм"
            //                     cancelText="Үгүй"
            //                 >
            //                     {
            //                         record.staticRole !== 'lord' ?
            //                             <Button
            //                                 type={'primary'}
            //                                 size='small'
            //                                 danger
            //                                 icon={<DeleteOutlined/>}
            //                             >
            //                                 Хасах
            //                             </Button>
            //                             :
            //                             null
            //                     }
            //                 </Popconfirm>
            //             </div>
            //             :
            //             null
            //         )
            //     }
            // : {}
        ]
        const title = (
            <Row>
                <Col>
                    {locale("common_employee.employees")}
                </Col>
            </Row>
        )
        return (
            <Card
                title={title}
                extra={
                    hasAction(['create_employee'], employee) ?
                        <Space direction={'horizontal'}>
                            {/* <Button
                                icon={<UploadOutlined />}
                                onClick={() => this.setState({import: true})}
                            >
                                Import
                            </Button> */}
                            <Link to="/worker/employee/new">
                                <Button type='primary' icon={<PlusOutlined />}> {locale("common_employee.employee_add")}</Button>
                            </Link>
                        </Space>
                        :
                        null
                }
            >
                <div style={{marginBottom: 20}}>
                    <Form
                        layout='inline'
                        onFinish={this.filterEmployees}
                        fields={[
                            {name: 'first_name', value: this.state.first_name},
                            {name: 'staticRole', value: this.state.staticRole},
                            {name: 'role', value: this.state.role},
                            {name: 'company', value: this.state.company},
                        ]}
                    >
                        <Form.Item
                            name='search'
                        >
                            <Input
                                value={this.state.search}
                                onChange={(e) => this.setState({search: e.target.value})}
                                placeholder={locale("common_employee.employee_info")}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item
                            name='staticRole'
                        >
                            <Select
                                value={this.state.staticRole}
                                onChange={(e) => this.setState({staticRole: e})}
                                style={{width: 200}}
                                placeholder={locale("common_employee.position")}
                            >
                                <Select.Option value='all' key={'all'}>{locale("common_employee.all")}</Select.Option>
                                {staticRoles.map(c => (
                                    <Select.Option value={c} key={c}> 
                                    {
                                     this.props.main.domain.toLowerCase() === "tapsir.com" || this.props.main.domain.toLowerCase() === "tapsir.mn" ?
                                     <>
                                        { Cookies.get("lang") === "rs" ? 
                                        <> 
                                            {printStaticRoleRus(c)}
                                        </>
                                        :
                                        <>
                                           {printStaticRoleKaz(c)}
                                        </>
                                        }
                                     </>
                                     :
                                     <>
                                        {printStaticRole(c)}
                                     </>
                                    }
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='role'
                        >
                            {roles && roles.length>0?
                                <Select
                                    loading={gettingRoles}
                                    value={this.state.role}
                                    onChange={(e) => this.setState({role: e})}
                                    style={{width: 200}}
                                    placeholder='Үүрэг'
                                >
                                    <Select.Option value='all' key={'all'}>{locale("common_employee.all")}</Select.Option>
                                    {
                                        roles.map(c => (
                                            <Select.Option value={c._id} key={c._id}>{c.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                                :
                                null
                            }
                        </Form.Item>
                        <Form.Item
                            name='company'
                        >
                            {companies && companies.length>0?
                                <Select
                                    loading={gettingSubsidiaryCompanies}
                                    value={this.state.company}
                                    onChange={(e) => this.setState({company: e})}
                                    style={{width: 200}}
                                    placeholder='Компани'
                                >
                                    <Select.Option value='all' key={'all'}>{locale("common_employee.all")}</Select.Option>
                                    {
                                        companies.map(c => (
                                            <Select.Option value={c._id} key={c._id}>{c.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                                :
                                null
                            }
                        </Form.Item>
                        <Button
                            htmlType='submit'
                        >
                            {locale("common_employee.search")}
                        </Button>
                    </Form>
                </div>
                <Table 
                    onChange={this.paginationChangeHandler.bind(this)}
                    rowKey={(record) => {return record._id}}
                    dataSource={employees} columns={columns} 
                    loading={gettingAllEmployees} 
                    pagination={pagination} 
                />
                <Modal
                    visible={this.state.import}
                    destroyOnClose={true}
                    title={'Import'}
                    onCancel={() => this.onClearExcel()}
                    footer={
                        <>
                            <Button
                                onClick={() => this.onClearExcel()}
                            >
                                {locale("common_employee.close")}
                            </Button>
                            <Button type={'primary'} onClick={() => this.insert()} loading={importLoading || gettingAllEmployees}>
                                Import
                            </Button>
                        </>
                    }
                >
                    <input type='file' accept=".csv,.xlsx,.xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        onChange={this.importExel.bind(this)}
                    />
                </Modal>
            </Card>
        )
    }
}

export default connect(reducer)(Workers);