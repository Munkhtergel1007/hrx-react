import React from "react";
import {
    Col,
    Form,
    Row,
    Divider,
    Empty,
    Select,
    Button,
    Alert,
    Popconfirm,
    Tooltip,
    Skeleton,
    Typography,
    Space,
    Modal
} from "antd";
import {connect} from 'react-redux'
import config, {
    uuidv4,
    hasAction,
    isValidDate,
    printMnDay,
    printStaticRole,
    companyAdministrator
} from "../../config";
import { EditOutlined, PlusOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { getEmployeeStandard, getRoles, getLord, getEmployeeFromRole } from "../../actions/employee_actions";
import moment from "moment";
const reducer = ({main, employee}) => ({main, employee});
import {deleteEmployee} from '../../actions/employee_actions'
const { Title, Text } = Typography;

class EmployeeFire extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            employee: {},
            employeeSearch: '',
        };
    }
    componentDidMount(){
        const {main: {employee}, employee: {empSingle}} = this.props;
        if((empSingle || {}).staticRole && (empSingle || {}).staticRole !== 'lord' && companyAdministrator(employee)){
            this.props.dispatch(getEmployeeStandard({pageNum: 0, pageSize: 5, staticRole: ['hrManager', 'employee', 'chairman', 'lord'], extraProp: ['register_id']}));
        }else{
            window.location.assign('/not-found');
        }
    }
    deleteEmployee(record) {
        const {
            dispatch
        } = this.props;
        if(this.state.employee && (Object.keys(this.state.employee) || []).length > 0){
            this.setState({
                visible: false
            }, () => dispatch(deleteEmployee({emp: (record || {})._id, written_by: this.state.employee._id})).then(c => {
                if(c.json.success){
                    window.location.assign('/workers');
                }
            }))
        }else{
            return config.get('emitter').emit('warning', 'Тодорхойлох захидал бичих хэрэглэгчийн оруулна уу.');
        }
    }
    searchEmployees(e){
        let self = this;
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(function(){
            self.setState({
                employeeSearch: e, timeOut: timeOut
            }, () => {
                const {employee:{user}} = self.props;
                self.props.dispatch(getEmployeeStandard({
                    pageNum: 0, pageSize: 5,
                    staticRole: ['hrManager', 'employee', 'chairman', 'lord'],
                    search: self.state.employeeSearch, getAvatars: true, subsidiaries:true
                }));
            });
        }, 500);
    }
    selectEmployee(e){
        const {employee:{employees}} = this.props;
        let selected = {};
        (employees || []).map(emp => {
            if((e || 'as').toString() === ((emp || {})._id || '').toString()){
                selected = emp;
            }
        })
        this.setState({employee: selected});
    }
    render(){
        const { main: {employee, company}, employee: {empSingle, roleEmployees, gettingEmployees, employees, deletingEmployee}} = this.props;
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                    <Col span={20}>
                        <div style={{margin: '50px auto 30px'}}>
                            {
                                (empSingle || {}).staticRole === 'lord' ?
                                    <Typography.Title level={2} style={{textAlign: 'center'}}>Удирдах хэрэглэгчийг ажлаас гаргах боломжгүй</Typography.Title>
                                    :
                                    <>
                                        <Divider orientation="left" plain>
                                            <b style={{fontSize: 16, display: 'block'}}>
                                                Ажлаас чөлөөлөх
                                            </b>
                                        </Divider>
                                        <Button
                                            style={{width: '100%'}} disabled={deletingEmployee}
                                            onClick={() => this.setState({visible: true})}
                                        >
                                            Ажлаас чөлөөлөх
                                        </Button>
                                        {/*reference shuud uusgeh daraa ni hereglegchid reference baigaa esehiig endees shalgaj asuuna. Bichuuleh huniig songoh. */}
                                    </>
                            }
                        </div>
                    </Col>
                </Row>
                <Modal
                    visible={this.state.visible}
                    maskClosable={false}
                    onCancel={() => this.setState({visible: false, user: {}, userSearch: ''})}
                    title={
                        (((empSingle || {}).user || {}).last_name || '').slice(0,1).toUpperCase()+
                        (((empSingle || {}).user || {}).last_name || '').slice(1,(((empSingle || {}).user || {}).last_name || '').length) + " " +
                        (((empSingle || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                        (((empSingle || {}).user || {}).first_name || '').slice(1,(((empSingle || {}).user || {}).first_name || '').length)
                    }
                    footer={<Space direction={'horizontal'}>
                        <Button onClick={() => this.setState({visible: false, user: {}, userSearch: ''})}>Болих</Button>
                        <Popconfirm
                            title={'Ажилтанг чөлөөлөх үү?'}
                            onConfirm={() => this.deleteEmployee(empSingle)} okText={'Тийм'} cancelText={'Үгүй'}
                            disabled={!((this.state.employee || {}).user && Object.keys((this.state.employee || {}).user || {}).length > 0)}
                        >
                            <Button
                                type={'primary'}
                                disabled={!((this.state.employee || {}).user && Object.keys((this.state.employee || {}).user || {}).length > 0)}
                            >
                                Ажлаас чөлөөлөх
                            </Button>
                        </Popconfirm>
                    </Space>}
                >
                    <Alert
                        message="Ажлаас чөлөөлөх"
                        description="Хүсэлтийг явуулснаар хэрэглэгч компаний хуудас руу нэвтрэх эрхгүй болно."
                        type="warning"
                        showIcon
                        style={{marginBottom: 10}}
                    />
                    <b>
                        {
                            (this.state.employee || {}).user && Object.keys((this.state.employee || {}).user || {}).length > 0 ?
                                (((this.state.employee || {}).user || {}).last_name || '').slice(0,1).toUpperCase()+
                                (((this.state.employee || {}).user || {}).last_name || '').slice(1,(((this.state.employee || {}).user || {}).last_name || '').length) + " " +
                                (((this.state.employee || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                                (((this.state.employee || {}).user || {}).first_name || '').slice(1,(((this.state.employee || {}).user || {}).first_name || '').length)
                                :
                                'Тодорхойлох захидал бичих хүнийг сонгоно уу.'
                        }
                    </b>
                    <Select
                        loading={status || gettingEmployees}
                        // disabled={status || gettingEmployees}
                        style={{width: '100%', position: 'relative'}}
                        allowClear showSearch={true}
                        placeholder="Хэрэглэгчийн нэр, овог болон утсаар хайх"
                        onSelect={(e) => this.selectEmployee(e)}
                        onClear={() => this.setState({user: {}, userSearch: ''})}
                        onSearch={this.searchEmployees.bind(this)}
                        filterOption={false}
                        value={(this.state.employee || {})._id}
                        dropdownClassName={'reference-letter-dropdown'}
                        dropdownRender={(record) =>
                            ((record.props || {}).options || []).length > 0 ?
                                ((record.props || {}).options || []).map((opt, index) =>
                                    <Row
                                        key={`multiple-column-select-column-${index}-reference`}
                                        className={((this.state.employee || {})._id || 'a').toString() === opt.value ? 'row active' : 'row'}
                                        onClick={() => this.selectEmployee(opt.value)}
                                        style={{display: 'flex', alignItems: 'center'}}
                                    >
                                        {
                                            (
                                                opt.children || []).map((child, ind) =>
                                                typeof child === 'object' ?
                                                    <div style={{borderRadius: '50%', overflow: 'hidden', marginRight: 10}}
                                                         key={`multiple-column-select-row-${ind}-reference`}
                                                    >
                                                        <img
                                                            style={{width: 30, height: 30, objectFit: 'cover', objectPosition: 'center'}}
                                                            src={(child.props || {}).src ?
                                                                (child.props || {}).src
                                                                :
                                                                '/images/default-avatar.png'}
                                                            onError={(e) => e.target.src = '/images/default-avatar.png'}
                                                        />
                                                    </div>
                                                    :
                                                    <span
                                                        key={`multiple-column-select-span-${ind}-reference`}
                                                        style={{fontWeight: 'bold', fontSize: 15, display: 'inline-block'}}
                                                    >{child}</span>
                                            )
                                        }
                                    </Row>
                                )
                                :
                                <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Хайлтын илэрц олдсонгүй!</span>} />
                        }
                    >
                        {
                            (employees || []).map(emp =>
                                <Select.Option value={emp._id} key={emp._id}>
                                    <img
                                        style={{display: 'none'}}
                                        src={((emp.user || {}).avatar || {}).path ?
                                            `${config.get('hostMedia')}${((emp.user || {}).avatar || {}).path}`
                                            :
                                            '/images/default-avatar.png'}
                                        onError={(e) => e.target.src = '/images/default-avatar.png'}
                                    />
                                    {
                                        (((emp || {}).user || {}).last_name || '').slice(0,1).toUpperCase()
                                    }.
                                    {
                                        (((emp || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                                        (((emp || {}).user || {}).first_name || '').slice(1,(((emp || {}).user || {}).first_name || '').length)
                                    }
                                </Select.Option>
                            )
                        }
                    </Select>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(EmployeeFire)