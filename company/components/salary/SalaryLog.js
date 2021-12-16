import React, {Component} from "react";
import { connect } from 'react-redux';
import config, {hasAction} from "../../config";
import moment from "moment";
import {
    getSalaryLogs,
} from "../../actions/salary_actions";
import {
    getEmployeeStandard,
} from "../../actions/employee_actions";
import {
    SalaryTable
} from "./SalaryTable";
import { Link } from 'react-router-dom';
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons"
import {locale} from '../../lang';

const reducer = ({ main, salary }) => ({ main, salary });
import {
    Button,
    Table,
    Tag,
    Input,
    Avatar,
    Row,
    Col,
    Typography,
    List,
    Modal,
    InputNumber,
    Drawer,
    Form,
    Dropdown,
    Menu,
    Empty,
    Image,
    Collapse,
    DatePicker, Divider, Popconfirm, Select, Space, Timeline
} from 'antd';
const {Title} = Typography;

class SalaryLogs extends Component {
    constructor(props){
        super(props);
        let today = new Date();
        if(today.getDate()<=14){
            today.setMonth(today.getMonth()-1);
        }
        this.state = {
            employees: [],
            year_month: moment(today).format('YYYY-MM'),
            active: '',
            avatar: {},
            first_name: '',
            last_name: '',
            register_id: '',
            logs: []
            // prior: {
            //     salary: '',
            //     hungulult: 0,
            //     hool_unaanii_mungu: 0,
            //     sub: [
            //         {amount: 0, type: 'taslalt', description: ''},
            //         {amount: 0, type: 'hotsrolt', description: ''},
            //         {amount: 0, type: 'n_d_sh', description: ''},
            //         {amount: 0, type: 'h_h_o_a_t', description: ''},
            //         {amount: 0, type: 'busad', description: ''}
            //     ],
            //     add: [
            //         {amount: 0, type: 'nemegdel', description: ''},
            //         {amount: 0, type: 'uramshuulal', description: ''},
            //         {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
            //         {amount: 0, type: 'busad', description: ''}
            //     ],
            //     action: '',
            // },
            // after: {
            //     salary: '',
            //     hungulult: 0,
            //     hool_unaanii_mungu: 0,
            //     sub: [
            //         {amount: 0, type: 'taslalt', description: ''},
            //         {amount: 0, type: 'hotsrolt', description: ''},
            //         {amount: 0, type: 'n_d_sh', description: ''},
            //         {amount: 0, type: 'h_h_o_a_t', description: ''},
            //         {amount: 0, type: 'busad', description: ''}
            //     ],
            //     add: [
            //         {amount: 0, type: 'nemegdel', description: ''},
            //         {amount: 0, type: 'uramshuulal', description: ''},
            //         {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
            //         {amount: 0, type: 'busad', description: ''}
            //     ],
            //     action: '',
            // },
            // edited_first_name: '',
            // edited_last_name: '',
            // edited_avatar: {},
        }
    }
    componentDidMount(){
        let {main: {employee}} = this.props;
        if(!hasAction(['read_salary'], employee)){
            this.props.history.replace('/not-found');
        }else{
            this.props.dispatch(getSalaryLogs({year_month: this.state.year_month}));
            this.props.dispatch(getEmployeeStandard({staticRole: ['employee', 'hrManager'], pageNum: 0, pageSize: 20}))
        }
    }
    editEmployees(e){
        let employees = this.state.employees || [];
        if(employees.includes(e)){
            employees = employees.filter(emp => e !== emp);
        }else{
            employees.push(e);
        }
        this.setState({...this.state, employees: employees});
    }
    searchEmployees(e){
        const {dispatch} = this.props;
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(function(){
            dispatch(getEmployeeStandard({staticRole: ['employee', 'hrManager'], search: e, pageNum: 0, pageSize: 20}))
        }, 300);
        this.setState({...this.state, timeOut: timeOut})
    }
    getLogs(e){
        this.setState({year_month: moment(e).format('YYYY-MM')}, () => {
            this.props.dispatch(getSalaryLogs({year_month: this.state.year_month}));
        });
    }
    componentWillUnmount() {
        this.props.dispatch(getEmployeeStandard({staticRole: ['employee', 'hrManager'], search: '', pageNum: 0, pageSize: 20}))
    }
    render(){
        const{ main: {employee}, salary: {gettingLogs, salaryLogs, gettingEmployees, found, salaryEmployees}} = this.props;
        function getStatus(status){
            switch (status) {
                case 'created': return <Tag>{locale('common_salary.uusgesen')}</Tag>;
                case 'idle': return <Tag color='orange'>{locale('common_salary.butsaasan')}</Tag>;
                case 'updated': return <Tag color='magenta'>{locale('common_salary.shinechilsen')}</Tag>;
                case 'pending': return <Tag color='gold'>{locale('common_salary.ilgeesen')}</Tag>;
                case 'approved': return <Tag color='green'>{locale('common_salary.batalsan')}</Tag>;
                case 'declined': return <Tag color='volcano'>{locale('common_salary.tsutsalsan')}</Tag>;
                case 'deleted': return <Tag color='red'>{locale('common_salary.ustgasan')}</Tag>;
                case 're_open': return <Tag color='geekblue'>{locale('common_salary.dahin neesen')}</Tag>;
                default: return ''
            }
        }
        let employees = [];
        if((this.state.employees || []).length > 0){
            (salaryEmployees || []).map(sal => {
                if((this.state.employees || []).includes((sal.emp || 'as').toString())){
                    employees.push(sal);
                }
            });
        }else{
            employees = salaryEmployees;
        }
        // function getPrior (logs, ind){
        //     if(ind + 1 >= logs.length){
        //         return {
        //             salary: '',
        //             hungulult: 0,
        //             hool_unaanii_mungu: 0,
        //             sub: [
        //                 {amount: 0, type: 'taslalt', description: ''},
        //                 {amount: 0, type: 'hotsrolt', description: ''},
        //                 {amount: 0, type: 'n_d_sh', description: ''},
        //                 {amount: 0, type: 'h_h_o_a_t', description: ''},
        //                 {amount: 0, type: 'busad', description: ''}
        //             ],
        //             add: [
        //                 {amount: 0, type: 'nemegdel', description: ''},
        //                 {amount: 0, type: 'uramshuulal', description: ''},
        //                 {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
        //                 {amount: 0, type: 'busad', description: ''}
        //             ],
        //             action: '',
        //         }
        //     }else{
        //         return {
        //             salary: ((logs || [])[ind+1] || {}).initial_salary || 0,
        //             hungulult: ((logs || [])[ind+1] || {}).hungulult || 0,
        //             hool_unaanii_mungu: ((logs || [])[ind+1] || {}).hool_unaanii_mungu || 0,
        //             sub: ((logs || [])[ind+1] || {}).sub || [
        //                 {amount: 0, type: 'taslalt', description: ''},
        //                 {amount: 0, type: 'hotsrolt', description: ''},
        //                 {amount: 0, type: 'n_d_sh', description: ''},
        //                 {amount: 0, type: 'h_h_o_a_t', description: ''},
        //                 {amount: 0, type: 'busad', description: ''}
        //             ],
        //             add: ((logs || [])[ind+1] || {}).add || [
        //                 {amount: 0, type: 'nemegdel', description: ''},
        //                 {amount: 0, type: 'uramshuulal', description: ''},
        //                 {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
        //                 {amount: 0, type: 'busad', description: ''}
        //             ],
        //             action: (((logs || [])[ind+1] || {}).action || 'idle'),
        //         }
        //     }
        // }
        return (
            <React.Fragment>
                <Row key='date'>
                    <Col span={3}>
                        <Row>
                            <Title level={5} style={{display: 'flex', alignItems: 'center',marginBottom: 0, marginRight: 10}}>{locale('common_salary.sar')}:</Title>
                            <DatePicker
                                picker='month'
                                format='YYYY-MM'
                                defaultValue={moment(this.state.year_month)}
                                onChange={(e) => this.getLogs(e)}
                                allowClear={false}
                                disabled={gettingLogs}
                            />
                        </Row>
                    </Col>
                    <Col span={21}>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <Title level={5} style={{display: 'flex', alignItems: 'center', marginBottom: 0, marginRight: 10}}>{locale('common_salary.ajilchid')}:</Title>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder={locale('common_salary.ajilchdiin_n_o_b_u_h')}
                                loading={gettingEmployees}
                                // onSelect={this.editEmployees.bind(this)}
                                onDeselect={this.editEmployees.bind(this)}
                                onClear={() => this.setState({...this.state, employees: []})}
                                onSearch={this.searchEmployees.bind(this)}
                                onBlur={this.searchEmployees.bind(this, '')}
                                maxTagCount='responsive'
                                filterOption={false}
                                value={this.state.employees}
                                dropdownRender={(record) =>
                                    ((record.props || {}).options || []).length > 0 ?
                                        <Row key={'multiple-select'} gutter={[5,5]} className='multiple-select-row'>
                                            {((record.props || {}).options || []).map((opt, index) =>
                                                <Col span={6} key={`multiple-column-selec-column-${index}`}>
                                                    <div
                                                        className={this.state.employees.includes(opt.value) ? 'multiple-column-select active' : 'multiple-column-select'}
                                                        onClick={() => this.editEmployees(opt.value)}
                                                    >
                                                        {
                                                            (((opt.children || {}).props || {}).children || []).map((child, ind) =>
                                                                <span key={`multiple-column-select-india-${ind}`}>{child}</span>)
                                                        }
                                                    </div>
                                                </Col>
                                            )}
                                        </Row>
                                        :
                                        <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_salary.ajilchin_baihgui_baina')}</span>} />
                                }
                                notFoundContent={<Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_salary.ajilchin_baihgui_baina')}</span>} />}
                            >
                                {
                                    found.map(emp => <Select.Option key={emp._id} value={emp._id}>
                                        {
                                            ((((emp || {}).user || {}).last_name || '').length+(((emp || {}).user || {}).first_name || '').length+1) > 32 ?
                                                <span>
                                                    {(((emp || {}).user || {}).last_name || '').slice(0,1).toUpperCase()}.{(((emp || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                                                    (((emp || {}).user || {}).first_name || '').slice(1,(((emp || {}).user || {}).first_name || '').length)}
                                                </span>
                                                :
                                                <span>
                                                    {(((emp || {}).user || {}).last_name || '').slice(0,1).toUpperCase()+(((emp || {}).user || {}).last_name || '').slice(1,(((emp || {}).user || {}).last_name || '').length)}&nbsp;
                                                    {(((emp || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+(((emp || {}).user || {}).first_name || '').slice(1,(((emp || {}).user || {}).first_name || '').length)}
                                                </span>
                                        }
                                    </Select.Option>)
                                }
                            </Select>
                        </div>
                    </Col>
                </Row>
                <Divider/>
                <Row>
                    <Col span={8}>
                        <div className='salary-logs'>
                            {
                                (salaryLogs || []).length > 0 && (employees || []).length > 0 ?
                                    <List
                                        // locale={{emptyText: 'Хоосон байна'}}
                                        loading={gettingLogs}
                                        dataSource={employees}
                                        style={{height: 840, overflowY: 'scroll', overflowX: 'hidden'}}
                                        renderItem={(item) => (
                                            <React.Fragment>
                                                <List.Item
                                                    style={{padding: '10px'}}
                                                >
                                                    <List.Item.Meta
                                                        className='salary-meta'
                                                        avatar={
                                                            <div
                                                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: 10, backgroundColor: '#fff'}}
                                                            >
                                                                <Image
                                                                    src={((item.user || {}).avatar || {}).path ? `${config.get('hostMedia')}${((item.user || {}).avatar || {}).path}` : `/images/default-avatar.png`}
                                                                    onError={(e) => e.target.src = `/images/default-avatar.png`}
                                                                    style={{width: 50, height: 50, objectFit: 'cover', objectPosition: 'center'}}
                                                                    preview={{
                                                                        mask: <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{locale('common_salary.uzeh')}</div>
                                                                    }}
                                                                />
                                                            </div>
                                                        }
                                                        title={
                                                            (((item.user || {}).last_name || '').length+((item.user || {}).first_name || '').length+1) > 32 ?
                                                                <b style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: 300, margin: '10px 0 0 10px'}}>
                                                                    {((item.user || {}).last_name || '').slice(0,1).toUpperCase()}.{((item.user || {}).first_name || '').slice(0,1).toUpperCase()+
                                                                    ((item.user || {}).first_name || '').slice(1,((item.user || {}).first_name || '').length)}
                                                                </b>
                                                                :
                                                                <b style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', width: 300, margin: '10px 0 0 10px'}}>
                                                                    {((item.user || {}).last_name || '').slice(0,1).toUpperCase()+((item.user || {}).last_name || '').slice(1,((item.user || {}).last_name || '').length)}&nbsp;
                                                                    {((item.user || {}).first_name || '').slice(0,1).toUpperCase()+((item.user || {}).first_name || '').slice(1,((item.user || {}).first_name || '').length)}
                                                                </b>
                                                        }
                                                        description={
                                                            <>
                                                                <Collapse
                                                                    bordered={false}
                                                                >
                                                                    <Collapse.Panel header={locale('common_salary.tsalingiin_uurchlult')}>
                                                                        {
                                                                            (item.logs || []).map((log, ind) =>
                                                                                <div
                                                                                    style={{display: 'flex', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: 5, padding: 5, marginBottom: 3, cursor: 'pointer'}} key={`${item.emp}_log${ind}`}
                                                                                    onClick={() =>
                                                                                        this.setState({
                                                                                            active: item.emp,
                                                                                            avatar: (item.user || {}).avatar || {},
                                                                                            first_name: (item.user || {}).first_name || '',
                                                                                            last_name: (item.user || {}).last_name || '',
                                                                                            register_id: (item.user || {}).register_id || '',
                                                                                            logs: (item.logs || [])
                                                                                            // after: {
                                                                                            //     salary: (log.initial_salary || 0),
                                                                                            //     hungulult: (log.hungulult || 0),
                                                                                            //     hool_unaanii_mungu: (log.hool_unaanii_mungu || 0),
                                                                                            //     sub: log.sub || [
                                                                                            //         {amount: 0, type: 'taslalt', description: ''},
                                                                                            //         {amount: 0, type: 'hotsrolt', description: ''},
                                                                                            //         {amount: 0, type: 'n_d_sh', description: ''},
                                                                                            //         {amount: 0, type: 'h_h_o_a_t', description: ''},
                                                                                            //         {amount: 0, type: 'busad', description: ''}
                                                                                            //     ],
                                                                                            //     add: log.add || [
                                                                                            //         {amount: 0, type: 'nemegdel', description: ''},
                                                                                            //         {amount: 0, type: 'uramshuulal', description: ''},
                                                                                            //         {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
                                                                                            //         {amount: 0, type: 'busad', description: ''}
                                                                                            //     ],
                                                                                            //     action: (log.action || 'idle'),
                                                                                            // },
                                                                                            // prior: getPrior(item.logs, ind),
                                                                                            // edited_first_name: (((log.employee || {}).user || {}).first_name || ''),
                                                                                            // edited_last_name: (((log.employee || {}).user || {}).last_name || ''),
                                                                                            // edited_avatar: (((log.employee || {}).user || {}).avatar || {}),
                                                                                        }, () => {
                                                                                            let height = 0;
                                                                                            for(let i = 0; i<ind; i++){
                                                                                                if(((this.state.logs || [])[i] || {}).action === 'updated'){
                                                                                                    if(((this.state.logs || [])[i+1] || {}).action === 'updated'){
                                                                                                        height+=425;
                                                                                                    }else{
                                                                                                        height+=395;
                                                                                                    }
                                                                                                }else{
                                                                                                    height+=70;
                                                                                                }
                                                                                            }
                                                                                            document.querySelector('.scroll-log').scrollTop = height;
                                                                                        })
                                                                                    }
                                                                                >
                                                                                    <p style={{color: '#5c5c5c', margin: 0}}>{moment(log.created).format('YYYY-MM-DD HH:mm:ss')}</p>
                                                                                    {getStatus(log.action)}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </Collapse.Panel>
                                                                </Collapse>
                                                            </>
                                                        }
                                                    />
                                                </List.Item>
                                            </React.Fragment>
                                        )}
                                    />
                                    :
                                    <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_salary.burtgel_baihgui_baina')}</span>} />
                            }
                        </div>
                    </Col>
                    <Col span={16} style={{height: '850px', backgroundColor: '#fff'}}>
                        {
                            this.state.active === '' ?
                                <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_salary.burtgel_songoogui_baina')}</span>} />
                                </div>
                                :
                                <Space
                                    className={'salary-section'}
                                    direction='vertical'
                                    style={{padding: '20px 20px 20px 20px', width: '100%', boxSizing: 'border-box'}}
                                >
                                    <Row gutter={20}>
                                        <Col span={4}>
                                            <div
                                                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}
                                            >
                                                <Image
                                                    src={(this.state.avatar || {}).path ? `${config.get('hostMedia')}${(this.state.avatar || {}).path}` : `/images/default-avatar.png`}
                                                    onError={(e) => e.target.src = `/images/default-avatar.png`}
                                                    style={{width: 70, height: 70, objectFit: 'cover', objectPosition: 'center'}}
                                                    preview={{
                                                        mask: <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{locale('common_salary.uzeh')}</div>
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                        <Col style={{fontWeight: 600, fontSize: 20}} span={20}>
                                            {(this.state.last_name || '').slice(0,1).toUpperCase()+(this.state.last_name || '').slice(1,(this.state.last_name || '').length)}&nbsp;
                                            {(this.state.first_name || '').slice(0,1).toUpperCase()+(this.state.first_name || '').slice(1,(this.state.first_name || '').length)}
                                            <br />
                                            <span style={{fontSize: 16, color: '#7a7a7a'}}>{(this.state.register_id || '').toUpperCase()}</span>
                                        </Col>
                                    </Row>
                                    <div
                                        className='scroll-log'
                                        style={{overflowY: 'scroll', overflowX: 'hidden', height: 720, scrollBehavior: 'smooth'}}
                                    >
                                        <Timeline>
                                            {
                                                (this.state.logs || []).map((log, ind) =>
                                                    <Timeline.Item>
                                                        {
                                                            log.action === 'updated' ?
                                                                <Divider>
                                                                    {
                                                                        ind !== 0  && ((this.state.logs || [])[ind-1] || {}).action === 'updated' ?
                                                                            <div style={{fontSize: 30}}>
                                                                                <ArrowUpOutlined />
                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                </Divider>
                                                                :
                                                                null
                                                        }
                                                        {
                                                            log.action !== 'updated' && log.action !== 'created' ?
                                                                <React.Fragment>
                                                                    {/*<div style={{width: '100%', justifyContent: 'center', display: 'flex'}}><span style={{fontSize: 20}} className='salary-tag'>{getStatus(log.action)}</span></div>*/}
                                                                    {null}
                                                                </React.Fragment>
                                                                :
                                                                <SalaryTable log={log} />
                                                        }
                                                        {
                                                            ind !== (this.state.logs || []).length-1 ?
                                                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                                                    <Space align="center" style={{marginLeft: 20}}>
                                                                        <div>{moment(log.created).format('YYYY-MM-DD HH:mm:ss')}</div>
                                                                        <div style={{borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                                                                            <Image
                                                                                src={(((log.employee || {}).user || {}).avatar || {}).path ? `${config.get('hostMedia')}${(((log.employee || {}).user || {}).avatar || {}).path}` : `/images/default-avatar.png`}
                                                                                onError={(e) => e.target.src = `/images/default-avatar.png`}
                                                                                style={{width: 50, height: 50, objectFit: 'cover', objectPosition: 'center'}}
                                                                                preview={{
                                                                                    mask: <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{locale('common_salary.uzeh')}</div>
                                                                                }}
                                                                            />
                                                                            <span style={{display: 'inline-block', marginLeft: 8}}>
                                                                            {(((log.employee || {}).user || {}).last_name || '').slice(0,1).toUpperCase()+(((log.employee || {}).user || {}).last_name || '').slice(1,(((log.employee || {}).user || {}).last_name || '').length)}&nbsp;
                                                                                {(((log.employee || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+(((log.employee || {}).user || {}).first_name || '').slice(1,(((log.employee || {}).user || {}).first_name || '').length)}
                                                                        </span>
                                                                        </div>
                                                                        {getStatus(log.action)}
                                                                    </Space>
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </Timeline.Item>
                                                )
                                            }
                                        </Timeline>
                                    </div>

                                    {/*<div style={{display: 'flex', justifyContent: 'center'}}>*/}
                                    {/*    {*/}
                                    {/*        (this.state.after || {}).action !== 'created' ?*/}
                                    {/*            <SalaryTable log={this.state.prior} />*/}
                                    {/*            :*/}
                                    {/*            <span style={{fontSize: 20}} className='salary-tag'>{getStatus((this.state.after || {}).action)}</span>*/}
                                    {/*    }*/}
                                    {/*</div>*/}
                                    {/*<div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>*/}
                                    {/*    <div style={{fontSize: 30}}>*/}
                                    {/*        <ArrowDownOutlined />*/}
                                    {/*    </div>*/}
                                    {/*    <Space align="center" style={{marginLeft: 20}}>*/}
                                    {/*        <div style={{borderRadius: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>*/}
                                    {/*            <Image*/}
                                    {/*                src={(this.state.edited_avatar || {}).path ? `${config.get('hostMedia')}${(this.state.edited_avatar || {}).path}` : `/images/default-avatar.png`}*/}
                                    {/*                onError={(e) => e.target.src = `/images/default-avatar.png`}*/}
                                    {/*                style={{width: 50, height: 50, objectFit: 'cover', objectPosition: 'center'}}*/}
                                    {/*                preview={{*/}
                                    {/*                    mask: <div style={{width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Үзэх</div>*/}
                                    {/*                }}*/}
                                    {/*            />*/}
                                    {/*            <span style={{display: 'inline-block', marginLeft: 8}}>*/}
                                    {/*                {(this.state.edited_last_name || '').slice(0,1).toUpperCase()+(this.state.edited_last_name || '').slice(1,(this.state.edited_last_name || '').length)}&nbsp;*/}
                                    {/*                {(this.state.edited_first_name || '').slice(0,1).toUpperCase()+(this.state.edited_first_name || '').slice(1,(this.state.edited_first_name || '').length)}*/}
                                    {/*            </span>*/}
                                    {/*        </div>*/}
                                    {/*        {*/}
                                    {/*            (this.state.after || {}).action === 'updated' ?*/}
                                    {/*                getStatus((this.state.after || {}).action)*/}
                                    {/*                :*/}
                                    {/*                null*/}
                                    {/*        }*/}
                                    {/*    </Space>*/}
                                    {/*</div>*/}
                                    {/*<div style={{display: 'flex', justifyContent: 'center'}}>*/}
                                    {/*    {*/}
                                    {/*        (this.state.after || {}).action !== 'created' && (this.state.after || {}).action !== 'updated' ?*/}
                                    {/*            <span style={{fontSize: 20}} className='salary-tag'>{getStatus((this.state.after || {}).action)}</span>*/}
                                    {/*            :*/}
                                    {/*            <SalaryTable log={this.state.after} />*/}
                                    {/*    }*/}
                                    {/*</div>*/}
                                </Space>
                        }
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(SalaryLogs);