import React from 'react'
import {connect} from "react-redux";
import {
    Avatar, Badge,
    Button, Calendar,
    Card,
    Col, Collapse,
    DatePicker, Divider, Empty, Form, Input, InputNumber, List, Modal, Popconfirm, Popover, Row, Select, Space, Table,
    Tag,
    Typography
} from 'antd'
import {
    getAllWorkPlans,
    respondToWorkPlan,
    appraiseJob,
    declineJob
} from "../../actions/workplan_actions";
import {
    getSubsidiaryCompanies
} from "../../actions/employee_actions";
import moment from 'moment'
import {CheckCircleFilled, CloseCircleFilled} from "@ant-design/icons";
const {Text, Title} =  Typography
const {Panel} = Collapse

const reducer = ({main, workplan, employee}) => ({main, workplan, employee})

class Performance extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            title: '',
            desc: '',
            check_lists: [],
            work_dates: [],
            comment: '',
            completion: 0,
            id: '',
            work_plan: '',
            year_month: moment().format('YYYY-MM'),
            status: 'all',
            viewModalVisible: false,
            company: 'all',
            pageSize: 20,
            pageNum: 0
        }
    }
    handleCancel(){
        this.setState({
            modalVisible: false,
            title: '',
            desc: '',
            check_lists: [],
            work_dates: [],
            comment: '',
            completion: 0,
            id: '',
            work_plan: '',
            viewModalVisible: false
        })
    }
    componentDidMount() {
        if(this.props.main.employee.staticRole === 'employee' || this.props.main.employee.staticRole === 'attendanceCollector'){
            this.props.history.replace('/not-found');
        } else {
            this.props.dispatch(getAllWorkPlans({year_month: this.state.year_month, status: this.state.status, company: 'all', pageSize: this.state.pageSize, pageNum: this.state.pageNum}));
            this.props.dispatch(getSubsidiaryCompanies());
        }
    }
    getWorkPlans(e){
        this.setState({
            pageNum: e
        }, () => {
            this.props.dispatch(getAllWorkPlans({
                year_month: this.state.year_month,
                status: this.state.status,
                company: this.state.company,
                pageSize: this.state.pageSize,
                pageNum: this.state.pageNum
            }))
        })
    }
    filterByMonth(date) {
        this.setState({
            year_month: moment(date).format('YYYY-MM')
        }, () => {
            this.getWorkPlans(0);
        })
    }
    filterByStatus(status) {
        this.setState({
            status: status
        }, () => {
            this.getWorkPlans(0);
        })
    }
    filterByCompany(company) {
        this.setState({
            company: company
        }, () => {
            this.getWorkPlans(0);
        })
    }
    disabledWorkDates(current){
        return moment(current).format('YYYY-MM') !== moment(this.state.year_month).format('YYYY-MM')
    }
    getListData(value) {
        let listData
        const {
            work_dates
        } = this.state
        work_dates.some(c => moment(c).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) ?
            listData = [
                {type: 'yes'}
            ]
            : listData = [
                {type: 'no'}
            ]
        return listData || []
    }
    dateCellRender(value) {
        const listData = this.getListData(value)
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
                <div onClick={() => this.onCalendarSelect(value)} style={item.type === 'yes' ? style : style1} >
                    {moment(value).format('DD')}
                </div>
            ))
        )
    }
    respondToWorkPlan(workplan, status){
        this.props.dispatch(respondToWorkPlan({
            id: workplan,
            status: status
        }))
    }
    appraiseJob(){
        this.props.dispatch(appraiseJob({
            work_plan: this.state.work_plan,
            id: this.state.id,
            comment: this.state.comment,
            completion: this.state.completion
        })).then(c => {
            if(c.json.success){
                this.handleCancel()
            }
        })
    }
    declineJob(){
        this.props.dispatch(declineJob({
            work_plan: this.state.work_plan,
            id: this.state.id,
            comment: this.state.comment
        })).then(c => {
            if(c.json.success){
                this.handleCancel()
            }
        })
    }
    countChecking(workplan){
        const {
            workplan: {
                workplans
            }
        } = this.props
        let checking = {
            workplans: 0,
            jobs: 0
        }
        if(workplan === 'all'){
            for(let i = 0; i < workplans.length; i++){
                for(let k = 0; k < (workplans[i].jobs || {}).length; k++){
                    if((workplans[i].jobs[k] || {}).status === 'checking'){
                        checking.jobs++
                    }
                }
                if(workplans[i].status === 'checking'){
                    checking.workplans++
                }
            }
        } else {
            for(let i = 0; i < (workplan.jobs || {}).length; i++){
                if((workplan.jobs[i] || {}).status === 'checking'){
                    checking.jobs++
                }
            }
        }
        return checking
    }
    render(){
        const {
            workplan: {
                workplans,
                all
            },
            employee: {
                companies
            },
            main:{company}
        } = this.props;
        let pagination = {
            total : all,
            current: this.state.pageNum+1,
            pageSize : this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false
        };
        const panelExtra = (item, job) => (
            <div>
                <Button
                    size='small'
                    type='primary'
                    onClick={() => this.setState({
                        modalVisible: true,
                        title: job.title,
                        desc: job.desc,
                        check_lists: job.check_lists,
                        work_dates: job.work_dates,
                        id: job._id,
                        work_plan: item._id
                    })}
                >
                    ????????????
                </Button>
            </div>
        );
        const viewMore = (job) => (
            <div>
                <Button
                    size='small'
                    onClick={() => this.setState({
                        viewModalVisible: true,
                        title: job.title,
                        desc: job.desc,
                        check_lists: job.check_lists,
                        work_dates: job.work_dates,
                        id: job._id,
                    })}
                >
                    ??????????????????????
                </Button>
            </div>
        );
        function getStatus(status){
            let result = ''
            let color = ''
            switch(status){
                case 'idle':
                    result = '????????'
                    color = 'default'
                    break
                case 'checking':
                    result = '???????????? ????????????'
                    color = 'processing'
                    break
                case 'approved':
                    result = '????????????????????'
                    color = 'success'
                    break
                case 'decline':
                    result = '????????????????????'
                    color = 'error'
                    break
                default:
                    result = ''
                    color = 'default'
            }
            return (
                <Tag style={{height: 'fit-content'}} color={color}>
                    {result}
                </Tag>
            )
        }
        function countJobs(workplan) {
            let count = 0
            for(let i = 0; i < (workplan.jobs || {}).length; i++){
                if((workplan.jobs[i] || {}).status === 'approved'){
                    count++
                }
            }
            return count
        }
        function workplanCompletion(workplan){
            let percentage = 0
            for(let i = 0; i < (workplan.jobs || {}).length; i++){
                percentage += (workplan.jobs[i] || {}).completion || 0
            }
            return (percentage / ((workplan.jobs || {}).length * 100)) * 100 || 0
        }
        return (
            <React.Fragment>
                <Row style={{justifyContent: 'space-between'}} >
                    <Col span={16} style={{display: 'flex'}} >
                        <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10}}>??????:</Title>
                        <DatePicker
                            style={{width: 200}}
                            picker='month'
                            format='YYYY-MM'
                            defaultValue={moment()}
                            onChange={(e) => this.filterByMonth(e)}
                        />
                        <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10, marginLeft: 10}}>??????????:</Title>
                        <Select
                            defaultValue={this.state.status}
                            style={{width: 220}}
                            onChange={(e) => this.filterByStatus(e)}
                        >
                            <Select.Option value={'all'}>????????</Select.Option>
                            <Select.Option value={'idle'}>????????</Select.Option>
                            <Select.Option value={'checking'}>???????????? ????????????</Select.Option>
                            <Select.Option value={'approved'}>????????????????????</Select.Option>
                            <Select.Option value={'decline'}>????????????????????</Select.Option>
                        </Select>
                        <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10, marginLeft: 10}}>??????????????:</Title>
                        <Select
                            loading={status}
                            disabled={status}
                            style={{width: 886, marginRight: 20, textAlign: 'left'}} placeholder={'??????????????'}
                            name='company' value={this.state.company} onSelect={(e) => this.filterByCompany(e)}
                        >
                            <Select.Option key={'ho_com'} value='all'>?????? ??????????????</Select.Option>
                            <Select.Option key={'to_com'} value={company._id}>{company.name}</Select.Option>
                            {companies?.map( c=>
                                <Select.Option value={c._id} key={`${c._id}_coms`}>{c.name}</Select.Option>
                            )}
                        </Select>
                    </Col>
                    <Col style={{display: 'flex', marginRight: 40, alignItems: 'center'}} >
                        <div style={{marginRight: 50}} >
                            <Badge style={{ backgroundColor: '#4fb51d' }} offset={[15, 0]} count={this.countChecking('all').workplans} showZero>
                                ????????????????????
                            </Badge>
                        </div>
                        <div>
                            <Badge style={{ backgroundColor: '#4fb51d' }} offset={[15, 0]} count={this.countChecking('all').jobs} showZero>
                                ????????
                            </Badge>
                        </div>
                    </Col>
                </Row>
                <Divider/>
                {
                    (workplans || []).length > 0 ?
                        <Table
                            dataSource={workplans.map((elem, index) => {elem.key = index; return elem})}
                            onChange={(e) => this.getWorkPlans(e.current-1)}
                            pagination={pagination}
                            columns={[
                                {
                                    title: '???',
                                    key: '???',
                                    width: 50,
                                    render: (record, txt, idx) => idx + 1
                                },
                                {
                                    title: '??????',
                                    key: 'name',
                                    render: record => (
                                        <List.Item>
                                            <List.Item.Meta
                                                title={record.created_by.user.first_name}
                                                avatar={<Badge count={this.countChecking(record).jobs} style={{ backgroundColor: '#4fb51d' }} showZero >
                                                    <Avatar src="../images/default-avatar.png" />
                                                </Badge>}
                                            />
                                        </List.Item>
                                    ),
                                    sorter: (a, b) => this.countChecking(a).jobs - this.countChecking(b).jobs,
                                    // defaultSortOrder: 'descend'
                                },
                                {
                                    title: '??????????????',
                                    key: 'company',
                                    render: record => (
                                        <span>{record.company && record.company.name}</span>
                                    ),
                                },
                                {
                                    title: '??????????',
                                    key: 'status',
                                    width: 150,
                                    render: record => getStatus(record.status)
                                },
                                {
                                    title: '????????',
                                    key: 'jobs',
                                    render: record => <span>{`${countJobs(record)}/${(record.jobs || []).length}`}</span>
                                },
                                {
                                    title: '??????????????????',
                                    key: 'completion',
                                    render: record => <span>{`${parseFloat(workplanCompletion(record)).toPrecision(3)}%`}</span>
                                },
                                {
                                    title: '????????????',
                                    key: 'actions',
                                    render: record => (
                                        <div>
                                            {!record.company || record.company._id !== company._id?
                                                null
                                                :
                                                record.status === 'checking' ?
                                                    <div>
                                                        <Button
                                                            style={{marginRight: 10}}
                                                            onClick={this.respondToWorkPlan.bind(this, record._id, 'approved')}
                                                            type='primary'
                                                        >
                                                            ????????????
                                                        </Button>
                                                        <Popconfirm
                                                            title='?????????????????? ?????'
                                                            okText='????????'
                                                            cancelText='????????'
                                                            onConfirm={this.respondToWorkPlan.bind(this, record._id, 'decline')}
                                                        >
                                                            <Button
                                                                type='danger'
                                                            >
                                                                ??????????????????
                                                            </Button>
                                                        </Popconfirm>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    )
                                }
                            ]}
                            expandable={{
                                expandedRowRender: record => (
                                    <Table
                                        dataSource={record.jobs}
                                        pagination={false}
                                        columns={
                                            // record.status !== 'checking' ?
                                                [
                                                    {
                                                        title: '???',
                                                        key: '???',
                                                        width: 50,
                                                        render: (job ,txt, idx) => idx + 1
                                                    },
                                                    {
                                                        title: '?????????? ??????',
                                                        key: 'title',
                                                        width: 950,
                                                        render: job => job.title
                                                    },
                                                    {
                                                        title: '?????????????????????? ??????????',
                                                        key: '??????????',
                                                        render: (job) => job.status !== 'checking' ? viewMore(job) : null
                                                    },
                                                    {
                                                        title: '??????????',
                                                        key: 'status',
                                                        render: job => getStatus(job.status)
                                                    },
                                                    {
                                                        title: '??????????????????',
                                                        key: 'completion',
                                                        render: job => job.completion && <span>{`${job.completion}%`}</span>
                                                    },
                                                    {
                                                        title: '????????????',
                                                        key: 'action',
                                                        render: job => record.status === 'approved' && job.status === 'checking' ? panelExtra(record, job) : null
                                                    }
                                                ]
                                                // :
                                                // [
                                                //     {
                                                //         title: '???',
                                                //         key: '???',
                                                //         width: 50,
                                                //         render: (job ,txt, idx) => idx + 1
                                                //     },
                                                //     {
                                                //         title: '?????????? ??????',
                                                //         key: 'title',
                                                //         render: job => job.title
                                                //     },
                                                //     {
                                                //         title: '??????????',
                                                //         key: 'status',
                                                //         render: job => getStatus(job.status)
                                                //     },
                                                //     {
                                                //         title: '??????????????????',
                                                //         key: 'completion',
                                                //         render: job => job.completion && <span>{`${job.completion}%`}</span>
                                                //     },
                                                //     {
                                                //         title: '????????????',
                                                //         key: 'action',
                                                //         render: job => record.status === 'approved' && job.status === 'checking' ? panelExtra(record, job) : null
                                                //     }
                                                // ]
                                        }
                                    />
                                ),
                            }}
                        />
                        :
                        <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>?????????? ???????????????????? ?????????????? ??????????.</span>} />
                }
                <Modal
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    title={<Row>
                        <Popover
                            title='?????????? ??????'
                            content={this.state.title}
                            placement='bottom'
                        >
                            <div
                                style={{width: '550px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', fontSize: 16, fontWeight: 500}}
                            >
                                {this.state.title}
                            </div>
                        </Popover>
                    </Row>}
                    width={800}
                    footer={
                        <Space>
                            <Popconfirm
                                title='?????????????????? ?????'
                                okText='????????'
                                cancelText='????????'
                                onConfirm={this.declineJob.bind(this)}
                                disabled={this.state.comment === '' || this.state.completion > 0}
                            >
                                <Button
                                    type='danger'
                                    disabled={this.state.comment === '' || this.state.completion > 0}
                                >
                                    ??????????????????
                                </Button>
                            </Popconfirm>
                            <Button
                                disabled={this.state.completion <= 0 || this.state.comment === ''}
                                onClick={this.appraiseJob.bind(this)}
                                type='primary'
                            >
                                ????????????
                            </Button>
                        </Space>
                    }
                >
                    <Space
                        direction='vertical'
                    >
                        <span style={{display: 'block', width: 750, overflowWrap: 'break-word'}}>{this.state.desc}</span>
                        <Row>
                            {
                                this.state.check_lists.length > 0 ?
                                    <Col span={14}>
                                        {
                                            this.state.check_lists.map(c => (
                                                <Col>
                                                    {c.bool ? <CheckCircleFilled/> : <CloseCircleFilled/>}
                                                    <Text style={{marginLeft: 5}}>{c.title}</Text>
                                                </Col>
                                            ))
                                        }
                                    </Col>
                                : null
                            }
                            <Col span={10}>
                                <Calendar
                                    defaultValue={moment(this.state.year_month)}
                                    fullscreen={false}
                                    headerRender={() => {}}
                                    disabledDate={this.disabledWorkDates.bind(this)}
                                    dateFullCellRender={e => this.dateCellRender(e)}
                                />
                            </Col>
                        </Row>
                        <Divider
                            orientation='left'
                        >??????????????</Divider>
                        <Form
                            layout='vertical'
                            fields={[
                                {name: 'comment', value: this.state.comment},
                                {name: 'completion', value: this.state.completion}
                            ]}
                        >
                            <Row style={{justifyContent: 'space-between'}} >
                                <Col span={6}>
                                    <Form.Item
                                        label='?????????????? ????????????'
                                        rules={[
                                            {
                                                required: true,
                                                message: '?????????????? ?????????????? ????.'
                                            }
                                        ]}
                                    >
                                        <InputNumber style={{width: '100%'}} min={0} max={100} name='completion' value={this.state.completion} onChange={e => this.setState({completion: e})} placeholder='??????????????' />
                                    </Form.Item>
                                </Col>
                                <Col span={16}>
                                    <Form.Item
                                        label='??????????????'
                                    >
                                        <Input.TextArea name='comment' value={this.state.comment} onChange={event => this.setState({comment: event.target.value})} placeholder='??????????????????' />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Space>
                </Modal>
                <Modal
                    visible={this.state.viewModalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    title={<Row>
                        <Popover
                            title='?????????? ??????'
                            content={this.state.title}
                            placement='bottom'
                        >
                            <div
                                style={{width: '550px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', fontSize: 16, fontWeight: 500}}
                            >
                                {this.state.title}
                            </div>
                        </Popover>
                    </Row>}
                    width={800}
                    footer={false}
                >
                    <Space
                        direction='vertical'
                    >
                        <span style={{display: 'block', width: 750, overflowWrap: 'break-word'}}>{this.state.desc}</span>
                        <Row>
                            {
                                this.state.check_lists.length > 0 ?
                                    <Col span={14}>
                                        {
                                            this.state.check_lists.map(c => (
                                                <Col>
                                                    {c.bool ? <CheckCircleFilled/> : <CloseCircleFilled/>}
                                                    <Text style={{marginLeft: 5}}>{c.title}</Text>
                                                </Col>
                                            ))
                                        }
                                    </Col>
                                : null
                            }
                            <Col span={10}>
                                <Calendar
                                    defaultValue={moment(this.state.year_month)}
                                    fullscreen={false}
                                    headerRender={() => {}}
                                    disabledDate={this.disabledWorkDates.bind(this)}
                                    dateFullCellRender={e => this.dateCellRender(e)}
                                />
                            </Col>
                        </Row>
                    </Space>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Performance)