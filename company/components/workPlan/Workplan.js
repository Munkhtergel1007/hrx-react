import React from 'react'
import {connect} from 'react-redux'
import {
    Button,
    Card,
    Table,
    Modal,
    Drawer,
    Form,
    DatePicker,
    Empty,
    Typography,
    Input,
    List,
    Calendar,
    Select,
    Popconfirm,
    Tag,
    Collapse,
    Checkbox,
    Col,
    Row, Divider, Space, Popover
} from 'antd'
import {CheckCircleFilled, DeleteFilled, DeleteOutlined, PlusOutlined, CommentOutlined, CloseCircleFilled} from "@ant-design/icons";
import {
    createWorkPlan,
    getEmpWorkPlans,
    createWorkPlanJob,
    deleteWorkPlanJob,
    deleteWorkPlan,
    submitWorkPlan,
    submitWorkplanJob
} from '../../actions/workplan_actions'
import moment from 'moment'
import {getAllSubTags} from "../../actions/main_actions";
import {hasAction} from "../../config";
const {Text, Title} = Typography
const {Panel} = Collapse

const reducer = ({main, workplan, settings}) => ({main, workplan, settings})

const defCheck_lists = [
    {title: 'Хийх ажил 1', bool: false, demo: true},
    {title: 'Хийх ажил 2', bool: false, demo: true},
    {title: 'Хийх ажил 3', bool: false, demo: true}
];
class Workplan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            drawerVisible: false,
            year_month: '',
            title: '',
            desc: '',
            check_lists: defCheck_lists,
            check_lists_demo:true,
            work_dates: [],
            subTag: '',
            _id: '',
            jobId: '',
            editingApproved: false,
            type: '',

            infoModalVisible: false,
            infoTitle: '',
            infoDesc: '',
            infoCheckList: [],
            infoComment: '',
            infoStatus: '',
            infoCompletion: 0
        }
    }
    componentDidMount() {
        const {dispatch} = this.props
        dispatch(getAllSubTags())
        dispatch(getEmpWorkPlans())
    }
    handleCancel() {
        this.setState({
            modalVisible: false,
            drawerVisible: false,
            year_month: '',
            title: '',
            desc: '',
            check_lists: defCheck_lists,
            check_lists_demo: true,
            work_dates: [],
            subTag: '',
            _id: '',
            jobId: '',
            editingApproved: false,
            type: '',

            infoModalVisible: false,
            infoTitle: '',
            infoDesc: '',
            infoCheckList: [],
            infoComment: '',
            infoStatus: '',
            infoCompletion: 0
        })
    }
    createWorkPlan() {
        const {
            dispatch
        } = this.props
        dispatch(createWorkPlan({year_month: this.state.year_month})).then(c => {
            if(c.json.success) {
                this.handleCancel()
            }
        })
    }
    addToDo(e){
        e.preventDefault()
        if(this.state.check){

            let hold = [];
            if(this.state.check_lists_demo && this.state.check_lists && this.state.check_lists.length>0){
                this.state.check_lists.map(function (r) {
                    if(!r.demo){
                        hold.push(r)
                    }
                });
            } else {
                hold = this.state.check_lists || [];
            }
            this.setState({
                check_lists: [...hold, {title: this.state.check, bool: false}], check_lists_demo:false
            }, this.setState({check: ''}));
        }
    }
    disabledWorkDates(current){
        return moment(current).format('YYYY-MM') !== moment(this.state.year_month).format('YYYY-MM')
    }
    disabledDates(year_month, current){
        return moment(current).format('YYYY-MM') !== moment(year_month).format('YYYY-MM')
    }
    submitJob(vals){
        const {
            dispatch
        } = this.props
        const {
            check_lists,
            work_dates,
            _id,
            jobId,
            type
        } = this.state
        dispatch(createWorkPlanJob({
            ...vals,
            check_lists: check_lists,
            work_dates: work_dates,
            work_plan: _id,
            type: type,
            id: jobId
        })).then(c => {
            if(c.json.success){
                this.handleCancel()
            }
        })
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
    getData(value, work_dates){
        let listData;
        work_dates.some(c => moment(c).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) ?
            listData = [
                {type: 'yes'}
            ]
            : listData = [
                {type: 'no'}
            ];
        return listData || []
    }
    workCellRender(value, work_dates){
        const listData = this.getData(value, work_dates);
        let style = {
            backgroundColor: '#1A3452',
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            // lineHeight: 24,
            color: '#fff',
            margin: '5px',
            // display: 'inline-block',
            position: 'relative'
        };
        return (
            listData.map(item => (
                <div style={item.type === 'yes' ? style : null} >
                    {moment(value).format('DD')}
                </div>
            ))
        )
    }
    dateCellRender(value) {
        const listData = this.getListData(value);
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
        };
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
        };
        // console.log(value)
        return (
            listData.map(item => (
                <div onClick={() => this.onCalendarSelect(value)} style={item.type === 'yes' ? style : style1} >
                    {moment(value).format('DD')}
                </div>
            ))
        )
    }
    onCalendarSelect(e) {
        const {
            work_dates
        } = this.state;
        let date = moment(e).format('YYYY-MM-DD');
        if(work_dates.some((c) => moment(c).format('YYYY-MM-DD') === date)) {
            let aa = work_dates.filter((i) => moment(i).format('YYYY-MM-DD') !== date);
            this.setState({
                work_dates: aa
            })
        } else {
            work_dates.push(date)
        }
    }
    getStatus(status){
        let result = '';
        let color = '';
        switch(status){
            case 'idle':
                result = 'Шинэ';
                color = 'default';
                break;
            case 'checking':
                result = 'Шалгаж байгаа';
                color = 'processing';
                break;
            case 'approved':
                result = 'Үнэлэгдсэн';
                color = 'success';
                break;
            case 'decline':
                result = 'Татгалзсан';
                color = 'error';
                break;
            default:
                result = '';
                color = 'default';
        }
        return (
            <Tag color={color}>
                {result}
            </Tag>
        )
    }
    onCheckListChange(e, index){
        let arr = this.state.check_lists;
        arr[index].bool = e;
        this.setState({
            check_lists: arr
        })
    }
    render(){
        const {
            workplan: {
                workplans,
                submittingWorkplan,
                gettingSub,
                subtags
            }
        } = this.props;
        // const hadAction = hasAction([], this.props.main.employee, this.props.paramsId, true);
        const hadAction = true;
        const panelExtra = (item, job) => (
            <div>
                <Button
                    size='small'
                    onClick={(event) => {
                        event.stopPropagation()
                        this.setState({
                            year_month: item.year_month,
                            title: job.title,
                            desc: job.desc,
                            check_lists: job.check_lists,
                            work_dates: job.work_dates,
                            subTag: job.subTag,
                            jobId: job._id,
                            _id: item._id,
                            drawerVisible: true,
                            type: item.status === 'idle' || item.status === 'decline' ? 'main' : 'extra',
                            editingApproved: item.status === 'idle' || item.status === 'decline' ? false : true
                        })
                    }}
                >
                    Засах
                </Button>
                {
                    item.status === 'idle' || item.status === 'decline' ?
                        <Popconfirm
                            title='Ажил устгах уу?'
                            okText='Тийм'
                            cancelText='Үгүй'
                            onCancel={e => e.stopPropagation()}
                            onConfirm={(event) => {
                                event.stopPropagation()
                                this.props.dispatch(deleteWorkPlanJob({work_plan: item._id, id: job._id}))
                            }}
                        >
                            <Button
                                type='danger'
                                size='small'
                                style={{marginLeft: 10}}
                                onClick={event => event.stopPropagation()}
                            >
                                Устгах
                            </Button>
                        </Popconfirm>
                    : null
                }
            </div>
        )
        const panelExtraApprove = (item, job) => (
            <div>
                {
                    job.status !== 'approved' && job.status !== 'checking' ?
                        <Button
                            size='small'
                            onClick={(event) => {
                                event.stopPropagation()
                                this.setState({
                                    year_month: item.year_month,
                                    title: job.title,
                                    desc: job.desc,
                                    check_lists: job.check_lists,
                                    work_dates: job.work_dates,
                                    subTag: job.subTag,
                                    jobId: job._id,
                                    _id: item._id,
                                    drawerVisible: true,
                                    // type: item.status === 'idle' || item.status === 'decline' ? 'main' : 'extra',
                                    editingApproved: item.status === 'idle' || item.status === 'decline' ? false : true
                                })
                            }}
                        >
                            Засах
                        </Button>
                    : null
                }
                {
                    job.status !== 'approved' ?
                        <Button
                            type='primary'
                            size='small'
                            style={{marginLeft: 10}}
                            onClick={event => {
                                event.stopPropagation()
                                this.props.dispatch(submitWorkplanJob({id: job._id, status: (job.status === 'checking' ? 'idle' : 'checking'), work_plan: item._id}))
                            }}
                        >
                            {job.status === 'checking' ? 'Буцаах' : 'Шалгуулах'}
                        </Button>
                    : null
                }
            </div>
        )
        return (
            <React.Fragment>
                <Row
                    justify="center"
                    align="center"
                    style={{ width: "100%" }}
                    className={"emp-anket"}
                >
                    <Col span={20}>
                        <div style={{ margin: "50px auto 10px" }}>
                            <Divider orientation="left" plain>
                                <b style={{ fontSize: 16 }}>Ажлын төлөвлөгөө</b>
                            </Divider>
                        </div>
                        {
                            hadAction ?
                                <div style={{marginBottom: 10, display: "flex", justifyContent: 'flex-end'}} >
                                    <Button
                                        type='primary'
                                        icon={<PlusOutlined/>}
                                        onClick={() => this.setState({
                                            modalVisible: true
                                        })}
                                    >
                                        Ажлын төлөвлөгөө
                                    </Button>
                                </div>
                            : null
                        }
                        {
                            workplans.length > 0 ?
                                workplans.map(item =>
                                    <Card
                                        key={item._id}
                                        title={
                                            <React.Fragment>
                                                {this.getStatus(item.status)}
                                                <Text>{moment(item.year_month).format('YYYY')} оны {moment(item.year_month).format('M')} сар</Text>
                                            </React.Fragment>
                                        }
                                        extra={
                                            item.status !== 'approved' && item.status !== 'checking' && hadAction ?
                                                <React.Fragment>
                                                    {/*<Button*/}
                                                    {/*    type='default'*/}
                                                    {/*    size='small'*/}
                                                    {/*    onClick={() => this.setState({*/}
                                                    {/*        _id: item._id,*/}
                                                    {/*        year_month: moment(item.year_month),*/}
                                                    {/*        modalVisible: true*/}
                                                    {/*    })}*/}
                                                    {/*>*/}
                                                    {/*    Засах*/}
                                                    {/*</Button>*/}
                                                    <Popconfirm
                                                        title={"Ажлын төлөвлөгөө устгах уу?"}
                                                        okText='Тийм'
                                                        cancelText='Үгүй'
                                                        onConfirm={() => this.props.dispatch(deleteWorkPlan({id: item._id}))}
                                                    >
                                                        <Button
                                                            type='danger'
                                                            size='small'
                                                            icon={<DeleteOutlined/>}
                                                        >
                                                            Устгах
                                                        </Button>
                                                    </Popconfirm>
                                                    <Button
                                                        type='primary'
                                                        size='small'
                                                        style={{marginLeft: 10}}
                                                        icon={<PlusOutlined />}
                                                        onClick={() => this.setState({
                                                            drawerVisible: true,
                                                            _id: item._id,
                                                            year_month: item.year_month,
                                                            type: item.status === 'idle' || item.status === 'decline' ? 'main' : 'extra',
                                                        })}
                                                    >
                                                        Ажил оруулах
                                                    </Button>
                                                </React.Fragment>
                                                : null
                                        }
                                        style={{marginBottom: 16}}
                                        actions={item.status !== 'approved' && hadAction ?
                                            [
                                                <Button
                                                    type='primary'
                                                    size='small'
                                                    style={{float: 'right', marginRight: 22}}
                                                    disabled={item.jobs.length === 0}
                                                    onClick={() => this.props.dispatch(submitWorkPlan({id: item._id, status: (item.status === 'idle' || item.status === 'decline' ? 'checking' : 'idle')}))}
                                                >
                                                    {item.status === 'idle' || item.status === 'decline' ? 'Хүсэлт илгээх' : 'Хүсэлт буцаах'}
                                                </Button>
                                            ]
                                            : null}
                                    >
                                        {item.jobs.length > 0 ?
                                            <List
                                                dataSource={item.jobs}
                                                itemLayout='vertical'
                                                size='small'
                                                // grid={{column: 2}}
                                                renderItem={job => (
                                                    <List.Item
                                                        // style={{marginLeft: 20, marginRight: 20}}
                                                        extra={!hadAction ? null : item.status === 'idle' || item.status === 'decline' ? panelExtra(item, job) : item.status === 'checking' ? null : panelExtraApprove(item, job)}
                                                    >
                                                        {/*<List.Item.Meta*/}
                                                        {/*    // style={{cursor: 'pointer'}}*/}
                                                        {/*    // onClick={() => {*/}
                                                        {/*    //     this.setState({*/}
                                                        {/*    //         year_month: item.year_month,*/}
                                                        {/*    //         title: job.title,*/}
                                                        {/*    //         desc: job.desc,*/}
                                                        {/*    //         check_lists: job.check_lists,*/}
                                                        {/*    //         work_dates: job.work_dates,*/}
                                                        {/*    //         subTag: job.subTag,*/}
                                                        {/*    //         jobId: job._id,*/}
                                                        {/*    //         _id: item._id,*/}
                                                        {/*    //         drawerVisible: true,*/}
                                                        {/*    //         type: item.status === 'idle' || item.status === 'decline' ? 'main' : 'extra',*/}
                                                        {/*    //         editingApproved: item.status === 'idle' || item.status === 'decline' ? false : true*/}
                                                        {/*    //     })*/}
                                                        {/*    // }}*/}
                                                        {/*    title={job.title}*/}
                                                        {/*    description={job.desc}*/}
                                                        {/*/>*/}
                                                        {
                                                            job.status === 'approved' || job.status === 'decline' ?
                                                                <Row>
                                                                    <Col span={19}>
                                                                        <div
                                                                            style={
                                                                                job.status === 'decline' ?
                                                                                    {width: '600px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', marginBottom: 12, fontSize: 16, fontWeight: 500}
                                                                                    :
                                                                                    {width: '800px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', marginBottom: 12, fontSize: 16, fontWeight: 500}
                                                                            }
                                                                        >
                                                                            {job.title}
                                                                        </div>
                                                                        <div
                                                                            style={
                                                                                job.status === 'decline' ?
                                                                                    {width: '600px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', color: 'rgba(0, 0, 0, 0.45)', fontSize: 14, lineHeight: 1.5715}
                                                                                    :
                                                                                    {width: '800px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', color: 'rgba(0, 0, 0, 0.45)', fontSize: 14, lineHeight: 1.5715}
                                                                            }
                                                                        >
                                                                            {job.desc}
                                                                        </div>
                                                                    </Col>
                                                                    <Col span={5} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                                        {this.getStatus(job.status)}
                                                                        <Button icon={<CommentOutlined />} style={{marginRight: 8}} size='small' shape='circle'
                                                                            onClick={() => this.setState({
                                                                                infoModalVisible: true,
                                                                                infoTitle: job.title || '',
                                                                                infoDesc: job.desc || '',
                                                                                work_dates: job.work_dates || [],
                                                                                infoCheckList: job.check_lists || [],
                                                                                year_month: job.year_month,
                                                                                infoComment: job.comment || '',
                                                                                infoStatus: job.status || 'decline',
                                                                                infoCompletion: job.completion || 0
                                                                            })}
                                                                        />
                                                                        {job.completion || 0}%
                                                                    </Col>
                                                                </Row>
                                                            :
                                                                <List.Item.Meta
                                                                    title={
                                                                        <div
                                                                            style={{width: '800px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}}
                                                                        >
                                                                            {job.title}
                                                                        </div>
                                                                    }
                                                                    description={
                                                                        <div
                                                                            style={{width: '800px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}}
                                                                        >
                                                                            {job.desc}
                                                                        </div>
                                                                    }
                                                                />
                                                        }
                                                    </List.Item>
                                                )}
                                            />
                                            // <Panel
                                            //     header={job.title}
                                            //     extra={panelExtra(item, job)}
                                            // >
                                            //     <Row>
                                            //         <Text>{job.desc}</Text>
                                            //     </Row>
                                            //     <Row>
                                            //         <Col span={14} >
                                            //             {
                                            //                 job.check_lists.map(check => (
                                            //                     <Row>
                                            //                         <Checkbox
                                            //                             defaultChecked={check.bool}
                                            //                             onChange={(e) => console.log(e.target.checked)}
                                            //                         >
                                            //                             {check.title}
                                            //                         </Checkbox>
                                            //                     </Row>
                                            //                 ))
                                            //             }
                                            //         </Col>
                                            //         <Col span={8}>
                                            //
                                            //         </Col>
                                            //     </Row>
                                            // </Panel>
                                            : <Empty />
                                        }
                                    </Card>
                                )
                                : <Empty />
                        }
                    </Col>
                </Row>
                <Modal
                    visible={this.state.modalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    closable={false}
                    footer={[
                        <Button
                            type='default'
                            size='small'
                            onClick={this.handleCancel.bind(this)}
                        >
                            Болих
                        </Button>,
                        <Button
                            type='primary'
                            size='small'
                            onClick={this.createWorkPlan.bind(this)}
                            loading={submittingWorkplan}
                        >
                            Үүсгэх
                        </Button>
                    ]}
                >
                    <Form
                        layout='vertical'
                        fields={[
                            {name: 'year_month', value: this.state.year_month}
                        ]}
                    >
                        <Form.Item
                            label='Ажиллах сар'
                            name={'year_month'}
                            rules={[
                                {
                                    required: true,
                                    message: 'Сар сонгоно уу.'
                                }
                            ]}
                        >
                            <DatePicker
                                value={this.state.year_month}
                                onChange={(e) => this.setState({
                                    year_month: e
                                })}
                                picker='month'
                                format='YYYY-MM'
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                <Drawer
                    maskClosable={false}
                    visible={this.state.drawerVisible}
                    onClose={this.handleCancel.bind(this)}
                    width={600}
                    title={this.state.jobId !== '' ? 'Ажил засах' : 'Ажил үүсгэх'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button
                                type='default'
                                onClick={this.handleCancel.bind(this)}
                                style={{marginRight: 20}}
                            >
                                Болих
                            </Button>
                            <Button
                                type='primary'
                                form='workplanJob'
                                htmlType='submit'
                            >
                                {this.state.jobId !== '' ? 'Шинэчлэх' : 'Үүсгэх'}
                            </Button>
                        </div>
                    }
                >
                    <Form
                        layout='vertical'
                        id='workplanJob'
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
                            rules={[
                                {
                                    required: true,
                                    message: 'Ажлын нэр оруулна уу.'
                                }
                            ]}
                        >
                            <Input disabled={this.state.editingApproved} value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} />
                        </Form.Item>
                        <Form.Item
                            label='Ажлын тайлбар'
                            name='desc'
                        >
                            <Input.TextArea disabled={this.state.editingApproved} value={this.state.desc} onChange={(e) => this.setState({desc: e.target.value})} />
                        </Form.Item>
                        <Form.Item
                            name='subTag'
                            label='Тэмдэглэгээ'
                        >
                            <Select value={this.state.subTag} onChange={(e) => this.setState({subTag: e})} placeholder='Тэмдэглэгээ сонгох' >
                                {
                                    subtags.length > 0 ?
                                        subtags.map(item => <Select.Option key={item._id} value={item._id}>{item.title}</Select.Option>)
                                        : null
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label='Хийх ажлын жагсаалт'
                        >
                            {/*<List*/}
                            {/*    size='small'*/}
                            {/*    dataSource={this.state.check_lists}*/}
                            {/*    renderItem={item => <List.Item>*/}
                            {/*        <Checkbox*/}
                            {/*            defaultChecked={item.bool}*/}
                            {/*            onChange={(e) => console.log(e.target.checked)}*/}
                            {/*        >*/}
                            {/*            {item.title}*/}
                            {/*        </Checkbox>*/}
                            {/*    </List.Item>}*/}
                            {/*/>*/}
                            {this.state.check_lists.length > 0 ?
                                <div style={{height: 150, overflow: 'auto'}}>
                                    {this.state.check_lists.map((c, idx) => (
                                        <Col>
                                            <div style={{position:'relative', paddingRight:30}} className={'workplan_job_hover_ss'}>
                                                <div>
                                                    <Checkbox
                                                        checked={c.bool}
                                                        onChange={e => this.onCheckListChange(e.target.checked, idx)}
                                                    >
                                                        <span>{`${idx + 1}. ${c.title}`}</span>
                                                    </Checkbox>
                                                </div>
                                                <div style={{position:'absolute', right:2, top:1}}>
                                                    <Popconfirm
                                                        title={'Ажил устгах уу?'}
                                                        okText={'Тийм'}
                                                        cancelText={'Үгүй'}
                                                        onConfirm={() => {
                                                            this.setState({
                                                                check_lists: this.state.check_lists.filter((aa, index) => idx !== index)
                                                            })
                                                        }}
                                                    >
                                                        <span className='hover_delete_button_ss'>
                                                            <DeleteFilled />
                                                        </span>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                        </Col>
                                    ))}
                                </div>
                            : <Empty description='Хоосон' style={{height: 150, float: 'left'}} />
                            }
                                <Input
                                    value={this.state.check}
                                    placeholder='Нэмэх'
                                    onChange={(e) => this.setState({check: e.target.value})}
                                    onPressEnter={this.addToDo.bind(this)}
                                    addonAfter={(<PlusOutlined style={{cursor: 'pointer'}} onClick={this.addToDo.bind(this)} />)}
                                />
                        </Form.Item>
                        <Form.Item
                            label='Ажиллах хугацаа'
                        >
                            <Calendar
                                value={moment(this.state.year_month)}
                                headerRender={() => (
                                    <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}} >
                                        <Text style={{fontSize: 16, marginRight: 7}}>{moment(this.state.year_month).format('YYYY')} оны {moment(this.state.year_month).format('M')} сар</Text>
                                    </div>
                                )}
                                // fullscreen={false}
                                // dateCellRender={(e) => this.dateCellRender(e)}
                                dateFullCellRender={(e) => this.dateCellRender(e)}
                                // onSelect={(e) => this.onCalendarSelect(e)}
                                disabledDate={this.disabledWorkDates.bind(this)}
                            />
                        </Form.Item>
                    </Form>
                </Drawer>
                <Modal
                    visible={this.state.infoModalVisible}
                    onCancel={this.handleCancel.bind(this)}
                    footer={false}
                    title={
                        <Row>
                            <Popover
                                title='Ажлын нэр'
                                content={this.state.infoTitle}
                                placement='bottom'
                            >
                                <div
                                    style={{width: '550px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all', fontSize: 16, fontWeight: 500}}
                                >
                                    {this.state.infoTitle}
                                </div>
                            </Popover>
                            {this.getStatus(this.state.infoStatus)}
                            {this.state.infoCompletion}%
                        </Row>
                    }
                    width={800}
                >
                    <Space
                        direction='vertical'
                    >
                        <span style={{display: 'block', width: 750, overflowWrap: 'break-word'}}>{this.state.infoDesc}</span>
                        <Row>
                            {
                                this.state.infoCheckList.length > 0 ?
                                    <Col span={14}>
                                        {
                                            this.state.infoCheckList.map(c => (
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
                        {
                            this.state.infoComment && this.state.infoComment !== '' ?
                                <React.Fragment>
                                    <Divider/>
                                    <b>Үлдээсэн тайлбар:</b>
                                    {this.state.infoComment}
                                </React.Fragment>
                                :
                                null
                        }
                    </Space>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Workplan)