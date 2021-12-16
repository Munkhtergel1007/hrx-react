import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {locale} from "../../lang";
import config, {
    uuidv4,
    printStaticRole,
    printMnDay, hasAction
} from "../../config";
import moment from 'moment';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    MinusCircleOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Checkbox,
    Button,
    Card,
    Row,
    Col,
    Input,
    Drawer,
    Typography,
    Popconfirm,
    Empty,
    List,
    Avatar,
    Tooltip,
    Divider,
    Select,
    DatePicker,
    TimePicker,
    Collapse,
    Tag,
    Pagination, Spin,
} from 'antd';
import {
    getTimetables,
    createTimetable,
    deleteTimetable,
    deleteEmpTimetable,
} from '../../actions/settings_actions';
import { getEmployeeStandard} from '../../actions/employee_actions'
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Timetable extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            _id: '',
            visible: false,
            name: '',
            time: [
                {
                    title: 'monday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                },
                {
                    title: 'tuesday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                },
                {
                    title: 'wednesday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                },
                {
                    title: 'thursday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                },
                {
                    title: 'friday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                },
                {
                    title: 'saturday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                },
                {
                    title: 'sunday',
                    active: false,
                    starting_hour: '',
                    ending_hour: ''
                }
            ],
            employees: [],
            search: '',
            filter: [],
            pageSize: 15,
            pageNum: 0,
            all: false
        };
        document.title = 'Тохиргоо | Хуваарь  |  TATATUNGA';
    }
    componentDidMount() {
        const {main: {employee}} = this.props;
        if(!hasAction(['deal_with_timetable'], employee)){
            this.props.history.replace('/not-found');
        }else{
            let all = ['employee', 'hrManager'];
            this.props.dispatch(getEmployeeStandard({ staticRole: all }));
            this.props.dispatch(getTimetables({pageNum: this.state.pageNum, pageSize: this.state.pageSize}));
        }
    }
    getTimetables(e){
        this.props.dispatch(getTimetables({pageNum: e-1, pageSize: this.state.pageSize}));
        this.setState({...this.state, pageNum: e-1});
    }
    editTimetable(itm){
        const {settings: {employees}} = this.props;
        let days = {'monday': 0, 'tuesday': 1, 'wednesday': 2, 'thursday': 3, 'friday': 4, 'saturday': 5, 'sunday': 6};
        let employeed = [];
        itm.employees.map(it => {
            employeed.push(it._id);
        });
        let date = this.state.time;
        itm.days.map(day => {
            date[days[day.title]].active = true;
            let start_hour_strings = day.startingHour.split(":");
            let end_hour_strings = day.endingHour.split(":");
            let date1 = new Date(), date2 = new Date();
            date1.setHours(parseInt(start_hour_strings[0]));
            date1.setMinutes(parseInt(start_hour_strings[1]));
            date2.setHours(parseInt(end_hour_strings[0]));
            date2.setMinutes(parseInt(end_hour_strings[1]));
            date[days[day.title]].starting_hour = moment(date1);
            date[days[day.title]].ending_hour = moment(date2);
        });
        this.setState({
            _id: itm._id,
            visible: true,
            name: itm.title,
            time: date,
            employees: employeed,
            all: ((employees || []).length === (employeed || []).length) && employeed.length > 0
        })
    }
    deleteTimetable(e){
        this.props.dispatch(deleteTimetable({_id: e}));
    }
    activateDates(index){
        let time = this.state.time;
        if(time[index].active){
            time[index].starting_hour = '';
            time[index].ending_hour = '';
        }else{
            let date = new Date(), date1 = new Date();
            date.setHours(10); date.setMinutes(0);
            date1.setHours(18); date1.setMinutes(0);
            time[index].starting_hour = moment(date);
            time[index].ending_hour = moment(date1);
        }
        time[index].active = !time[index].active;
        this.setState({...this.state, time});
    }
    changeTime(index, strings){
        let time = this.state.time;
        time[index].starting_hour = strings[0];
        time[index].ending_hour = strings[1];
        this.setState({...this.state, time});
    }
    clearSearch(){
        this.props.dispatch(getEmployeeStandard({staticRole: ['employee', 'hrManager'], search: ''}));
    }
    filterEmployees(filt){
        let all = ['employee', 'hrManager'];
        if((filt || {}).length !== 0){
            all = filt;
        }
        clearTimeout(this.state.timeOut);
        this.props.dispatch(getEmployeeStandard({staticRole: all, search: this.state.search}));
        this.setState({...this.state, filter: filt})
    }
    searchEmployees(e){
        const {dispatch} = this.props;
        let all = ['employee', 'hrManager'];
        if((this.state.filter || {}).length !== 0){
            all = (this.state.filter);
        }
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(function(){
            dispatch(getEmployeeStandard({staticRole: all, search: e}));
        }, 300);
        this.setState({...this.state, timeOut: timeOut, search: e})
    }
    allEmployees(){
        this.clearSearch();
        const {settings: {employees}} = this.props;
        let emps = [];
        if(!this.state.all){
            employees.map(emp => {
                emps.push(emp._id);
            })
        }
        this.setState({...this.state, all: !this.state.all, employees: emps});
    }
    changeFilter(e){
        let fil = this.state.filter;
        if(fil.includes(e)){
            fil = fil.filter(er => er !== e);
        }else{
            fil.push(e);
        }
        this.filterEmployees(fil);
        this.setState({...this.state, filter: fil});
    }
    deleteEmployee(e, time){
        this.props.dispatch(deleteEmpTimetable({_id: e, timetable: time}));
    }
    editEmployees(e){
        const {settings: {employees}} = this.props;
        let emps = (this.state.employees || []);
        if(emps.includes(e)){
            emps = emps.filter(emp => emp !== e);
        }else{
            emps.push(e);
        }
        this.clearSearch();
        this.setState({...this.state, employees: emps, search: '', all: ((employees || []).length === (emps || []).length) && emps.length > 0});
    }
    clear(){
        this.clearSearch();
        this.setState({visible: false, name: '', employees: [], time: [
                { title: 'monday', active: false, starting_hour: '', ending_hour: '' },
                { title: 'tuesday', active: false, starting_hour: '', ending_hour: '' },
                { title: 'wednesday', active: false, starting_hour: '', ending_hour: ''},
                { title: 'thursday', active: false, starting_hour: '', ending_hour: '' },
                { title: 'friday', active: false, starting_hour: '', ending_hour: '' },
                { title: 'saturday', active: false, starting_hour: '', ending_hour: '' },
                { title: 'sunday', active: false, starting_hour: '', ending_hour: '' }], filter: [], _id: '', all: false})
    }
    submitTimetable(){
        let times = [], days = {0: 'monday', 1: 'tuesday', 2: 'wednesday', 3: 'thursday', 4: 'friday', 5: 'saturday', 6: 'sunday'};
        (this.state.time || []).map((tim, indx) => {
            if(tim.active){
                times.push({
                    title: days[indx],
                    startingHour: moment(tim.starting_hour).format('HH:mm'),
                    endingHour: moment(tim.ending_hour).format('HH:mm')
                })
            }
        });
        if(this.state.name === ''){
            return config.get('emitter').emit('warning', (locale('common_timetable.Tsagiin_H_N oruulnu')));
        }
        if(!(this.state.time || []).some(tm => tm.active) || (times || []).length === 0){
            return config.get('emitter').emit('warning', (locale('common_timetable.Tsagiin huviaraa oruulnu')));
        }
        if((this.state.employees || []).length === 0){
            return config.get('emitter').emit('warning', (locale('common_timetable.Ajilchdig oruulnu')));
        }
        if(this.state._id === ''){
            this.props.dispatch(createTimetable({title: this.state.name, days: times, employees: this.state.employees}))
        }else{
            this.props.dispatch(createTimetable({title: this.state.name, days: times, employees: this.state.employees, _id: this.state._id}))
        }
        this.clear();
    }

    render() {
        const {main: {company}, settings: { gettingEmployees, employees, timetables, gettingTimetables, timetableCount } } = this.props;
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}}>
                    <Col span={18}>
                        <div key="timetable-actions-div" style={{marginBottom: 20}}>
                            <Button type="primary" icon={<PlusOutlined />} style={{float: 'right'}} onClick={() => this.setState({...this.state, visible: true})}>{locale('common_timetable.SH_TS_H uusgeh')}</Button>
                            <div style={{clear: 'both'}}/>
                        </div>
                        {
                            (gettingTimetables) ?
                                <div style={{textAlign: 'center', marginTop: 30}}>
                                    <Spin />
                                </div>
                                :
                                timetables.length > 0 ?
                                    <div key="timetable-display-div">
                                        <div key="timetable-display-inner-div">
                                            {
                                                timetables.map(item =>
                                                    <Card
                                                        loading={gettingTimetables}
                                                        title={<Tooltip title={item.title} placement="bottomLeft">{item.title}</Tooltip>}
                                                        extra={
                                                            <div>
                                                                <Button size="small" icon={<EditOutlined/>} onClick={this.editTimetable.bind(this, item)}>{locale('common_timetable.Oorchloh')}</Button>
                                                                <Popconfirm
                                                                    title={locale('common_timetable.Tsagiin huviar ustgah')}
                                                                    okText={locale('common_timetable.Tiim')}
                                                                    cancelText={locale('common_timetable.Ugui')}
                                                                    onConfirm={this.deleteTimetable.bind(this, item._id)}
                                                                >
                                                                    <Button icon={<DeleteOutlined/>} type="danger" size="small" style={{marginRight: 10}}> {locale('common_timetable.Ustgah')}</Button>
                                                                </Popconfirm>
                                                            </div>
                                                        }
                                                        style={{marginBottom: 20}}
                                                    >
                                                        <table align='center' border={'1px solid black'} style={{marginBottom: 5}}>
                                                            <thead>
                                                            <tr>
                                                                <td />
                                                                {days.map(day => <td style={{padding: '10px 0'}}><p style={{writingMode: 'vertical-rl', textAlign: 'right', marginBottom: 0}}>{printMnDay(day)}</p></td>)}
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <tr>
                                                                <td>{locale('common_timetable.Ehleh tsag')}</td>
                                                                {
                                                                    days.map(day =>
                                                                        (item.days || []).some(itm =>
                                                                            itm.title === day
                                                                        ) ?
                                                                            <td style={{textAlign: 'center'}}>
                                                                                {
                                                                                    (item.days || []).map(itm =>
                                                                                        itm.title === day ? itm.startingHour : null
                                                                                    )
                                                                                }
                                                                            </td>
                                                                            :
                                                                            <td rowSpan={2} style={{padding: '10px 0'}}><p style={{writingMode: 'vertical-rl', textAlign: 'right', marginBottom: 0}}>{locale('common_timetable.Amrana')}</p></td>
                                                                    )
                                                                }
                                                            </tr>
                                                            <tr>
                                                                <td>{locale('common_timetable.Duusah tsag')}</td>
                                                                {
                                                                    days.map(day =>
                                                                        (item.days || []).some(itm =>
                                                                            itm.title === day
                                                                        ) ?
                                                                            <td style={{textAlign: 'center'}}>
                                                                                {
                                                                                    (item.days || []).map(itm =>
                                                                                        itm.title === day ? itm.endingHour : null
                                                                                    )
                                                                                }
                                                                            </td>
                                                                            :
                                                                            null
                                                                    )
                                                                }
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        {
                                                            item.employees && item.employees.length > 0 ?
                                                                <Collapse>
                                                                    <Collapse.Panel header={locale('common_timetable.Ajilchid')}>
                                                                        <List
                                                                            dataSource={item.employees}
                                                                            pagination={{pageSize: 10}}
                                                                            renderItem={(ite, so) =>
                                                                                <div>
                                                                                    <Row gutter={[20, 0]}>
                                                                                        <Col style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} span={2}>
                                                                                            <Avatar src={ ite.user.avatar && ite.user.avatar.path ? `${config.get('hostMedia')}${ite.user.avatar.path}` : `/images/default-avatar.png` } onError={(e) => e.target.src = `/images/default-avatar.png`} />
                                                                                        </Col>
                                                                                        <Col span={20}>
                                                                                            <Typography.Paragraph ellipsis={true} style={{fontSize: 16, marginBottom: 5}}>{ite.user && ite.user.first_name && ite.user.last_name ? <p style={{marginBottom: 0}}>{ite.user.last_name} {ite.user.first_name}</p> : null}</Typography.Paragraph>
                                                                                            {ite.staticRole ? <p style={{marginBottom: 0, color: '#403d39', fontSize: 14}}>{printStaticRole(ite.staticRole)}</p> : null}
                                                                                        </Col>
                                                                                        <Col span={2}>
                                                                                            <div style={{width: '100%', display: 'flex', height: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
                                                                                                <Popconfirm
                                                                                                    title={'Ажилтныг цагийн хуваариас хасах уу?'}
                                                                                                    okText={'Тийм'}
                                                                                                    cancelText={'Үгүй'}
                                                                                                    onConfirm={this.deleteEmployee.bind(this, ite._id, item._id)}
                                                                                                >
                                                                                                    <Button icon={<MinusCircleOutlined />} shape="circle" type="danger" />
                                                                                                </Popconfirm>
                                                                                            </div>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <hr />
                                                                                </div>
                                                                            }
                                                                        />
                                                                    </Collapse.Panel>
                                                                </Collapse>
                                                                :
                                                                null
                                                        }
                                                    </Card>
                                                )
                                            }
                                        </div>
                                        <Pagination
                                            onChange={this.getTimetables.bind(this)}
                                            current={this.state.pageNum+1}
                                            total={timetableCount} showSizeChanger={false}
                                            pageSize={this.state.pageSize}
                                            hideOnSinglePage={true}
                                        />
                                    </div>
                                    :
                                    <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_timetable.Tsagiin_H_B baina')}</span>} />
                        }
                    </Col>
                </Row>
                <Drawer
                    title={this.state._id !== '' ? "Цагийн хуваарь өөрчлөх" : locale('common_timetable.TS_H uusgeh')}
                    maskClosable={false}
                    onClose={this.clear.bind(this)}
                    width={720}
                    visible={this.state.visible}
                    key={'drawer-timetable'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button style={{marginRight: 20}} onClick={this.clear.bind(this)}>{locale('common_timetable.Bolih')}</Button>
                            <Button type="primary" onClick={this.submitTimetable.bind(this)}>{this.state._id === '' ? locale('common_timetable.Vvsgeh') : locale('common_timetable.Shinechleh')}</Button>
                        </div>
                    }
                >
                    <Row justify="center" align="center">
                        <Col span={22}>
                            {this.state._id !== '' ? <div style={{textAlign: 'center', marginBottom: 10}}><Tag color="red">{locale('common_timetable.Tsagiin huviar oorchloh')}</Tag></div> : null}
                            <Input.TextArea
                                onChange={(e) => this.setState({...this.state, name: (e.target.value || '')})}
                                placeholder= {locale('common_timetable.TS_H_N oruuln uu')}
                                rows={5}
                                value={this.state.name}
                                autoComplete="false"
                                spellCheck="false"
                                autoCorrect="false"
                                style={{marginBottom: 10}}
                            />
                            <Divider orientation="left">{locale('common_timetable.Ajillah odrood')}</Divider>
                            {
                                (this.state.time || []).map((tim, ind) =>
                                    <Row key={uuidv4()} style={{marginBottom: 10}}>
                                        {/*<Button*/}
                                        {/*    shape='circle'*/}
                                        {/*    type={tim.active ? 'primary' : 'default'}*/}
                                        {/*    onClick={this.activateDates.bind(this, ind)}*/}
                                        {/*>*/}
                                        {/*    {ind + 1}*/}
                                        {/*</Button>*/}
                                        <Col span={5}>
                                            <Checkbox
                                                checked={tim.active}
                                                onChange={this.activateDates.bind(this, ind)}
                                                style={{fontSize: 15}}
                                            >
                                                {ind + 1}.&nbsp;
                                                {printMnDay(days[ind])}
                                            </Checkbox>
                                        </Col>
                                        <Col span={19}>
                                            <TimePicker.RangePicker
                                                placeholder={[ locale('common_timetable.Ehleh tsag'), locale('common_timetable.Duusah tsag')]}
                                                format={'HH:mm'}
                                                disabled={!tim.active}
                                                minuteStep={15}
                                                value={tim.starting_hour && tim.ending_hour ? [tim.starting_hour, tim.ending_hour] : null}
                                                onChange={(d, t) => this.changeTime(ind, d)}
                                            />
                                        </Col>
                                    </Row>
                                )
                            }
                            <Divider orientation="left">{locale('common_timetable.Ajiltan')}</Divider>
                            <div>
                                <Row gutter={[20, 0]} style={{marginBottom: 10}}>
                                    <Col span={12}>
                                        <Select
                                            mode="multiple"
                                            style={{ width: '100%' }}
                                            placeholder= {locale('common_timetable.Ajilchid_A_T haih')}
                                            loading={gettingEmployees}
                                            onSelect={this.changeFilter.bind(this)}
                                            onDeselect={this.changeFilter.bind(this)}
                                            size="small"
                                            value={this.state.filter}
                                            filterOption={(input, option) =>
                                                option.key.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            <Select.Option
                                                value={'hrManager'}
                                                key={'Хүний нөөц'}
                                            >
                                                {printStaticRole('hrManager')}
                                            </Select.Option>
                                            <Select.Option
                                                value={'employee'}
                                                key={'Ажилтан'}
                                            >
                                                {printStaticRole('employee')}
                                            </Select.Option>
                                        </Select>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox
                                            checked={this.state.all}
                                            onChange={this.allEmployees.bind(this)}
                                        >
                                            {!this.state.all ? locale('common_timetable.Buh_A songoh') : 'Сонголтыг цэвэрлэх'}
                                        </Checkbox>
                                    </Col>
                                </Row>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    style={{ width: '100%' }}
                                    placeholder= {locale('common_timetable.Ajilchdig oruulna uu')}
                                    loading={gettingEmployees}
                                    onSelect={this.editEmployees.bind(this)}
                                    onDeselect={this.editEmployees.bind(this)}
                                    onClear={() => this.setState({...this.state, employees: []})}
                                    onSearch={this.searchEmployees.bind(this)}
                                    onBlur={this.searchEmployees.bind(this, '')}
                                    notFoundContent={<Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Ажилчин байхгүй байна.</span>} />}
                                    filterOption={false}
                                    value={this.state.employees}
                                >
                                    {
                                        employees.map(emp =>
                                            <Select.Option
                                                value={emp._id}
                                                key={emp._id}
                                            >
                                                {((emp.user || {}).last_name[0]).toUpperCase()}.
                                                {(emp.user || {}).first_name.toString().charAt(0).toUpperCase()+(emp.user || {}).first_name.toString().slice(1)}
                                            </Select.Option>)
                                    }
                                </Select>
                            </div>
                        </Col>
                    </Row>
                </Drawer>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(Timetable);