/**
 * Created by MEGA on 2020-10-12.
 */
import React, { Component } from "react";
import { connect } from 'react-redux';
// import {Col, Row, Table} from 'react-bootstrap';
import {Layout, Typography, Tooltip, Col, Row, Table} from "antd";
import {
    SwapOutlined
} from '@ant-design/icons';
const {Header, Content} = Layout;
const {Title} = Typography;
import {
    LogoutOutlined
} from '@ant-design/icons';
import config, {printStaticRole} from "../../config";
import * as actions from "../../actions/massAttendance_actions";
import moment from "moment";
import Select from "react-dropdown-select";
import {Link} from "react-router-dom";
const reducer = ({ main, massAttendance }) => ({ main, massAttendance });
class GuardHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 5000, // if null default will be 10000
            clearDelay: 5000, // if null default will be 10000
            limit: 50,
            singleRecord: null,
            focused:true,
            records: [],
            rawIds: [],

            pageSize: 50,
            pageNum: 0,

            guard_registration_error: {}
        };
    }
    // 10n second burt yvuulah  [START]

    // componentDidMount() {
    //     const { dispatch, main:{ company, erp_role, erp_family }, massAttendance:{members} } = this.props;
    //     if(erp_role && erp_role === 'guard' && company){
    //         let arr = localStorage.getItem('records');
    //         if(arr){
    //             arr = JSON.parse(arr);
    //         } else {
    //             arr = [];
    //         }
    //         let rawIds = localStorage.getItem('rawIds');
    //         if(arr){
    //             rawIds = JSON.parse(rawIds);
    //         } else {
    //             rawIds = [];
    //         }
    //         this.setState({ records: arr, rawIds: rawIds });
    //         this.timer = setInterval( () => this.exe(), (this.state.delay || 10000));
    //         dispatch(actions.getStudentsGuard({pageSize: this.state.pageSize, pageNum: this.state.pageNum}));
    //     } else if(erp_family) {
    //         this.props.history.replace('/family');
    //     } else {
    //         this.props.history.replace('/not-found');
    //     }
    // }
    // componentWillUnmount() {
    //     clearInterval(this.timer);
    // }
    // exe() {
    //     const { dispatch, main:{ company }, massAttendance:{ members, successInserted, failedInserted } } = this.props;
    //     let rawIds = localStorage.getItem('rawIds');
    //     if(rawIds){
    //         rawIds = JSON.parse(rawIds);
    //     } else {
    //         rawIds = [];
    //     }
    //     let pushedIds = localStorage.getItem('pushedIds');
    //     if(pushedIds){
    //         pushedIds = JSON.parse(pushedIds);
    //     } else {
    //         pushedIds = [];
    //     }
    //     let removeIds = (successInserted || []).map(r => r.employee._id);
    //     pushedIds = pushedIds.map(function (r) {
    //         if(removeIds.includes(r.employee._id)){
    //             return null
    //         }
    //         return r;
    //     }).filter(r => r);
    //     rawIds = [...(failedInserted || []), ...(rawIds || []), ...(this.state.records || []) ];
    //     this.setState({records: []});
    //     if(rawIds && rawIds.length>0){
    //         let holdRawIds = [];
    //         let holdCookingIds = [];
    //         if(this.state.limit){
    //             holdCookingIds = rawIds.slice(0, this.state.limit);
    //             holdRawIds = rawIds.slice(this.state.limit, rawIds.length);
    //         } else {
    //             holdCookingIds = rawIds;
    //             holdRawIds = [];
    //         }
    //         if(members && members.length>0){
    //             let holdPushingItems = [];
    //             holdCookingIds.map(function (cookingId, idx) {
    //                 let hold = {};
    //                 let check = false;
    //                 members.map(function(r){
    //                     if(r.cardId && r.cardId !=='' && r.cardId.toString() === (cookingId.id || '').toString()){
    //                         hold = {employee:r, localTime: cookingId.localTime, company: company._id, group_id: r.group, role: r.role[0]};
    //                         check = true;
    //                     }
    //                 });
    //                 if(check){
    //                     holdPushingItems.push(hold);
    //                 }
    //             });
    //             localStorage.setItem('pushedIds', JSON.stringify([...pushedIds, ...holdPushingItems]));
    //             localStorage.setItem('rawIds', JSON.stringify(holdRawIds));
    //             if(holdPushingItems && holdPushingItems.length>0){
    //                 dispatch(actions.insertMassAttendance({records:holdPushingItems, removeIds:removeIds}));
    //             }
    //         } else {
    //             return config.get('emitter').emit('error', ("Бүртгэлтэй хэрэглэгч алга байна!"));
    //         }
    //     } else if((successInserted && successInserted.length>0) || (failedInserted && failedInserted.length>0)){
    //         localStorage.setItem('pushedIds', JSON.stringify(pushedIds));
    //         dispatch(actions.clearSuccessAndFailed({removeIds:removeIds}));
    //     }
    // }
    // onChange(e){
    //     this.setState({singleRecord:e.target.value});
    // }
    // set(e){
    //     e.preventDefault();
    //     const {massAttendance:{massAttendance}} = this.props;
    //     const regex = /^\d+$/;
    //     const regex1 = /^[0-9]{10}$/;
    //     if(this.state.singleRecord && regex1.test(this.state.singleRecord)){
    //         // if(massAttendance && massAttendance.length>0){
    //         //     if(!massAttendance.some(r => r.employee && r.employee.cardId && r.employee.cardId.toString() === this.state.singleRecord.toString())){
    //         //         let hold = { id:this.state.singleRecord, localTime:new Date() };
    //         //         this.setState({singleRecord:null, records: [...this.state.records, hold]});
    //         //     }
    //         // } else {
    //         //     let hold = { id:this.state.singleRecord, localTime:new Date() };
    //         //     this.setState({singleRecord:null, records: [...this.state.records, hold]});
    //         // }
    //         let hold = { id:this.state.singleRecord, localTime:new Date() };
    //         this.setState({singleRecord:null, records: [...this.state.records, hold]});
    //     } else {
    //         let ch = this.state.singleRecord.slice(-10);
    //         if(this.state.singleRecord && regex1.test(ch)){
    //             // if(massAttendance && massAttendance.length>0){
    //             //     if(!massAttendance.some(r => r.employee && r.employee.cardId && r.employee.cardId.toString() === ch.toString())){
    //             //         let hold = { id:ch, localTime:new Date() };
    //             //         this.setState({singleRecord:null, records: [...this.state.records, hold]});
    //             //     }
    //             // } else {
    //             //     let hold = { id:ch, localTime:new Date() };
    //             //     this.setState({singleRecord:null, records: [...this.state.records, hold]});
    //             // }
    //             let hold = { id:ch, localTime:new Date() };
    //             this.setState({singleRecord:null, records: [...this.state.records, hold]});
    //         } else {
    //             this.setState({ singleRecord:null });
    //         }
    //     }
    // }
    // onFocus(){
    //     this.setState({focused:true});
    // }
    // onBlur(){
    //     this.setState({focused:false});
    // }
    // focusInput(){
    //     const element = document.getElementById('record');
    //     element.focus();
    //     this.setState({focused:true});
    // }
    // clearAll(){
    //     localStorage.clear();
    // }



    // 10n second burt yvuulah  [END]
    // deesh

    // *** //

    // doosh
    // Card unshih burd 1 1-eer dispatch yvuulah [START]

    componentDidMount() {
        const { dispatch, main:{ company, employee }, massAttendance:{members} } = this.props;
        const dis = this;
        this.err = config.get('emitter').addListener("guard_registration_error", function (data) {
            dis.setState({
                guard_registration_error: data
            });
        });
        if(employee && employee.staticRole === 'attendanceCollector' && company){
            // this.timer = setInterval( () => this.exe(), (this.state.delay || 10000));
            this.clearTimer = setInterval( () => this.clearRecentAttendances(), (this.state.clearDelay || 10000));
            let pushedIds = localStorage.getItem('pushedIds');
            if(pushedIds){
                pushedIds = JSON.parse(pushedIds);
            } else {
                pushedIds = [];
            }
            dispatch(actions.getStudentsGuard({pageSize: this.state.pageSize, pageNum: this.state.pageNum}));
            if(pushedIds && pushedIds.length>0){
                dispatch(actions.insertMassAttendanceOneByOne({records:pushedIds}));
            }
        }else {
            this.props.history.replace('/not-found');
        }
    }
    componentWillUnmount() {
        this.err.remove();
        clearInterval(this.clearTimer);
    }
    clearRecentAttendances(){
        const { dispatch, massAttendance:{recentStud} } = this.props;
        if(recentStud && recentStud.length>0){
            if( (recentStud[0] || {}).student || (recentStud[1] || {}).student || (recentStud[2] || {}).student ){
                console.log(moment(new Date()).format("YYYY/MM/DD H:mm ss"));
                dispatch(actions.clearRecentAttendances());
            }
        }
    }
    onChange(e){
        this.setState({singleRecord:e.target.value});
    }
    set(e){
        e.preventDefault();
        const {dispatch, massAttendance:{massAttendance}, main:{company}} = this.props;
        const regex = /^\d+$/;
        const regex1 = /^[0-9]{10}$/;
        if(this.state.singleRecord && regex1.test(this.state.singleRecord)){
            // let hold = { id:this.state.singleRecord, localTime:new Date(), erpId:company._id };
            let hold = { id:this.state.singleRecord, localTime:new Date() };
            this.setState({singleRecord:null, guard_registration_error:{}});
            clearInterval(this.clearTimer);
            this.clearTimer = setInterval( () => this.clearRecentAttendances(), (this.state.clearDelay || 10000));
            dispatch(actions.registerStudentGuardOneByOne(hold));
        } else {
            let ch = this.state.singleRecord.slice(-10);
            if(this.state.singleRecord && regex1.test(ch)){
                // let hold = { id:ch, localTime:new Date(), erpId:company._id };
                let hold = { id:ch, localTime:new Date() };
                this.setState({singleRecord:null, guard_registration_error:{}});
                clearInterval(this.clearTimer);
                this.clearTimer = setInterval( () => this.clearRecentAttendances(), (this.state.clearDelay || 10000));
                dispatch(actions.registerStudentGuardOneByOne(hold));
            } else {
                this.setState({ singleRecord:null });
            }
        }
    }
    onFocus(){
        this.setState({focused:true});
    }
    onBlur(){
        this.setState({focused:false});
    }
    focusInput(){
        const element = document.getElementById('record');
        element.focus();
        this.setState({focused:true});
    }
    clearAll(){
        localStorage.clear();
    }

    // Card unshih burd 1 1-eer dispatch yvuulah [END]
    render() {
        const { main:{erp_role, company, user}, massAttendance:{memberUpdated, members, status, massAttendance, all, recentStud, allTeacher, allStudent, allStudentAtt, allTeacherAtt} } = this.props;
        let rawIds = [];
        // let rawIds = localStorage.getItem('rawIds');
        // if(rawIds){
        //     rawIds = JSON.parse(rawIds);
        // } else {
        //     rawIds = [];
        // }
        // let pushedIds = [];
        let pushedIds = localStorage.getItem('pushedIds');
        if(pushedIds){
            pushedIds = JSON.parse(pushedIds);
        } else {
            pushedIds = [];
        }
        function avatar(innerUser){
            let avatar;
            if (!innerUser.path || innerUser.path === '') {
                avatar = "/imagesSchool/default-avatar.png";
            } else {
                if(process.env.NODE_ENV === 'development'){
                    avatar = innerUser.path.indexOf('http') > -1 ? innerUser.path : `http://cdn.hrx.com${ innerUser.path}`;
                } else {
                    avatar = innerUser.path.indexOf('http') > -1 ? innerUser.path : `https://cdn.tatatunga.mn${ innerUser.path}`;
                }
            }
            return avatar;
        }
        let nowTeacher = 0, nowStudent = 0;
        if(allTeacher && allTeacher!==0){
            nowTeacher = Math.ceil(((allTeacherAtt || []).length) * 100 / allTeacher);
        }
        if(allStudent && allStudent!==0){
            nowStudent = Math.ceil(((allStudentAtt || []).length) * 100 / allStudent);
        }
        let logo = '/images/default-company.png';
        if(company.logo && (company.logo || {}).path !== ''){
            logo = `${config.get('hostMedia')}${(company.logo || {}).path}`;
        }
        const columns = [{
            title: '№',
            key: 'index',
            render: (text, record, idx) => (massAttendance || []).findIndex(elem => {return elem.localTime === record.localTime}) + 1
        },{
            title: 'Нэр',
            dataIndex: 'user',
            key: 'first_name',
            render: user => (user || {}).first_name
        },{
            title: 'Овог',
            dataIndex: 'user',
            key: 'last_name',
            render: user => (user || {}).last_name
        },{
            title: 'Албан тушаал',
            dataIndex: 'employee',
            key: 'staticRole',
            render: emp =>  printStaticRole((emp || {}).staticRole)
        },{
            title: 'Цаг',
            dataIndex: 'localTime',
            key: 'localTime',
            render: time => moment(time).format("YYYY/MM/DD H:mm:ss")
        }];
        return (
                <Layout style={{backgroundColor: 'rgb(240, 242, 245)', minHeight: '100vh', height:'100%', minWidth: '1200px'}}>
                    <Header style={{display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        {
                            company.logo ?
                                <img src={`${config.get('hostMedia')}${(company.logo || {}).path}`} style={{width: '40px', borderRadius: '50%', height: '40px', objectFit: 'cover', objectPosition: 'center', marginRight: '10px'}}/>
                                :
                                null
                        }
                        <Title level={2} style={{color: '#fff', marginBottom: '0'}}>{company.name}</Title>
                        <div style={{position: 'absolute', right: '10px', borderRadius: '50%', width: '40px', height: '40px', backgroundColor: '#FFF'}}>
                            <a href="/logout" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
                                <LogoutOutlined style={{color: 'black'}} />
                            </a>
                        </div>
                    </Header>
                    <Content style={{marginTop: '50px', display: 'flex', justifyContent: 'center'}}>
                        <div className='guard-home' onClick={this.focusInput.bind(this)}>
                            <div className='guard-home-member-updated'>
                                <span style={{marginRight: 20}}>
                                    {memberUpdated && memberUpdated.bool?
                                        <span>Өгөгдөл шинэчлэлт амжилттай</span>
                                        :
                                        <span style={{color:'red'}}>Өгөгдөл шинэчлэлт амжилтгүй</span>
                                    }
                                </span>
                                {memberUpdated && memberUpdated.date?
                                    <span>Сүүлд шинэчлэгдсэн: {memberUpdated.date? moment(memberUpdated.date).format("YYYY/MM/DD H:mm") : ''}</span>
                                    :
                                    null
                                }
                            </div>
                            <div className='data-info'>
                                {/*<OverlayTrigger*/}
                                {/*    placement={"bottom"}*/}
                                {/*    overlay={*/}
                                {/*        <Tooltip id={`tooltip-bottom`}>*/}
                                {/*            Бүртгэгдээгүй*/}
                                {/*        </Tooltip>*/}
                                {/*    }*/}
                                {/*>*/}
                                {/*    <span className='rawIds'>*/}
                                {/*        <ion-icon style={{position:'relative', top: 5, fontSize: 20, marginRight: 5}} name="code-download-outline" />*/}
                                {/*        {rawIds && rawIds.length? rawIds.length : 0}*/}
                                {/*    </span>*/}
                                {/*</OverlayTrigger>*/}
                                <Tooltip placement='bottom' title='Хариу хүлээж байгаа'>
                                    <span className='pushedIds'>
                                        {/*<ion-icon style={{position:'relative', top: 5, fontSize: 20, marginRight: 5}} name="code-working-outline"/>*/}
                                        <SwapOutlined style={{marginRight: '5px'}} />
                                        {pushedIds && pushedIds.length? pushedIds.length : 0}
                                    </span>
                                </Tooltip>
                                {/*<button onClick={this.clearAll.bind(this)}>Устгах</button>*/}
                                <div className='inputFocus' onClick={this.focusInput.bind(this)}>
                                    {this.state.focused ?
                                        <span className='focused'>
                                                        Бүртгэж байна...
                                                    </span>
                                        :
                                        <span className='unfocused'>
                                                        Бүртгэл зогссон!
                                                    </span>
                                    }
                                </div>
                            </div>
                            <form onSubmit={this.set.bind(this)} className='mass-record' style={{display:'inline-block'}}>
                                <input
                                    value={this.state.singleRecord ? this.state.singleRecord : ''}
                                    name='record'
                                    ref="record"
                                    id='record'
                                    autoComplete='off'
                                    onChange={this.onChange.bind(this)}
                                    autoFocus={true}
                                    onFocus={this.onFocus.bind(this)}
                                    onBlur={this.onBlur.bind(this)}
                                />
                            </form>
                            <div className='niit-irts'>Нийт ирц: {all? all : 0} </div>
                            {/*<div className='niit-irts-role'>*/}
                            {/*    <span className='niit-irts-role-teacher'>{`Багш: ${nowTeacher}%`}</span>*/}
                            {/*    <span className='niit-irts-role-student'>{`Сурагч: ${nowStudent}%`}</span>*/}
                            {/*</div>*/}
                            <div className='curret-irts'>
                                {recentStud && recentStud.length>0?
                                    recentStud.map(r =>
                                        <div className='curret-irts-single'>
                                            {r.registered?
                                                r.student && r.student.employee?
                                                    <Row style={{height: '100px'}} className={r.current? 'current' : ''}>
                                                        <Col span={8} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                            <img src={avatar(((r.student.user || {}).avatar || {}))} onError={(e) => e.target.src = '/images/default-avatar.png'} style={{width: '80px', height: '80px', objectFit: 'cover', objectPosition: 'center'}}/>
                                                        </Col>
                                                        <Col span={16} style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                            <div className='curret-irts-single-name'>{((r.student || {}).user || {}).last_name? ((r.student || {}).user || {}).last_name : ''} {((r.student || {}).user || {}).first_name? ((r.student || {}).user || {}).first_name : ''}</div>
                                                            <div className='curret-irts-single-class'>{(r.student || {}).employee ? printStaticRole(((r.student || {}).employee || {}).staticRole) : ''}</div>
                                                        </Col>
                                                    </Row>
                                                    :
                                                    null
                                                :
                                                <div className={`curret-irts-single-unregistered ${r.current? 'current' : ''}`}>
                                                    {r.msg ? r.msg : 'Бүртгэлтэй хэрэглэгч алга байна!'}
                                                </div>
                                            }
                                        </div>
                                    )
                                    :
                                    <div className='curret-irts-empty'></div>
                                }
                            </div>
                            {/*{*/}
                            {/*    <Table*/}
                            {/*        key='records-table'*/}
                            {/*        responsive*/}
                            {/*        // striped*/}
                            {/*        // bordered*/}
                            {/*        size='sm'*/}
                            {/*        hover*/}
                            {/*    >*/}
                            {/*        <thead>*/}
                            {/*        <tr>*/}
                            {/*            <th>№</th>*/}
                            {/*            <th>Нэр</th>*/}
                            {/*            <th>Цаг</th>*/}
                            {/*        </tr>*/}
                            {/*        </thead>*/}
                            {/*        <tbody>*/}
                            {/*        {massAttendance && massAttendance.length > 0 ?*/}
                            {/*            massAttendance.map( (r, idx) =>*/}
                            {/*                <tr>*/}
                            {/*                    <td>{ (this.state.pageNum * this.state.pageSize) + idx + 1 }</td>*/}
                            {/*                    <td>{(r.user || {}).last_name ? (r.user || {}).last_name : ''} {(r.user || {}).first_name ? (r.user || {}).first_name : ''}</td>*/}
                            {/*                    <td>{moment(r.localTime).format("YYYY/MM/DD H:mm")}</td>*/}
                            {/*                </tr>*/}
                            {/*            )*/}
                            {/*            :*/}
                            {/*            <tr>*/}
                            {/*                <td colSpan='5'>Ирц алга байна</td>*/}
                            {/*            </tr>*/}
                            {/*        }*/}
                            {/*        </tbody>*/}
                            {/*    </Table>*/}
                            {/*}*/}
                            <Table columns={columns} dataSource={massAttendance} pagination={{ pageSize: 20, onChange: (page, pageSize) => this.setState({pageNum: page})}} />
                        </div>
                    </Content>
                </Layout>
        );
    }
}

export default  connect(reducer)(GuardHome);