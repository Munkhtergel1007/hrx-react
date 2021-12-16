import React from "react";
import {Col, Form, Row, Divider, Empty, Select, Button, Drawer, Popconfirm, Tooltip, Skeleton, Typography, TreeSelect} from "antd";
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
import EditableText from "./include/EditableText";
import EditableDate from "./include/EditableDate";
import moment from "moment";
const reducer = ({main, employee}) => ({main, employee});
const { Title, Text } = Typography;

class EmployeeFire extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            date: moment().format("YYYY оны MM сарын DD"),
            order: {
                number: 0,
                date: moment(),
                duty: '',
                address: 'Улаанбаатар хот',
                clerk: {
                    first_name: '',
                    last_name: '',
                    role: ''
                }
            },
            request: {

            },
            letter: {

            },
            who: {
                first_name: this.props.main?.user?.first_name || '',
                last_name: this.props.main?.user?.last_name || '',
                role: this.props.main?.employee?.role?.name || ''
            },
            lord: {
                first_name: '',
                last_name: '',
                role: 'Захирал'
            },
            whom: {
                role: this.props.employee?.empSingle?.role?.name || '',
                first_name: this.props.employee?.empSingle?.user?.first_name || '',
                last_name: this.props.employee?.empSingle?.user?.last_name || '',
                register_id: this.props.employee?.empSingle?.user?.register_id || '',
            },
            searchingForUser: false,
            staticRoles: ['lord', 'hrManager']
        };
        this.editParentState = this.editParentState.bind(this);
    }
    componentDidMount(){
        const {main: {employee}, employee: {empSingle}} = this.props;


        window.location.assign('/not-found');


        if((empSingle.staticRole || '') !== 'lord'){
            if(companyAdministrator(employee)){
                this.props.dispatch(getLord()).then(c => {
                    if(c.json?.success){
                        this.setState({
                            lord: {
                                first_name: c.json?.lord?.user?.first_name,
                                last_name: c.json?.lord?.user?.last_name,
                                role: 'Захирал'
                            }
                        })
                    }
                });
                this.props.dispatch(getEmployeeStandard({pageNum: 0, pageSize: 10, staticRole: ['hrManager', 'employee', 'chairman', 'lord'], extraProp: ['register_id']}));
                // this.props.dispatch(getRoles());
            }
        }else{
            window.location.assign('/not-found');
        }
    }
    editParentState(parent, child, e, sub){
        sub && sub !== '' ?
            this.setState({
                [parent]: {
                    ...((this.state || [])[parent] || []),
                    [child]: {
                        ...(((this.state || [])[parent] || [])[child] || []),
                        [sub]: e
                    }
                }
            })
            :
            this.setState({
                [parent]: {
                    ...((this.state || [])[parent] || []),
                    [child]: e
                }
            });
    }
    getEditableText(parent, child, placeholder, sub){
        return (
            sub && sub !== '' ?
                <EditableText
                    text={(((this.state || [])[parent] || [])[child] || [])[sub]}
                    placeholder={placeholder} changeParentState={this.editParentState}
                    parent={parent} child={child} sub={sub}
                />
                :
                <EditableText
                    text={((this.state || [])[parent] || [])[child]}
                    placeholder={placeholder} changeParentState={this.editParentState}
                    parent={parent} child={child}
                />
        )
    }
    getEditableDate(parent, child, placeholder, sub){
        return (
            sub && sub !== '' ?
                <EditableDate
                    date={(((this.state || [])[parent] || [])[child] || [])[sub]}
                    placeholder={placeholder} changeParentState={this.editParentState}
                    parent={parent} child={child}
                />
                :
                <EditableDate
                    date={((this.state || [])[parent] || [])[child]}
                    placeholder={placeholder} changeParentState={this.editParentState}
                    parent={parent} child={child}
                />
        )
    }
    onLoad(e){
        let query = {};
        let self = this;
        if((this.state.staticRoles || []).includes(e.id)){
            query = {...query, staticRole: e.id};
        }else{
            query = {...query, role: e.id};
        }
        return new Promise(resolve => {
            self.props.dispatch(getEmployeeFromRole(query)).then(c => {
                resolve(c);
            });
        })
    }
    selectEmployee(e){
        const {employee: {empSingle, roleEmployees, roles}} = this.props;
        const [_id, role] = (e || '').split("|");
        let first_name = '';
        let last_name = '';
        (roleEmployees || []).map(emp => {
            if(_id === (emp._id || 'as').toString()){
                first_name = (emp.user || {}).first_name;
                last_name = (emp.user || {}).last_name;
            }
        });
        this.setState({
            searchingForUser: false,
            order: {
                ...(this.state.order || []),
                clerk: {
                    first_name, last_name, role: printStaticRole(role),
                }
            }
        });
    }
    render(){
        const { main: {employee, company}, employee: {empSingle, roleEmployees, gettingEmployees, lord}} = this.props;
        let data = [];
        (this.state.staticRoles || []).map(staticRole => {
            data.push({id: staticRole, pId: 0, value: staticRole, title: printStaticRole(staticRole), disabled: true});
        });
        if((roleEmployees || []).length > 0 && !gettingEmployees){
            (roleEmployees || []).map(emp => {
                data.push({
                    id: `${emp._id}|${emp.parent}`,
                    pId: emp.parent, value: `${emp._id}|${emp.parent}`,
                    title: `${(emp.user || {}).last_name} ${(emp.user || {}).first_name}`,
                    isLeaf: true
                });
            });
        }
        return (
            <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                <Col span={20}>
                    <div style={{margin: '50px auto 30px'}}>
                        {
                            empSingle.staticRole === 'lord' ?
                                <Typography.Title level={2} style={{textAlign: 'center'}}>Удирдах хэрэглэгчийг ажлаас гаргах боломжгүй</Typography.Title>
                                :
                                <>
                                    <Divider orientation="left" plain>
                                        <b style={{fontSize: 16, display: 'block'}}>
                                            {
                                                (employee._id || 'as').toString() !== (empSingle._id || '').toString() &&
                                                hasAction(['edit_employee', 'delete_employee', 'create_employee'], employee) ?

                                                    'Ажлаас чөлөөлөх'
                                                    :
                                                    'Ажлаас гарах'
                                            }
                                        </b>
                                    </Divider>
                                    <Button
                                        onClick={() => this.setState({visible: true})}
                                        style={{width: '100%'}}
                                    >
                                        Тушаал гаргах
                                    </Button>
                                    {
                                        this.state.visible ?
                                            <div style={{marginTop: 20}}>
                                                <div style={{display: 'flex', justifyContent: 'center'}}>
                                                    {company.logo?.path ?
                                                        <img
                                                            onError={(e) => e.target.src = '/images/default-company.png'}
                                                            src={`${config.get('hostMedia')}${company.logo.path}`}
                                                            alt={'company logo'}
                                                        />
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <Title level={3} style={{textAlign: 'center'}}>
                                                    {company.name}
                                                </Title>
                                                <Title level={4} style={{textAlign: 'center'}}>
                                                    Захирлын тушаал
                                                </Title>
                                                <Row style={{marginTop: 40}}>
                                                    <Col span={8} style={{textAlign: 'center'}}>
                                                        {this.state.date}
                                                    </Col>
                                                    <Col span={8} style={{textAlign: 'center'}}>
                                                        Дугаар: №{this.state.order?.number}
                                                    </Col>
                                                    <Col span={8} style={{textAlign: 'center'}}>
                                                        {this.getEditableText('order', 'address', 'Байршлыг нөхөж бичнэ үү...')}
                                                    </Col>
                                                </Row>
                                                <div style={{textAlign: 'center', textDecoration: 'underline', marginTop: 30, fontSize: 16}}>Ажлаас чөлөөлөх тухай</div>
                                                <div style={{marginLeft: 40, marginTop: 20}}>
                                                    Монгол Улсын Хөдөлмөрийн Тухай Хуулийн 39.2, 40.1 дэх заалтыг үндэслэн ТУШААХ нь:
                                                </div>
                                                <ol type={1}>
                                                    <li>
                                                        {this.getEditableText('whom', 'role', 'Албан тушаалыг нөхөж бичнэ үү...')}
                                                        &nbsp;албан тушаалд ажиллаж буй&nbsp;
                                                        {this.getEditableText('whom', 'last_name', 'Ажилтны овгыг нөхөж бичнэ үү...')}
                                                        &nbsp;овогтой&nbsp;
                                                        {this.getEditableText('whom', 'first_name', 'Ажилтны нэрийг нөхөж бичнэ үү...')}
                                                        &nbsp;-ийг /РД:&nbsp;
                                                        <span style={{textTransform: 'uppercase'}}>
                                                            {this.getEditableText('whom', 'register_id', 'Ажилтны регистрийн дугаарыг нөхөж бичнэ үү...')}
                                                        </span>/&nbsp;
                                                        {this.getEditableDate('whom', 'date', 'Ажилтны чөлөөлөх хугацааг нөхөж бичнэ үү...')}
                                                        өдрөөр тасалбар болгон үүрэгт ажлаас чөлөөлсүгэй.
                                                    </li>
                                                    <li>
                                                        {this.getEditableText('whom', 'first_name', 'Ажилтны нэрийг нөхөж бичнэ үү...')}
                                                        &nbsp;-тай холбогдох журмын дагуу тооцоо бүртгэл хийж дуусгахыг&nbsp;
                                                        {
                                                            this.state.searchingForUser ?
                                                                <TreeSelect
                                                                    value={((this.state.order || {}).clerk || {}).role}
                                                                    treeData={data}
                                                                    treeDataSimpleMode
                                                                    loadData={(e) => this.onLoad(e)}
                                                                    onChange={e => this.selectEmployee(e)}
                                                                    style={{width: 350}}
                                                                />
                                                                :
                                                                this.state.order?.clerk?.role === '' ?
                                                                    <Button
                                                                        icon={<UserOutlined />} size={'small'}
                                                                        onClick={() => this.setState({searchingForUser: true})}
                                                                    >
                                                                        Хэрэглэгч сонгох
                                                                    </Button>
                                                                    :
                                                                    <Tooltip title={'Хэрэглэгч сонгох'}>
                                                                        <Button
                                                                            icon={<UserOutlined />} size={'small'}
                                                                            onClick={() => this.setState({searchingForUser: true})}
                                                                        />
                                                                    </Tooltip>
                                                        }
                                                        &nbsp;
                                                        {this.getEditableText('order', 'clerk', 'Ажилтны албан тушаалыг нөхөж бичнэ үү...', 'role')}
                                                        &nbsp;албан тушаалтай&nbsp;
                                                        {this.getEditableText('order', 'clerk', 'Ажилтны овгыг нөхөж бичнэ үү...', 'last_name')}
                                                        &nbsp;овогтой&nbsp;
                                                        {this.getEditableText('order', 'clerk', 'Ажилтны нэрийг нөхөж бичнэ үү...', 'first_name')}
                                                        &nbsp;-т даалгасугай.&nbsp;
                                                    </li>
                                                </ol>
                                                {
                                                    employee.staticRole === 'lord' ?
                                                        <div style={{textAlign: 'center'}}>
                                                            Тушаал баталсан&nbsp;
                                                            {this.getEditableText('lord', 'last_name', 'Овгыг нөхөж бичнэ үү...')}
                                                            овогтой {this.getEditableText('lord', 'first_name', 'Нэрийг нөхөж бичнэ үү...')}
                                                        </div>
                                                        :
                                                        <React.Fragment>
                                                            <div style={{textAlign: 'center'}}>
                                                                Тушаал боловсруулсан&nbsp;
                                                                {this.getEditableText('who', 'last_name', 'Овгыг нөхөж бичнэ үү...')}
                                                                овогтой {this.getEditableText('who', 'first_name', 'Нэрийг нөхөж бичнэ үү...')}
                                                            </div>
                                                            <div style={{textAlign: 'center'}}>
                                                                Тушаал баталсан&nbsp;
                                                                {this.getEditableText('lord', 'last_name', 'Овгыг нөхөж бичнэ үү...')}
                                                                овогтой {this.getEditableText('lord', 'first_name', 'Нэрийг нөхөж бичнэ үү...')}
                                                            </div>
                                                        </React.Fragment>
                                                }
                                            </div>
                                            :
                                            null
                                    }
                                </>
                        }
                    </div>
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(EmployeeFire)