import { Button, Card, Col, Drawer, Popconfirm, Row, Table, Form, Select, Tag, Input, Typography, Alert, Divider } from 'antd';
import React from 'react';
import { PlusOutlined, EyeInvisibleOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons'
import { getReceived, getCreated, changeReport, deleteReport, getReport } from '../../actions/reports_actions';
import { connect } from 'react-redux';
import { getEmployeeStandard } from '../../actions/employee_actions';
import TextArea from 'antd/lib/input/TextArea';
import { msg } from '../../config';
import Review from './Review';
import moment from 'moment';
const reducer = ({main, reports}) => ({main, reports})
const pageSize = 1;
class Report extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            isReview: false,
            isReceived: false,
            selectedEmps: [],
            title: '',
            description: '',
            searchEmp: '',
            _id: '',
            pageNumCreated: 0,
            pageNumReceived: 0,
        }
    }
    componentDidMount(){
        const {dispatch} = this.props;
        dispatch(getEmployeeStandard({pageNumber: 0, pageSize, extraProp: ['register_id']}));
        dispatch(getReport({
            pageNum: this.state.pageNumCreated,
            pageSize,
            type: 'all'
        }))
    }
    paginationCreated(e){
        let pageNum = e.current - 1;
        this.setState({pageNumCreated: pageNum})
        this.props.dispatch(getCreated({
            pageNum,
            pageSize,
            type: 'created',
        }))
    }
    paginationReceived(e){
        let pageNum = e.current - 1;
        this.setState({pageNumReceived: pageNum})
        this.props.dispatch(getReceived({
            pageNum,
            pageSize,
            type: 'received',
        }))
    }
    removeButtonHandler(_id){
        this.props.dispatch(deleteReport({_id, isRemove: true}));
    }
    searchEmployees(e){
        const {dispatch} = this.props;
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(() => {
            if(e !== '')
                dispatch(getEmployeeStandard({ search: e, extraProp: ['register_id'] }));
        }, 300);
        this.setState({...this.state, timeOut, searchEmp: e});
    }
    searchEmployeesOnBlur(){
        const {dispatch} = this.props;
        dispatch(getEmployeeStandard({
            pageNum: 0, pageSize, extraProp: ['register_id']
        }));
    }
    addSelectedEmps(e, employees){
        let selectedEmp = null;
        for(let i=0; i<employees.length; i++){
            if(employees[i]._id === e){
                selectedEmp = employees[i];
                break;
            }
        }
        for(let i=0; i<this.state.selectedEmps.length; i++){
            if(this.state.selectedEmps[i]._id === e)
                return
        }
        this.setState({
            selectedEmps: [...this.state.selectedEmps, { _id: selectedEmp._id, user: selectedEmp.user }],
            searchEmp: ''
        })
    }
    clearState(){
        this.setState({
            visible: false,
            isReview: false,
            isReceived: false,
            selectedEmps: [],
            title: '',
            description: '',
            searchEmp: '',
            _id: '',
            pageNumCreated: 0,
            pageNumReceived: 0,
        })
    }
    handleSubmit(){
        const { selectedEmps, title, description, _id } = this.state;
        if(selectedEmps.length === 0)
            return msg('warning', 'Илгээх ажилтан оруулна уу.');
        if(title === '')
            return msg('warning', 'Гарчиг оруулна уу.');
        let params = {
            title, description, _id,
            sharedEmps: (selectedEmps || []).map(emp => {
                return { emp: emp._id, user: emp.user._id }
            }),
            createdBy: {
                emp: this.props.main.employee._id,
                user: this.props.main.employee.user
            },
        }
        this.props.dispatch(changeReport(params))
        this.clearState()
        
    }
    deleteButtonHandler(_id){
        this.props.dispatch(deleteReport({_id}));
    }
    reviewHandler(record, isReceived = false){
        if(isReceived){
            this.props.dispatch(changeReport({
                _id: record?._id
            }))
        }
        this.setState({
            isReview: true,
            description: record?.description, 
            selectedEmps: (record?.shared_to || []).map(emp => {
                return { _id: emp?.emp?._id, user: emp?.user, viewed: emp?.viewed }
            }),
            title: record.title,
            isReceived: isReceived
        });
        
      
    }
    deleteVisible(){
        this.setState({
            visible: false,
            isReview: false,
            isReceived: false,
            selectedEmps: [],
            title: '',
            description: '',
            searchEmp: '',
            _id: '',
        })
    }
    render() { 
        let { reports: { 
            createdReports, receivedReports, 
            deletingReport, gettingCreated, 
            gettingReceived, totalReceived, 
            totalCreated, employees 
        }} = this.props;
        employees = employees.filter(emp => emp._id !== this.props.main.employee._id);
        const columnsForCreated = [
            {
                title: '№',
                width: 50,
                render: (text, record, idx) => this.state.pageNumCreated*pageSize + idx + 1
            },
            {
                title: 'Гарчиг',
                render: record => record?.title
            },
            {
                title: 'Дэлгэрэнгүй',
                ellipsis: true,
                width: '500px',
                render: record => 
                <Typography.Text ellipsis >{record?.description}</Typography.Text>
            },
            {
                title: 'Хүлээн авагч',
                ellipsis: true,
                render: record => 
                    (record.shared_to || []).map((emp, i) => <Tag key={i}>{emp?.user?.first_name}</Tag>)
            },
            {
                title: 'Огноо',
                ellipsis: true,
                render: record => moment((record || {}).created).format('YYYY/MM/DD HH:mm')
            },
            {
                title: 'Үйлдэл',
                width: 130,
                render: record =>
                <div>
                    <Button 
                        style={{marginRight: 5}}
                        icon={<MoreOutlined />} 
                        onClick={() => this.reviewHandler(record)}
                    />
                    <Popconfirm
                        title='Тайланг арилгах уу?'
                        okText='Тийм'
                        cancelText='Үгүй'
                        onConfirm={() => this.removeButtonHandler(record._id)}
                    >
                        <Button type='primary' style={{marginRight: 5}} icon={<EyeInvisibleOutlined />} />
                    </Popconfirm>
                    <Popconfirm
                        title='Тайланг устгах уу?'
                        okText='Тийм'
                        cancelText='Үгүй'
                        onConfirm={() => this.deleteButtonHandler(record._id)}
                    >
                        <Button type='danger' icon={<DeleteOutlined/>} loading={deletingReport} />
                    </Popconfirm>
                </div>
            },
            
        ]
        const columnsForRecieved = [
            {
                title: '№',
                width: 50,
                render: (text, record, idx) => this.state.pageNumReceived*pageSize + idx + 1
            },
            {
                title: 'Гарчиг',
                render: record => record?.title
            },
            {
                title: 'Дэлгэрэнгүй',
                ellipsis: true,
                width: '500px',
                render: record => 
                <Typography.Text ellipsis >{record?.description}</Typography.Text>
            },
            {
                title: 'Илгээгч',
                ellipsis: true,
                render: record => 
                    <Tag>{record.created_by?.user?.first_name}</Tag>
            },
            {
                title: 'Огноо',
                ellipsis: true,
                render: record => moment((record || {}).created).format('YYYY/MM/DD HH:mm')
            },
            {
                title: 'Үйлдэл',
                width: 130,
                render: record => 
                <div>
                    <Button 
                        style={{marginRight: 5}}
                        icon={<MoreOutlined />}
                        onClick={() => this.reviewHandler(record, true)}
                    />
                    <Popconfirm
                        title='Тайланг арилгах уу?'
                        okText='Тийм'
                        cancelText='Үгүй'
                        onConfirm={() => this.deleteButtonHandler(record._id)}
                    >
                        <Button type='primary' icon={<EyeInvisibleOutlined />} loading={deletingReport} />
                    </Popconfirm>
                </div>
            }
        ]
        const drawerButtons = 
            <div style={{textAlign: 'right'}}>
                <Button 
                    style={{marginRight: 20}}
                    htmlType='button'
                    onClick={() => this.clearState()}
                >
                    Болих
                </Button>
                <Button
                    type='primary'
                    htmlType='submit'
                    form='report'
                >
                    Илгээх
                </Button>
            </div>

        createdReports.forEach((report, idx) => {report.key = idx});
        receivedReports.forEach((report, idx) => {report.key = idx});
        
        let paginationForCreated = {
            total: totalCreated,
            current: this.state.pageNumCreated + 1,
            pageSize: pageSize,
            position: 'bottom',
            showSizeChanger: false,
            size: 'small'
        };
        let paginationForReceived = {
            total: totalReceived,
            current: this.state.pageNumReceived + 1,
            pageSize,
            position: 'bottom',
            showSizeChanger: false,
            size: 'small'
        };
        return (
            <>
            <Card
                title='Тайлан'
                extra={
                    <Button
                        type='primary'
                        icon={<PlusOutlined/>}
                        onClick={() => {
                            this.clearState();
                            this.setState({visible: true})
                        }}
                    >
                        Тайлан үүсгэх
                    </Button>
                }
            >
                <Row>
                    <Col span='24'>
                        <Divider orientation={'left'}>Илгээсэн</Divider>
                        <Table
                            onChange={e => this.paginationCreated(e)}
                            dataSource={createdReports}
                            columns={columnsForCreated}
                            loading={gettingCreated}
                            pagination={paginationForCreated}
                            // title={() => 'Илгээсэн'}
                            size='small'
                        />
                        <Divider orientation={'left'}>Хүлээн авсан</Divider>
                        <Table
                            onChange={e => this.paginationReceived(e)}
                            dataSource={receivedReports}
                            columns={columnsForRecieved}
                            loading={gettingReceived}
                            pagination={paginationForReceived}
                            title={() => 'Хүлээн авсан'}
                            size='small'
                          
                        />
                    </Col>
                </Row>
            </Card>

            {/* Drawer */}
            <Drawer
                title='Тайлан үүсгэх'
                onClose={() => this.clearState()}
                width={720}
                visible={this.state.visible}
                key='drawer-report'
                footer={drawerButtons}
                maskClosable={false}
            >
                <Row justify='center' align='center'>
                    <Col span={22}>
                        <Form
                            size='small' id='report' layout='vertical'
                            onFinish={() => this.handleSubmit()}
                        >
                            {/* Select employee */}
                            <Form.Item
                                label='Ажилтан сонгох'
                                rules={[{required: true, message: 'Ажилтан сонгоно уу!'}]}
                            >
                                <Select
                                    showSearch
                                    allowClear
                                    placeholder='Ажилтан оруулна уу.'
                                    onSearch={e => this.searchEmployees(e)}
                                    onBlur={() => this.searchEmployeesOnBlur()}
                                    onSelect={(e) => this.addSelectedEmps(e, employees)}
                                    filterOption={false}
                                    value={this.state.searchEmp}
                                >
                                    {
                                        (employees || []).map(emp =>
                                            <Select.Option
                                                value={emp._id}
                                                key={emp._id}
                                            >
                                                {
                                                    (emp.user || {}).last_name.toString().charAt(0).
                                                    toUpperCase()+(emp.user || {}).last_name.toString().
                                                    slice(1)
                                                } {
                                                    (emp.user || {}).first_name.toString().charAt(0).
													toUpperCase()+(emp.user || {}).first_name.toString().
													slice(1)
												}
												{
                                                    emp.user.register_id ? ` | ${emp.user.register_id}` : null
												}
                                            </Select.Option>
                                        )
                                    }
                                </Select>
                            </Form.Item>
                            {
                                this.state.selectedEmps.length > 0 ?
                                <Form.Item label='Илгээх ажилчид'>
                                    {
                                        (this.state?.selectedEmps || []).map(emp =>
                                        <Tag key={emp._id} closable
                                            onClose={() => this.setState({
                                                selectedEmps: this.state.selectedEmps.filter(x => x._id !== emp._id )
                                            })}
                                        >
                                            {((emp.user || {}).last_name[0] || []).toUpperCase()}.
											{(emp.user || {}).first_name.toString().charAt(0).toUpperCase()+(emp.user || {}).first_name.toString().slice(1)}
                                        </Tag>
                                        )
                                    }
                                </Form.Item>
                                :
                                    <Form.Item label='Илгээх ажилчид'>
                                        <Alert message="Илгээх ажилчдаа сонгоно уу" type="warning" />
                                    </Form.Item>
                            }
                            {/* Title */}
                            <Form.Item
                                label='Гарчиг'
                                rules={[{
                                    required: this.state.title === '',
                                    message: 'Гарчиг оруулна уу!'
                                }]}
                            >
                                <Input
                                    value={this.state.title}
                                    onChange={e => this.setState({title: e.target.value})}
                                />
                            </Form.Item>
                            {/* Description */}
                            <Form.Item label='Дэлгэрэнгүй'>
                                <TextArea
                                    value={this.state.description}
                                    autoSize={{minRows: 4, maxRows: 10}}
                                    onChange={e => this.setState({
                                        description: e.target.value
                                    })}
                                />
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Drawer>
            <Review 
                visible={this.state.isReview} 
                title={this.state.title}
                description={this.state.description}
                selectedEmps={this.state.selectedEmps}
                deleteVisible={this.deleteVisible.bind(this)}
                emp={this.props.main.user}
                isReceived={this.state.isReceived}
            />
            </>
        );
    }
}
 
export default connect(reducer)(Report)