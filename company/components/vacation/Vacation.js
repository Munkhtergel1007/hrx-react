import React from 'react'
import {connect} from 'react-redux'
import config, {hasAction, isId, isValidDate, msg, printStaticRole, string, uuidv4} from "../../config";
import moment from 'moment'
import {getAllEmployees} from "../../actions/employee_actions";
import {getAllVacations, changeCompanyVacation, respondToVacationRequest} from "../../actions/vacation_actions";
import {
    Button,
    Card,
    Col,
    Drawer,
    Empty,
    Form,
    Row,
    Select,
    Spin,
    Table,
    DatePicker,
    Popconfirm,
    Tag,
    Modal,
    Calendar,
    Badge,
    Typography,
    Space
} from "antd";
import {
    CheckCircleFilled,
    CheckCircleOutlined, CloseCircleFilled, CloseCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined,
    PlusOutlined
} from "@ant-design/icons";
import {editEmpBreak, getAllBreak} from "../../actions/break_actions";
import {locale} from "../../lang"

const {RangePicker} = DatePicker
const {Title, Text} = Typography
const reducer = ({employee, vacation, main}) => ({employee, vacation, main})

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
}

class Vacation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _id: '',
            starting_date: '',
            ending_date: '',
            employee: {
                emp: '',
                user: ''
            },
            visible: false,
            pageNum: 0,
            pageSize: 10,
            calendarVisible: false,
            selected_dates: [],
            first_name: '',
            last_name: ''
        }
    }
    componentDidMount() {
        const { dispatch, main:{employee} } = this.props
        if(!hasAction(['create_vacation'], employee)){
            this.props.history.replace('/not-found')
        } else {
            dispatch(getAllEmployees())
            dispatch(getAllVacations({pageSize: this.state.pageSize, pageNum: this.state.pageNum}))
        }
    }
    changeCompanyVacation(vals, action) {
        const {
            starting_date,
            ending_date,
            _id,
            employee
        } = this.state
        const {
            dispatch,
        } = this.props
        vals.employee = employee.emp;
        vals.user = employee.user;
        vals.starting_date = starting_date;
        vals.ending_date = ending_date;
        vals._id = _id;
        let values = Object.values(vals);
        if(action === 'delete') {
            dispatch(changeCompanyVacation({...vals, action})).then((c) => {
                if(c.json.success) {
                    this.setState({
                        _id: '',
                        employee: ''
                    })
                }
            })
        } else {
            if(values.some((c) => string(c) !== '')){
                if(vals.starting_date === '' || vals.ending_date === '') {
                    return msg('error', locale('common_vacation.eeljiin_amraltiin_hugatsaa_shalgana_uu'))
                } else if(!vals.employee || !vals.user) {
                    return msg('error', locale('common_vacation.ajiltan_songono_uu'))
                } else if(vals.employee && !isId(vals.employee) && vals.user && !isId(vals.user)) {
                    return msg('error', locale('common_vacation.ajiltan_shalgana_uu'))
                } else if(vals.starting_date && !isValidDate(vals.starting_date)) {
                    return msg('error', locale('common_vacation.eeljiin_amralt_ehleh_o_sh'))
                } else if(vals.ending_date && !isValidDate(vals.ending_date)) {
                    return msg('error', locale('common_vacation.eeljiin_amralt_duusah_o_sh'))
                } else {
                    dispatch(changeCompanyVacation(vals)).then((c) => {
                        if(c.json.success) {
                            this.setState({
                                visible: false,
                                employee: {},
                                _id: '',
                                starting_date: '',
                                ending_date: '',
                            })
                        }
                    })
                }
            }
        }
    }
    paginationChangeHandler(e) {
        this.setState({pageNum: e.current - 1})
        this.props.dispatch(getAllVacations({pageSize: this.state.pageSize, pageNum: e.current - 1}))
    }
    openModal(record) {
        const {
            employee: {
                empVacation
            }
        } = this.props
        let sortedDates = record.selected_dates.sort((a,b) => moment(a).format('YYYYMMDD') - moment(b).format('YYYYMMDD'))
        this.setState({
            calendarVisible: true,
            starting_date: moment(record.starting_date),
            ending_date: moment(record.ending_date),
            _id: record._id,
            selected_dates: sortedDates,
            first_name: record.employee.user.first_name,
            last_name: record.employee.user.last_name
        })
    }
    getListData(value, startDate, endDate) {
        let listData;
        const {
            selected_dates
        } = this.state
        let endVacDate = new Date(endDate)
        // if(value >= startDate && value < endVacDate.addDays(1)) {
            selected_dates.some((c) => moment(c).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) ?
                listData = [
                    {type: 'yes'}
                ]
                : listData = [
                    {type: 'no'}
                ]
        // }
        return listData || []
    }
    dateCellRender(startDate, endDate, value) {
        const listData = this.getListData(value, startDate, endDate)
        return (
            listData.map(item => (
                <div className='vacation-badge' >
                    <Title level={5}>{item.content}</Title>
                    {item.type === 'yes' ? <CheckCircleFilled className='calendar-icon-yes'/> : <CloseCircleFilled className='calendar-icon-no'/>}
                </div>
            ))
        )
    }
    disabledCalendarDate(start, end, current) {
        return (current < start) || (current > end)
    }
    handleCancel() {
        this.setState({
            calendarVisible: false,
            selected_dates: [],
            starting_date: '',
            ending_date: '',
            _id: '',
            last_name: '',
            first_name: ''
        })
    }
    respondToRequest(str){
        const {dispatch, main: {employee}} = this.props;
        dispatch(respondToVacationRequest({
            _id: this.state._id,
            status: str,
            respondedBy: employee._id
        })).then(c => {
            if(c.json.success){
                this.handleCancel()
            }
        })
    }
    dateFullCellRender(value, startDate, endDate) {
        const listData = this.getListData(value, startDate, endDate)
        let style = {
            backgroundColor: '#1A3452',
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            display: 'inline-flex',
            // lineHeight: 24,
            color: '#fff',
            paddingInline: '13px',
            margin: '5px',
            // display: 'inline-block',
            position: 'relative'
        }
        let style1 = {
            // backgroundColor: '#1A3452',
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            display: 'inline-flex',
            paddingInline: '13px',
            // lineHeight: 24,
            // color: '#fff',
            margin: '5px',
            // display: 'inline-block',
            position: 'relative'
        }
        // console.log(value)
        return (
            listData.map(item => (
                <div style={item.type === 'yes' ? style : style1} >
                    {moment(value).format('DD')}
                </div>
            ))
        )
    }
    render(){
        const {
            vacation: {
                gettingVacations,
                vacations,
                creatingVacation,
                all
            },
            employee: {
                employees
            }
        } = this.props
        function getStatus(stat) {
            let result = "";
            let color = "";
            switch (stat) {
                case 'idle':
                    result = locale('common_vacation.huleegdej_bui')
                    color = "default"
                    break
                case 'pending':
                    result = locale('common_vacation.huselt_irsen')
                    color = "processing"
                    break
                case "approved":
                    result = locale('common_vacation.zuwshuurugdsun')
                    color = "success"
                    break;
                case "declined":
                    result = locale('common_vacation.zuwshuurugduugui')
                    color = "error"
                    break;
                case 'amrahgui':
                    result = locale('common_vacation.amrahgui');
                    color = "error"
                    break
                default:
                    result = ''
                    color = "default"
            }
            return (
                <Tag
                    color={color}
                >
                    {result}
                </Tag>
            );
        }
        const columns = [
            {
                title: '№',
                key: '№',
                render: (record, text, idx) => (this.state.pageNum * this.state.pageSize) + idx + 1
            },
            {
                title: locale('common_vacation.ajiltan'),
                key: 'Ажилтан',
                render: (record) => (record.employee.user || {}).last_name.trim().charAt(0).toUpperCase() + '. ' + record.employee.user.first_name
            },
            {
                title: locale('common_vacation.amralt_ehleh_ognoo'),
                key: 'Амралт эхлэх огноо',
                render: (record) => moment(record.starting_date).format('YYYY-MM-DD')
            },
            {
                title: locale('common_vacation.amralt_duusah_ognoo'),
                key: 'Амралт дуусах огноо',
                render: (record) => moment(record.ending_date).format('YYYY-MM-DD')
            },
            {
                title: locale('common_vacation.tuluw'),
                key: 'Төлөв',
                render: (record) => getStatus(record.status)
            },
            {
                key: 'actions',
                width: '300px',
                render: (record) => record.status === 'idle' ?
                    <div>
                        <Button
                            onClick={() => this.setState({
                                ...record,
                                starting_date: record.starting_date ? moment(record.starting_date) : '',
                                ending_date: record.ending_date ? moment(record.ending_date) : '',
                                employee: {
                                    emp: record.employee.emp._id,
                                    user: record.employee.user._id
                                },
                                _id: record._id,
                                visible: true
                            })}
                            // shape='circle'
                            type='default'
                            icon={<EditOutlined />}
                            style={{marginRight: '10px'}}
                        >
                            {locale('common_vacation.zasah')}
                        </Button>
                        <Popconfirm
                            title={locale('common_vacation.eeljiin_amralt_ustgah_uu')}
                            onCancel={() => this.setState({_id: '', employee: {emp: ''}})}
                            onConfirm={this.changeCompanyVacation.bind(this, {}, 'delete')}
                            cancelText={locale('common_vacation.bolih')}
                            okText={locale('common_vacation.ustgah')}
                        >
                            <Button onClick={() => this.setState({
                                _id: record._id,
                                employee: {
                                    emp: record.employee.emp._id
                                }
                            })}
                                // shape='circle'
                                type='danger'
                                icon={<DeleteOutlined />}
                            >
                                {locale('common_vacation.ustgah')}
                            </Button>
                        </Popconfirm>
                    </div>
                    :
                    record.status === 'pending' ?
                        <div>
                            <Button
                                // shape='circle'
                                type='primary'
                                // icon={<EyeOutlined />}
                                onClick={this.openModal.bind(this, record)}
                            >
                                {locale('common_vacation.huselt_shalgah')}
                            </Button>
                        </div>
                    :
                    null
            }
        ]
        let pagination = {
            total : all,
            current: this.state.pageNum + 1,
            pageSize : this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false
        }
        const {
            first_name,
            last_name,
            starting_date,
            ending_date,
            selected_dates
        } = this.state
        return (
            <React.Fragment>
                <Card
                    title={locale('common_vacation.eeljiin_amralt')}
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined/>}
                            onClick={() => this.setState({visible: true, _id: ''})}
                        >
                            {locale('common_vacation.eeljiin_amralt_uusgeh')}
                        </Button>
                    }
                >
                    <Table dataSource={vacations} columns={columns} rowKey={(record)=> record._id}
                       expandable={{
                           expandedRowRender: record =>
                               <p style={{ margin: 0 }}>
                                   <b>{locale('common_vacation.huseltiig')} {record.status === 'approved' ? locale('common_vacation.zuwshuursun') : locale('common_vacation.tsutsalsan')}</b>
                                   {record.approved_by.user.last_name} {record.approved_by.user.first_name}({printStaticRole(record.approved_by.emp.staticRole)})
                               </p>,
                           rowExpandable: record => record.status === 'approved' || record.status === 'declined',
                       }}
                       onChange={this.paginationChangeHandler.bind(this)}
                       pagination={pagination}
                       loading={gettingVacations}
                    />
                </Card>
                <Drawer
                    title={this.state._id !== '' ? locale('common_vacation.eeljiin_amralt_shinechleh') : locale('common_vacation.eeljiin_amralt_uusgeh')}
                    maskClosable={false}
                    onClose={() => this.setState({
                        visible: false,
                        _id: '',
                        starting_date: '',
                        ending_date: '',
                        employee: {}
                    })}
                    width={720}
                    visible={this.state.visible}
                    key={'drawer-vacations'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button
                                style={{marginRight: 20}}
                                htmlType="button"
                                onClick={() => this.setState({
                                    visible: false,
                                    _id: '',
                                    starting_date: '',
                                    ending_date: '',
                                    employee: {}
                                })}
                            >
                                {locale('common_vacation.bolih')}
                            </Button>
                            <Button
                                // style={{float: 'left'}}
                                htmlType="submit"
                                form='vacation'
                                type={'primary'}
                                loading={creatingVacation}
                                disabled={
                                    creatingVacation
                                }
                            >
                                {this.state._id !== '' ? locale('common_vacation.shinechleh') : locale('common_vacation.uusgeh')}
                            </Button>
                        </div>
                    }
                >
                    <Row justify="center" align="center">
                        <Col span={22}>
                            <Form
                                size={'small'}
                                layout="vertical"
                                id='vacation'
                                onFinish={this.changeCompanyVacation.bind(this)}
                                fields={[
                                    {name: 'employee', value: this.state.employee.emp}
                                ]}
                            >
                                <Form.Item
                                    label={locale('common_vacation.ajiltan')}
                                    name="employee"
                                    rules={[
                                        {
                                            required: true,
                                            message: locale('common_vacation.ajiltan_songono_uu_anhaaruulah'),
                                        },
                                    ]}
                                >
                                    <Select
                                        showSearch
                                        optionFilterProp="children"
                                        placeholder={locale('common_vacation.ajiltan_songoh')}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        value={this.state.employee.emp}
                                        onChange={(e, employee) => {this.setState({employee: {emp: employee.value, user: employee.key}})}}
                                    >
                                        {
                                            employees.map((r) =>
                                                r.user ? <Select.Option value={r._id} key={r.user._id} >{(r.user || {}).last_name.trim().charAt(0).toUpperCase() + '. ' + (r.user || {}).first_name}</Select.Option> : null
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    label={locale('common_vacation.hugatsaa')}
                                    // name={['starting_date', 'ending_date']}
                                    rules={[
                                        {
                                            required: true,
                                            message: locale('common_vacation.eeljiin_amraltiin_hugatsaa_songono_uu'),
                                        },
                                    ]}
                                >
                                    <RangePicker
                                        value={[this.state.starting_date, this.state.ending_date]}
                                        onChange={(e, dates) => {this.setState({starting_date: moment(dates[0]), ending_date: moment(dates[1])})}}
                                    />
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Drawer>
                <Modal
                    visible={this.state.calendarVisible}
                    style={{top: 20}}
                    onCancel={this.handleCancel.bind(this)}
                    closable={false}
                    footer={[
                        <Button
                            onClick={this.handleCancel.bind(this)}
                        >
                            {locale('common_vacation.bolih')}
                        </Button>,
                        <Popconfirm
                            title={locale('common_vacation.tatgalzah_uu')}
                            okText={locale('common_vacation.tiim')}
                            cancelText={locale('common_vacation.ugui')}
                            onConfirm={this.respondToRequest.bind(this, 'declined')}
                        >
                            <Button
                                type='danger'
                            >
                                {locale('common_vacation.tatgalzah')}
                            </Button>
                        </Popconfirm>,
                        <Popconfirm
                            title={locale('common_vacation.zuwshuuruh_uu')}
                            okText={locale('common_vacation.tiim')}
                            cancelText={locale('common_vacation.ugui')}
                            onConfirm={this.respondToRequest.bind(this, 'approved')}
                        >
                            <Button
                                type='primary'
                            >
                                {locale('common_vacation.zuwshuuruh')}
                            </Button>
                        </Popconfirm>,

                    ]}
                >
                    <Space
                        direction='vertical'
                    >
                        <Text>{last_name} {locale('common_vacation.owogtoi')} {first_name} {locale('common_vacation.ajiltnii_amrah_b_h')} {moment(starting_date).format('YYYY/MM/DD')} - {moment(ending_date).format('YYYY/MM/DD')} {locale('common_vacation.baihaas_tuhain_ajiltnii_s_u')}</Text>
                        {/*{selected_dates.map(date =>*/}
                        {/*    <Text>{moment(date).format('YYYY-MM-DD')}</Text>*/}
                        {/*)}*/}
                    </Space>
                    <Calendar
                        value={this.state.starting_date}
                        fullscreen={false}
                        // dateCellRender={this.dateCellRender.bind(this, moment(this.state.starting_date), moment(this.state.ending_date))}
                        dateFullCellRender={(e) => this.dateFullCellRender(e, moment(this.state.starting_date), moment(this.state.ending_date))}
                        disabledDate={this.disabledCalendarDate.bind(this, this.state.starting_date, this.state.ending_date)}
                    />
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Vacation)