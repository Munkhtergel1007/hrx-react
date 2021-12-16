import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    Drawer,
    Typography,
    Row,
    Col,
    Divider,
    Button,
    Form,
    Input,
    Select,
    Calendar,
    Table,
    List,
    Avatar,
    InputNumber,
    Popconfirm,
    Radio
} from 'antd'
import {CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {
    getAllSubTags
} from '../../actions/main_actions'
import {
    submitJob,
    deleteJob,
    submitJobWorker
} from '../../actions/job_actions'
import {
    getAllEmployees,
    getEmpJobs
} from '../../actions/employee_actions'
import moment from "moment";
import {msg, isId} from "../../config";

const {Title, Text} = Typography

const reducer = ({main, workplan, employee}) => ({main, workplan, employee})

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days)
    return date
}

class Job extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobsVisible: false,
            jobworkerVisible: false,
            _id: '',
            year_month: [],
            title: '',
            desc: '',
            subTag: [],
            worker: {
                emp: '',
                user: ''
            },
            cost: '',
            editing: false,
            jwTitle: '',
            check_lists: [],
            check: '',
            work_dates: []
        }
    }
    componentDidMount() {
        const {dispatch} = this.props
        dispatch(getAllSubTags())
        dispatch(getAllEmployees())
        dispatch(getEmpJobs(this.props.paramsId, {}))
    }
    handleCancel() {
        this.setState({
            jobsVisible: false,
            jobworkerVisible: false,
            _id: '',
            year_month: [],
            title: '',
            desc: '',
            subTag: [],
            worker: {
                emp: '',
                user: ''
            },
            cost: '',
            editing: false,
            jwTitle: '',
            check_lists: [],
            check: '',
            work_dates: []
        })
    }
    submitJob(vals){
        this.props.dispatch(submitJob({
            ...vals,
            year_month: this.state.year_month,
            id: this.state._id
        })).then(c => {
            if(c.json.success){
                this.handleCancel()
            }
        })
    }
    submitJobWorker(vals) {
        if(!vals.worker) {
            return msg('error', 'Ажилтан сонгоно уу.')
        } else if(vals.worker && !isId(vals.worker)) {
            return msg('error', 'Ажилтан шалгана уу.')
        } else {
            this.props.dispatch(submitJobWorker({...vals, ...this.state.worker, check_lists: this.state.check_lists, job: this.state._id, work_dates: this.state.work_dates}))
        }
    }
    onMonthCalendarSelect(e) {
        const {
            year_month
        } = this.state
        let date = moment(e).format('YYYY-MM')
        if(year_month.some((c) => moment(c).format('YYYY-MM') === date)) {
            let aa = year_month.filter((i) => moment(i).format('YYYY-MM') !== date)
            this.setState({
                year_month: aa
            })
        } else {
            year_month.push(date)
        }
    }
    onCalendarSelect(e) {
        const {
            work_dates
        } = this.state
        let date = moment(e).format('YYYY-MM-DD')
        if(work_dates.some((c) => moment(c).format('YYYY-MM-DD') === date)) {
            let aa = work_dates.filter((i) => moment(i).format('YYYY-MM-DD') !== date)
            this.setState({
                work_dates: aa
            })
        } else {
            work_dates.push(date)
        }
    }
    getListData(value) {
        let listData
        const {
            year_month
        } = this.state
        year_month.some((c) => moment(c).format('YYYY-MM') === moment(value).format('YYYY-MM')) ?
            listData = [
                {type: 'yes'}
            ]
        : listData = []
        return listData || []
    }
    getJWListData(value) {
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
    monthCellRender(value) {
        const listData = this.getListData(value)
        return (
            listData.map(item => (
                <div className='vacation-badge' >
                    {item.type === 'yes' ? <CheckCircleFilled className='calendar-icon-yes'/> : null}
                </div>
            ))
        )
    }
    dateCellRender(value) {
        const listData = this.getJWListData(value)
        // console.log(value)
        return (
            listData.map(item => (
                <div className='vacation-badge' onClick={() => this.onCalendarSelect(value)}>
                    {item.type === 'yes' ? <CheckCircleFilled className='calendar-icon-yes'/> : null}
                </div>
            ))
        )
    }
    addToDo(e){
        e.preventDefault()
        if(this.state.check !== ''){
            this.setState({
                check_lists: [...this.state.check_lists, this.state.check]
            }, this.setState({check: ''}))
        }
    }
    disabledWorkDates(current){
        let aa = this.state.year_month.map(c => moment(c).format('YYYY-MM'))
        return !aa.includes(current.format('YYYY-MM'))
    }
    render(){
        const {
            workplan: {
                gettingSubs,
                subtags,
                jobs,
                jobworkers,
                gettingEmpJobs,
                submittingJob
            },
            employee: {
                employees
            }
        } = this.props
        console.log(jobs, jobworkers)
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                    <Col span={20}>
                        <div style={{margin: '10px auto 30px'}}>
                            <Divider orientation="left" plain>
                                <b style={{fontSize: 16}}>Ажлын төлөвлөгөө</b>
                            </Divider>
                        </div>
                        <div style={{width: '100%', height: 30, marginBottom: 30}}>
                            <Button onClick={() => this.setState({jobsVisible: true})} type='primary' style={{float: 'right'}} icon={<PlusOutlined />}>
                                Ажил нэмэх
                            </Button>
                        </div>
                        {
                            jobs.length > 0 ?
                                jobs.map(item =>
                                    <Card
                                        title={
                                            <div className={'tag-table-title'}>
                                                <List.Item>
                                                    <List.Item.Meta
                                                        // avatar={<Avatar style={{backgroundColor: item.color}} />}
                                                        title={item.title}
                                                        description={item.desc}
                                                        style={{display: 'flex', alignItems: 'center'}}
                                                    />
                                                </List.Item>
                                            </div>
                                        }
                                        extra={
                                            item.created_by.emp._id === this.props.main.employee._id ?
                                                <div>
                                                    <Button
                                                        type='default'
                                                        style={{marginRight: '10px'}}
                                                        shape='circle'
                                                        icon={<EditOutlined />}
                                                        size={'small'}
                                                        onClick={() => this.setState({
                                                            ...item,
                                                            subTag: item.subTag ? item.subTag.map(c => {return c._id}) : [],
                                                            jobsVisible: true,
                                                            editing: true,
                                                        })}
                                                    />
                                                    <Popconfirm
                                                        title={'Ажил устгах уу?'}
                                                        okText={'Тийм'}
                                                        cancelText={'Үгүй'}
                                                        onConfirm={() => this.props.dispatch(deleteJob({id: item._id}))}
                                                    >
                                                        <Button
                                                            type='danger'
                                                            size={'small'}
                                                            style={{marginRight: '10px'}}
                                                            icon={<DeleteOutlined />}
                                                            shape='circle'
                                                        />
                                                    </Popconfirm>
                                                    <Button
                                                        type='primary'
                                                        size='small'
                                                        icon={<PlusOutlined/>}
                                                        onClick={() => this.setState({
                                                            jobworkerVisible: true,
                                                            _id: item._id,
                                                            year_month: item.year_month
                                                        })}
                                                    >
                                                        Ажилтан нэмэх
                                                    </Button>
                                                </div>
                                            : null
                                        }
                                        style={{marginBottom: 16}}
                                    >
                                        <List
                                            itemLayout='horizontal'
                                        />
                                    </Card>
                                )
                            : null
                        }
                    </Col>
                </Row>
                {/*{Job Drawer}*/}
                <Drawer
                    visible={this.state.jobsVisible}
                    onClose={this.handleCancel.bind(this)}
                    closable={false}
                    width={800}
                >
                    <Form
                        layout='vertical'
                        onFinish={this.submitJob.bind(this)}
                        fields={[
                            {name: 'title', value: this.state.title},
                            {name: 'desc', value: this.state.desc},
                            {name: 'subTag', value: this.state.subTag},
                        ]}
                    >
                        <Form.Item
                            label='Ажлын нэр'
                            name='title'
                            required
                        >
                            <Input value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} placeholder='Ажлын нэр' />
                        </Form.Item>
                        <Form.Item
                            name='desc'
                            label='Тайлбар'
                        >
                            <Input.TextArea value={this.state.desc} onChange={(e) => this.setState({desc: e.target.value})} placeholder='Ажлын тайлбар' />
                        </Form.Item>
                        <Form.Item
                            name='subTag'
                            label='Тэмдэглэгээ'
                        >
                            <Select value={this.state.subTag} onChange={(e) => this.setState({subTag: e})} mode='multiple' allowClear placeholder='Тэмдэглэгээ сонгох' >
                                {
                                    subtags.length > 0 ?
                                        subtags.map(item => <Select.Option value={item._id}>{item.title}</Select.Option>)
                                    : null
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='Хугацаа'
                        >
                            <Calendar
                                mode='year'
                                // monthFullCellRender={}
                                onSelect={(e) => this.onMonthCalendarSelect(e)}
                                monthCellRender={this.monthCellRender.bind(this)}
                            />
                        </Form.Item>
                        <Button
                            type='default'
                            onClick={this.handleCancel.bind(this)}
                            style={{marginRight: 10}}
                        >
                            Болих
                        </Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >
                            Ажил нэмэх
                        </Button>
                    </Form>
                </Drawer>
                {/*{Job Worker Drawer}*/}
                <Drawer
                    visible={this.state.jobworkerVisible}
                    onClose={this.handleCancel.bind(this)}
                    closable={false}
                    width={800}
                >
                    <Form
                        layout='vertical'
                        onFinish={this.submitJobWorker.bind(this)}
                        fields={[
                            {name: 'worker', value: this.state.worker.emp},
                            {name: 'title', value: this.state.jwTitle},
                            {name: 'cost', value: this.state.cost},
                        ]}
                    >
                        <Form.Item
                            label='Ажилтан'
                            name='worker'
                            required
                        >
                            <Select
                                showSearch
                                optionFilterProp="children"
                                placeholder="Ажилтан сонгох"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                value={this.state.worker.emp}
                                onChange={(e, worker) => {this.setState({worker: {emp: worker.value, user: worker.key}})}}
                            >
                                {
                                    employees.map((r) =>
                                        <Select.Option value={r._id} key={r.user._id} >{(r.user || {}).last_name.trim().charAt(0).toUpperCase() + '. ' + (r.user || {}).first_name}</Select.Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name='title'
                            label='Ажил'
                        >
                            <Input value={this.state.jwTitle} onChange={(e) => this.setState({jwTitle: e.target.value})} placeholder='Хийх ажлын нэр' />
                        </Form.Item>
                        <Form.Item
                            name='cost'
                            label='Өртөг'
                        >
                            <InputNumber
                                style={{width: '100%'}}
                                value={this.state.cost}
                                onChange={(e) => this.setState({cost: e})}
                                placeholder='Ажлын үнэ, өртөг'
                                formatter={value => `₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\₮\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                        <Form.Item
                            label='List'
                        >
                            <List
                                size='small'
                                dataSource={this.state.check_lists}
                                renderItem={item => <List.Item>{item}</List.Item>}
                            />
                            <Input
                                value={this.state.check}
                                onChange={(e) => this.setState({check: e.target.value})}
                                onPressEnter={this.addToDo.bind(this)}
                            />
                        </Form.Item>

                        <Form.Item
                            label='Ажиллах хугацаа'
                        >
                            <Calendar
                                dateCellRender={(e) => this.dateCellRender(e)}
                                // onSelect={(e) => this.onCalendarSelect(e)}
                                disabledDate={this.disabledWorkDates.bind(this)}
                            />
                        </Form.Item>
                        <Button
                            type='default'
                            onClick={this.handleCancel.bind(this)}
                            style={{marginRight: 10}}
                        >
                            Болих
                        </Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                        >
                            Ажилтан нэмэх
                        </Button>
                    </Form>
                </Drawer>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Job)