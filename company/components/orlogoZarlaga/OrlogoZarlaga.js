import React, {Component} from "react";
import { connect } from 'react-redux';
import config, {hasAction, isValidDate, companyAdministrator} from "../../config";
import moment from "moment";
import * as actions from "../../actions/orlogoZarlaga_actions";
import {getEmployeeStandard} from "../../actions/employee_actions";

const reducer = ({ main, orlogoZarlaga }) => ({ main, orlogoZarlaga });
import {CloseCircleFilled, SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, UpCircleOutlined, UpCircleTwoTone, DownCircleOutlined, DownCircleTwoTone} from '@ant-design/icons'
import {
    Button, Popover, Popconfirm,
    Table, Tooltip, Alert,
    Tag, InputNumber,
    Input, Space,
    Row, Spin,
    Typography,
    Form,
    DatePicker,
    Divider,
    Select, Col, Empty, Drawer,
} from 'antd';
import ExportExcel from "../utils/modalExportEx";
import workerSingle from "../workers/workerSingle";
// import {exportEx} from "../utils/exportExel";
const { RangePicker } = DatePicker;
const { Option } = Select;
const {Title} = Typography;
// const xls = require('xlsx');
// const utils = xls.utils;
let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
let day = new Date(year, month+1, 0).getDate();
let starting_date = new Date(year, month, 1);
let ending_date = new Date(year, month, day);
class OrlogoZarlaga extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starting_date: moment(starting_date).format('YYYY/MM/DD'),
            ending_date: moment(ending_date).format('YYYY/MM/DD'),
            pageNum: 0,
            pageSize: 50,
            subTag: '',
            company: '',
            search: '',
            type: '',
            user: '',
            userSearch: '',

            _id: '',
            visible: false,
            insertingAmount: 0,
            insertingType: '',
            insertingSubtag: '',
            insertingTitle: '',
            insertingCompany: {},
            insertingDescription: '',
            insertingDate: moment(today),
            insertingStartDate: '',
            insertingEndDate: '',
            insertingUser: {},
            sort: {columnKey:'date', order:'descend'},

            sortCompanyOrlogo: {active: true, order: 'descend'},
            sortCompanyZarlaga: {active: false, order: 'descend'},
        };
    }
    componentDidMount(){
        let {main: {employee}, dispatch} = this.props;
        let cc = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            starting_date: this.state.starting_date,
            ending_date: this.state.ending_date,
            sort: this.state.sort
        };
        dispatch(actions.getOrlogoZarlaga(cc));
    }
    componentWillUnmount() {
        let {main: {employee}, dispatch} = this.props;
        dispatch(actions.unMountOrlogoZarlaga());
    }
    dateHandle(string, value, e) {
        this.setState({
            ...this.state,
            starting_date: value[0],
            ending_date: value[1],
        });
    }
    setRangePickerExtraFooter(type) {
        if(type === 'thisWeek' || type === 'lastWeek'){
            let curr = new Date();
            let first = curr.getDate() - curr.getDay() + 1;
            let last = first + 6;
            let startDate = new Date(curr.setDate(first));
            let endDate = new Date(curr.setDate(last));
            if(type === 'lastWeek'){
                startDate.setDate(startDate.getDate()-7)
                endDate.setDate(endDate.getDate()-7)
            }
            this.setState({
                ...this.state,
                starting_date: moment(startDate).format('YYYY-MM-DD'),
                ending_date: moment(endDate).format('YYYY-MM-DD'),
            });
        } else if(type === 'thisMonth' || type === 'lastMonth'){
            let todayy = new Date();
            let yearr = todayy.getFullYear();
            let monthh = todayy.getMonth();
            let dayy, startDate, endDate;
            if(type === 'thisMonth'){
                dayy = new Date(yearr, monthh+1, 0).getDate();
                startDate = new Date(yearr, monthh, 1);
                endDate = new Date(yearr, monthh, dayy);
            }
            if(type === 'lastMonth'){
                monthh = monthh - 1;
                dayy = new Date(yearr, monthh+1, 0).getDate();
                startDate = new Date(yearr, monthh, 1);
                endDate = new Date(yearr, monthh, dayy);
            }
            this.setState({
                ...this.state,
                starting_date: moment(startDate).format('YYYY-MM-DD'),
                ending_date: moment(endDate).format('YYYY-MM-DD'),
            });
        }
    }
    search(data, value, sort){
        let {main: {employee}, dispatch, orlogoZarlaga:{user}} = this.props;
        let userSearch = {};
        if(hasAction(['read_orlogo_zarlaga'], employee)){
            userSearch = this.state.user;
        }
        let cc = {};
        if(data && typeof data.current === 'number' && this.state.pageNum !== data.current - 1){
            cc = {
                pageNum: data.current-1,
                pageSize: this.state.pageSize,
                starting_date: moment(this.state.starting_date).format('YYYY/MM/DD'),
                ending_date: moment(this.state.ending_date).format('YYYY/MM/DD'),
                type: this.state.type,
                search: this.state.search,
                subTag: this.state.subTag,
                company: this.state.company,
                user: userSearch,
                sort: (sort || {}),
            };
            this.setState({pageNum:data.current-1, sort: sort});
        } else {
            cc = {
                pageNum: 0,
                pageSize: this.state.pageSize,
                starting_date: moment(this.state.starting_date).format('YYYY/MM/DD'),
                ending_date: moment(this.state.ending_date).format('YYYY/MM/DD'),
                type: this.state.type,
                search: this.state.search,
                subTag: this.state.subTag,
                company: this.state.company,
                user: userSearch,
                sort: (sort || {}),
            };
            this.setState({pageNum: 0, sort: sort});
        }
        dispatch(actions.getOrlogoZarlaga(cc));
    }
    searchEmployees(e){
        let self = this;
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(function(){
            self.setState({
                userSearch: e, timeOut: timeOut
            }, () => {
                const {orlogoZarlaga:{user}} = self.props;
                self.props.dispatch(getEmployeeStandard({
                    pageNum: 0, pageSize: 10,
                    staticRole: ['hrManager', 'employee', 'chairman', 'lord'],
                    search: self.state.userSearch, getAvatars: true, subsidiaries:true, company: self.state.company
                }));
            });
        }, 500);
    }
    selectEmployee(e){
        const {orlogoZarlaga:{employees}} = this.props;
        let selected = {};
        (employees || []).map(emp => {
            if((e || 'as').toString() === ((emp || {})._id || '').toString()){
                selected = emp;
            }
        })
        this.setState({user: selected});
    }
    clearDrawer(){
        let today = new Date();
        if(today.getDate()<=14){
            today.setMonth(today.getMonth()-1);
        }
        this.setState({
            _id: '',
            visible: false,
            insertingAmount: 0,
            insertingType: '',
            insertingSubtag: '',
            insertingTitle: '',
            insertingCompany: {},
            insertingDescription: '',
            insertingDate: moment(today),
            insertingStartDate: '',
            insertingEndDate: '',
            insertingUser: {}
        });
    }
    submitOrlogoZarlaga(e){
        // const {
        //     insertingAmount, insertingType, insertingSubtag,
        //     insertingTitle, insertingDescription,
        //     insertingDate, insertingStartDate, insertingEndDate, _id
        // } = e;
        // let msg = 'Орлого зарлагын ';
        // insertingType ? insertingType === 'orlogo' ? msg = 'Орлогын ' : msg = 'Зарлагын ' : null;
        // if(!insertingType || insertingType === '') config.get('emitter').emit('warning', msg+'төрлийг буруу байна.');
        // else if(!insertingTitle || (insertingTitle || '').trim() === '') config.get('emitter').emit('warning', msg+'гарчгийг буруу байна.');
        // else if(!insertingDescription || (insertingDescription || '').trim() === '') config.get('emitter').emit('warning', msg+'тайлбарыг буруу байна.');
        // else if(!insertingAmount || insertingAmount < 0) config.get('emitter').emit('warning', msg+'мөнгөн дүнг буруу байна.');
        // else if(insertingSubtag && insertingSubtag === '') config.get('emitter').emit('warning', msg+'tag-ыг буруу байна.');
        // else if(!insertingDate || !isValidDate(insertingDate)) config.get('emitter').emit('warning', msg+'хугацаа буруу байна.');
        // else if(insertingStartDate && !isValidDate(insertingStartDate)) config.get('emitter').emit('warning', msg+'эхлэх хугацаа буруу байна');
        // else if(insertingEndDate && !isValidDate(insertingEndDate)) config.get('emitter').emit('warning', msg+'дуусах хугацаа буруу байна');
        // else this.props.dispatch(actions.submitOrlogoZarlaga({
        //     amount :insertingAmount, type: insertingType, subtag: insertingSubtag, _id,
        //     title: (insertingTitle || '').trim(), description: (insertingDescription || '').trim(),
        //     date: isValidDate(insertingDate), startDate: isValidDate(insertingStartDate), endDate: isValidDate(insertingEndDate),
        //     starting_date: this.state.starting_date,
        //     ending_date: this.state.ending_date,
        // })).then((c) => {
        //     if((c.json || {}).success) this.clearDrawer();
        // });
        const {
            insertingAmount, insertingType, insertingSubtag,
            insertingTitle, insertingDescription,
            insertingDate, insertingRange,
        } = e;
        let msg = 'Орлого зарлагын ';
        insertingType ? insertingType === 'orlogo' ? msg = 'Орлогын ' : msg = 'Зарлагын ' : null;
        if(!insertingType || insertingType === '') config.get('emitter').emit('warning', msg+'төрлийг буруу байна.');
        else if(!insertingTitle || (insertingTitle || '').trim() === '') config.get('emitter').emit('warning', msg+'гарчгийг буруу байна.');
        // else if(!insertingDescription || (insertingDescription || '').trim() === '') config.get('emitter').emit('warning', msg+'тайлбарыг буруу байна.');
        else if(!insertingAmount || insertingAmount < 0) config.get('emitter').emit('warning', msg+'мөнгөн дүнг буруу байна.');
        else if(insertingSubtag && insertingSubtag === '') config.get('emitter').emit('warning', msg+'tag-ыг буруу байна.');
        else if(!insertingDate || !isValidDate(insertingDate)) config.get('emitter').emit('warning', msg+'хугацаа буруу байна.');
        else this.props.dispatch(actions.submitOrlogoZarlaga({
                amount :insertingAmount, type: insertingType, subtag: insertingSubtag, _id: this.state._id,
                title: (insertingTitle || '').trim(), description: (insertingDescription || '').trim(),
                date: isValidDate(insertingDate), startDate: isValidDate(insertingRange[0]), endDate: isValidDate(insertingRange[1]),
                starting_date: this.state.starting_date,
                ending_date: this.state.ending_date,
            })).then((c) => {
                if((c.json || {}).success) {
                    this.setState({
                        starting_date: moment(starting_date).format('YYYY/MM/DD'),
                        ending_date: moment(ending_date).format('YYYY/MM/DD'),
                        pageNum: 0,
                        pageSize: 20,
                        subTag: '',
                        company: '',
                        search: '',
                        type: '',
                        user: '',
                        userSearch: '',

                        _id: '',
                        visible: false,
                        insertingAmount: 0,
                        insertingType: '',
                        insertingSubtag: '',
                        insertingTitle: '',
                        insertingCompany: {},
                        insertingDescription: '',
                        insertingDate: moment(today),
                        insertingStartDate: '',
                        insertingEndDate: '',
                        insertingUser: {}
                    }, () => this.search(0));
                }
            });
    }
    findSubTag(e){
        const {orlogoZarlaga: {Workplan_tags}} = this.props;
        let color = '', title = '';
        (Workplan_tags || []).map(workplan => {
            ((workplan || {}).subTags || []).map(tag => {
                if((tag._id || 'as').toString() === (e || '').toString()){
                    color = workplan.color;
                    title = tag.title;
                }
            });
        });
        return (
            <Row style={{alignItems: 'center'}}>
                <div style={{backgroundColor: color, width: 15, height: 15, borderRadius: '50%', overflow: 'hidden', marginRight: 5}}/>
                {title}
            </Row>
        )
    }
    getFormItem(label, property, rules, type, extra = [], extraType = 'text'){
        const [element, elementType] = (type || '').split("-")
        return (
            <>
                {/*<Form.Item*/}
                {/*    label={label}*/}
                {/*    name={typeof property === 'object' ? extra : property}*/}
                {/*    rules={rules}*/}
                {/*>*/}
                {/*    {*/}
                {/*        element === 'input' ?*/}
                {/*            elementType === 'text' ?*/}
                {/*                <Input value={(this.state || [])[property]} onChange={(e) => this.setState({[property]: e.target.value})} />*/}
                {/*                :*/}
                {/*                <InputNumber*/}
                {/*                    style={{width: '100%'}} value={(this.state || [])[property]}*/}
                {/*                    onChange={(e) => this.setState({[property]: e})} min={0}*/}
                {/*                    formatter={(value) => (`${value}` || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}*/}
                {/*                />*/}
                {/*            :*/}
                {/*            element === 'date' ?*/}
                {/*                elementType === 'single' ?*/}
                {/*                    <DatePicker*/}
                {/*                        allowClear={false} format={'YYYY-MM-DD HH:mm:ss'} style={{width: '100%'}}*/}
                {/*                        value={(this.state || [])[property]}*/}
                {/*                        onChange={(moment, string) => this.setState({*/}
                {/*                            [property]: moment*/}
                {/*                        })}*/}
                {/*                        showTime={true}*/}
                {/*                    />*/}
                {/*                    :*/}
                {/*                    <RangePicker*/}
                {/*                        format={'YYYY-MM-DD'} placeholder={['Эхлэх хугацаа', 'Дуусах хугацаа']} style={{width: '100%'}}*/}
                {/*                        value={[(this.state || [])[(property || [])[0]], (this.state || [])[(property || [])[1]]]}*/}
                {/*                        onChange={(moment, string) => this.setState({*/}
                {/*                            [(property || [])[0]]: (moment || [])[0],*/}
                {/*                            [(property || [])[1]]: (moment || [])[1]*/}
                {/*                        })}*/}
                {/*                    />*/}
                {/*                :*/}
                {/*                element === 'select' ?*/}
                {/*                    <Select value={(this.state || [])[property]} onSelect={(e) => this.setState({[property]: e})}>*/}
                {/*                        {*/}
                {/*                            extraType === 'text' ?*/}
                {/*                                (extra || []).map(option =>*/}
                {/*                                    <Select.Option value={option} key={option}>{option === 'orlogo' ? 'Орлого' : 'Зарлага'}</Select.Option>*/}
                {/*                                )*/}
                {/*                                :*/}
                {/*                                (extra || []).map(option =>*/}
                {/*                                    <Select.Option value={option.value} key={option.value}>{option.label}</Select.Option>*/}
                {/*                                )*/}
                {/*                        }*/}
                {/*                    </Select>*/}
                {/*                    :*/}
                {/*                    element === 'textarea' ?*/}
                {/*                        <Input.TextArea value={(this.state || [])[property]} onChange={(e) => this.setState({[property]: e.target.value})} rows={5} />*/}
                {/*                        :*/}
                {/*                        null*/}
                {/*    }*/}
                {/*</Form.Item>*/}
                <Form.Item
                    label={label}
                    name={typeof property === 'object' ? extra : property}
                    rules={rules}
                >
                    {
                        element === 'input' ?
                            elementType === 'text' ?
                                <Input />
                                :
                                <InputNumber
                                    style={{width: '100%'}}
                                    formatter={(value) => (`${value}` || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            :
                            element === 'date' ?
                                elementType === 'single' ?
                                    <DatePicker
                                        allowClear={false} format={'YYYY-MM-DD HH:mm:ss'} style={{width: '100%'}}
                                        showTime={true} placeholder={'Хугацаа'}
                                    />
                                    :
                                    <RangePicker
                                        format={'YYYY-MM-DD'} placeholder={['Эхлэх хугацаа', 'Дуусах хугацаа']} style={{width: '100%'}}
                                    />
                                :
                                element === 'select' ?
                                    <Select >
                                        {
                                            extraType === 'text' ?
                                                (extra || []).map(option =>
                                                    <Select.Option value={option} key={option}>{option === 'orlogo' ? 'Орлого' : 'Зарлага'}</Select.Option>
                                                )
                                                :
                                                (extra || []).map(option =>
                                                    <Select.Option value={option.value} key={option.value}>{option.label}</Select.Option>
                                                )
                                        }
                                    </Select>
                                    :
                                    element === 'textarea' ?
                                        <Input.TextArea rows={5} />
                                        :
                                        null
                    }
                </Form.Item>
            </>
        )
    }
    setCompany(e){
        let {main: {employee}, dispatch, orlogoZarlaga:{user}} = this.props;
        let cc = {
            pageNum:0,
            company: e,
            // starting_date: moment(starting_date).format('YYYY/MM/DD'),
            // ending_date: moment(ending_date).format('YYYY/MM/DD'),
            starting_date: moment(this.state.starting_date).format('YYYY/MM/DD'),
            ending_date: moment(this.state.ending_date).format('YYYY/MM/DD'),
            pageSize: this.state.pageSize,
            subTag: '',
            search: '',
            type: '',
            user: '',
            userSearch: '',
            sort: {columnKey:'date', order:'descend'},
        };
        this.setState({
            pageNum:0,
            company: e,
            // starting_date: moment(starting_date).format('YYYY/MM/DD'),
            // ending_date: moment(ending_date).format('YYYY/MM/DD'),
            subTag: '',
            search: '',
            type: '',
            user: '',
            userSearch: '',
            sort: {columnKey:'date', order:'descend'},

            _id: '',
            visible: false,
            insertingAmount: 0,
            insertingType: '',
            insertingSubtag: '',
            insertingTitle: '',
            insertingCompany: {},
            insertingDescription: '',
            insertingDate: moment(today),
            insertingStartDate: '',
            insertingEndDate: '',
            insertingUser: {}
        });
        dispatch(actions.getOrlogoZarlaga(cc));
    }
    changeCompanySort(type, order){
        let string = `sortCompany${type}`;
        let other = `sortCompany${type === 'Orlogo' ? 'Zarlaga' : 'Orlogo'}`;
        this.setState({
            [string]: {
                order: ((this.state[string] || {}).active) ? order : ((this.state[string] || {}).order),
                active: true,
            },
            [other]: {
                order: ((this.state[other] || {}).order || 'descend'),
                active: false,
            }
        });
    }
    render() {
        let {  main:{employee, company}, orlogoZarlaga: {companyOrlogo, orlogo,zarlaga, starting_date, ending_date, status, subCompanies, Workplan_tags, employees, orlogoZarlagas, gettingEmployees, publishing, all, user }  } = this.props;
        let mainUser = (this.props.main || {}).user;
        let columns = [
            {title: '№', key: '№', width: 100, render: (record) => (orlogoZarlagas || []).indexOf(record)+1+this.state.pageSize*this.state.pageNum},
            {title: 'Нэр', key: 'first_name', width: 260, ellipsis: true, render: (record) =>
                <Tooltip title={
                    <span>
                        {(((record.created_by || {}).user || {}).last_name || '').charAt(0).toUpperCase()}
                        {(((record.created_by || {}).user || {}).last_name || '').slice(1).toLowerCase()}&nbsp;
                        {(((record.created_by || {}).user || {}).first_name || '').charAt(0).toUpperCase()}
                        {(((record.created_by || {}).user || {}).first_name || '').slice(1).toLowerCase()}
                    </span>
                }>
                    <div className='emp_name'>
                        {
                            (((record.created_by || {}).user || {}).last_name || '').length +
                            (((record.created_by || {}).user || {}).first_name || '').length > 25 ?
                                `${(((record.created_by || {}).user || {}).last_name || '').charAt(0).toUpperCase()}.
                                ${(((record.created_by || {}).user || {}).first_name || '').charAt(0).toUpperCase()}${(((record.created_by || {}).user || {}).first_name || '').slice(1).toLowerCase()}`
                                :
                                `${(((record.created_by || {}).user || {}).last_name || '').charAt(0).toUpperCase()}${(((record.created_by || {}).user || {}).last_name || '').slice(1).toLowerCase()} `
                                + `${(((record.created_by || {}).user || {}).first_name || '').charAt(0).toUpperCase()}${(((record.created_by || {}).user || {}).first_name || '').slice(1).toLowerCase()}`
                        }
                    </div>
                </Tooltip>
            },
            {title: 'Гарчиг', key: 'title', ellipsis: true, width: 200, render: (record) =>
                <Tooltip title={record.title}>
                    <div
                        style={{
                            width: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'
                        }}
                        key={`${record._id}-title`}
                    >
                        {record.title}
                    </div>
                </Tooltip>
            },
            {title: 'Компани', key: 'type', width: 200, render: (record) => <Tooltip title={(record.company || {}).name}>
                    <div style={{width: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}}
                         key={`${(record.company || {})._id}-description`}
                    >
                        {(record.company || {}).name}
                    </div>
                </Tooltip>
            },
            // {title: 'Тайлбар', key: 'description', ellipsis: true, width: 200, render: (record) => <Tooltip title={record.description}>
            //         <div style={{width: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}}
            //              key={`${record._id}-description`}
            //         >
            //             {record.description}
            //         </div>
            //     </Tooltip>},
            {title: 'Төрөл', key: 'type', width: 120, render: (record) => record.type === 'orlogo' ? <Tag color={'green'}>Орлого</Tag> : <Tag color={'volcano'}>Зарлага</Tag>},
            {
                title: 'Мөнгөн дүн',
                key: 'amount',
                width: 200,
                render: (record) => <Tooltip title={(`${record.amount}` || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'₮'}>
                    {(`${record.amount}` || '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'₮'}
                </Tooltip>,
                ellipsis: true,
                sorter: (a, b) => {},
                sortOrder: (this.state.sort || {}).columnKey === 'amount' && (this.state.sort || {}).order,
            },
            // {title: 'Tag', key: 'tag', width: 200, render: (record) => <Tooltip title={record.title}>
            //         <div style={{width: '200px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}} key={`${record._id}-title`}>
            //             {record.title}
            //         </div>
            //     </Tooltip>},
            {
                title: 'Хугацаа',
                key: 'date',
                width: 200,
                render: (record) => moment(record.date).format('YYYY/MM/DD HH:mm'),
                sorter: (a, b) => {},
                sortOrder: (this.state.sort || {}).columnKey === 'date' && (this.state.sort || {}).order,
            },
            // {title: 'Хамрах хүрээ', key: 'date', width: 250, render: (record) =>
            //         `${moment(record.startingDate).format('YYYY/MM/DD')} - ${moment(record.endingDate).format('YYYY/MM/DD')}`},
            {title: 'Үйлдлүүд', key: 'actions', width: 150, render: (record) =>
                publishing === (record._id || 'sd').toString() ?
                    <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}><Spin /></div>
                    :
                    <Space direction={'row'}>
                        {/*<Popconfirm*/}
                        {/*    title={*/}
                        {/*        <>*/}
                        {/*            {record.type === 'orlogo' ? 'Орлогыг' : 'Зарлагыг'} нийтлэх үү?`}*/}
                        {/*            <div>*/}
                        {/*                {`${record.type === 'orlogo' ? 'Орлогыг' : 'Зарлагыг'} нийтлэх үү?`}*/}
                        {/*                <Alert */}
                        {/*                    type={'warning'} message={'Нийтэлсэн тохиолдолд засах болон устгах үйлдэл хйих боломжгүйг анхаарна уу!'} */}
                        {/*                    showIcon={true}*/}
                        {/*                />*/}
                        {/*            </div>*/}
                        {/*        </>*/}
                        {/*    }*/}
                        {/*    disabled={publishing === (record._id || 'sd').toString()}*/}
                        {/*    okText={'Тийм'} cancelText={'Үгүй'} onConfirm={() => this.props.dispatch(actions.publishOrlogoZarlaga({_id: record._id}))}*/}
                        {/*>*/}
                        {/*    <Button icon={<CloudUploadOutlined />} disabled={publishing === (record._id || 'sd').toString()} />*/}
                        {/*</Popconfirm>*/}
                        <Button
                            icon={(mainUser._id || 'as').toString() === (((record.created_by || {}).user || {})._id || '').toString() ? <EditOutlined /> : <EyeOutlined/>} size={'small'} disabled={publishing === (record._id || 'sd').toString()}
                            onClick={() => {
                                this.setState({
                                    _id: record._id,
                                    visible: true,
                                    insertingAmount: record.amount,
                                    insertingType: record.type,
                                    insertingSubtag: record.subTag,
                                    insertingTitle: record.title,
                                    insertingCompany: record.company,
                                    insertingDescription: record.description,
                                    insertingDate: moment(record.date),
                                    insertingStartDate: moment(record.startingDate),
                                    insertingEndDate: moment(record.endingDate),
                                    insertingUser: (record.created_by || {}).user
                                })
                            }}
                        />
                        {
                            (mainUser._id || 'as').toString() === (((record.created_by || {}).user || {})._id || '').toString() ?
                                <Popconfirm
                                    title={`${record.type === 'orlogo' ? 'Орлогыг' : 'Зарлагыг'} устгах үү?`}
                                    disabled={publishing === (record._id || 'sd').toString()}
                                    okText={'Тийм'} cancelText={'Үгүй'} onConfirm={() => this.props.dispatch(actions.deleteOrlogoZarlaga({_id: record._id}))}
                                >
                                    <Button danger icon={<DeleteOutlined />} size={'small'} disabled={publishing === (record._id || 'sd').toString()}/>
                                </Popconfirm>
                                :
                                null
                        }
                    </Space>
            },
        ];
        let sortedCompanyOrlogo = companyOrlogo;
        if(sortedCompanyOrlogo && sortedCompanyOrlogo.length>1){
            let hole = null, holeIdx = 0;
            sortedCompanyOrlogo.map(function (r, idx) {
                if(r.company && Object.keys(r.company || {}).length > 0 && r.company._id.toString() === company._id.toString()){
                    hole = r;
                    holeIdx = idx;
                }
            });
            if(hole){
                console.log(sortedCompanyOrlogo);
                sortedCompanyOrlogo.splice(holeIdx, 1);
                console.log(sortedCompanyOrlogo);
                sortedCompanyOrlogo = [hole,...(sortedCompanyOrlogo || [])];
            }
        }
        if(sortedCompanyOrlogo && (sortedCompanyOrlogo || []).length > 0){
            if(this.state.sortCompanyOrlogo.active){
                if(this.state.sortCompanyOrlogo.order === 'descend'){
                    sortedCompanyOrlogo.sort((a, b) => {
                        return b.orlogo - a.orlogo;
                    });
                }else{
                    sortedCompanyOrlogo.sort((a, b) => {
                        return a.orlogo - b.orlogo;
                    });
                }
            }else{
                if(this.state.sortCompanyZarlaga.order === 'descend'){
                    sortedCompanyOrlogo.sort((a, b) => {
                        return b.zarlaga - a.zarlaga;
                    });
                }else{
                    sortedCompanyOrlogo.sort((a, b) => {
                        return a.zarlaga - b.zarlaga;
                    });
                }
            }
        }
        return (
            <React.Fragment>
                <Row style={{justifyContent: 'space-between', textAlign: 'right', width: '100%', marginBottom: 10}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        {
                            hasAction(['read_orlogo_zarlaga'], employee) ?
                                <>
                                    <Title level={5} style={{marginRight: 10, marginBottom: 0, display: 'inline-block', width: 126, textAlign: 'right'}}>Компани:</Title>
                                    <Select
                                        loading={status}
                                        disabled={status}
                                        style={{width: 886, marginRight: 20, textAlign: 'left'}} placeholder={'Компани'}
                                        name='company' value={this.state.company} onChange={this.setCompany.bind(this)}
                                    >
                                        <Option key={'ho_com'} value=''>Бүх компани</Option>
                                        {subCompanies?.map( c=>
                                            <Option value={c._id} key={`${c._id}_coms`}>{c.name}</Option>
                                        )}
                                    </Select>
                                </>
                                :
                                null
                        }
                    </div>
                    <Button
                        icon={<PlusOutlined />} onClick={() => this.setState({visible: true})}
                        type={'primary'} key={'header-buttons'}
                        loading={status}
                    >
                        Орлого зарлага нэмэх
                    </Button>
                </Row>
                <Divider/>
                {status?
                    <div style={{textAlign:'center', marginTop:60}}>
                        <Spin size="large" />
                    </div>
                    :
                    <React.Fragment>
                        <div key={'header-div'}>
                            <Row key='date' style={{marginBottom: 10}}>
                                <Title level={5} style={{marginRight: 10, marginBottom: 0, display: 'inline-block', width: 126, textAlign: 'right'}}>Орлого зарлага:</Title>
                                <Form onFinish={() => this.search({current:1},null, this.state.sort)}>
                                    <RangePicker
                                        loading={status}
                                        disabled={status}
                                        renderExtraFooter={() => (
                                            <div className='range-picker-extra-footer-css'>
                                                <div className='clickable-dv' onClick={this.setRangePickerExtraFooter.bind(this, 'thisWeek')}>Энэ долоо хоног</div>
                                                <div className='clickable-dv' onClick={this.setRangePickerExtraFooter.bind(this, 'lastWeek')}>Өмнөх долоо хоног</div>
                                                <div className='clickable-dv' onClick={this.setRangePickerExtraFooter.bind(this, 'thisMonth')}>Энэ сар</div>
                                                <div className='clickable-dv' onClick={this.setRangePickerExtraFooter.bind(this, 'lastMonth')}>Өмнөх сар</div>
                                            </div>
                                        )}
                                        allowClear={false}
                                        value={
                                            this.state.starting_date && this.state.ending_date
                                                ? [
                                                    moment(this.state.starting_date),
                                                    moment(this.state.ending_date),
                                                ]
                                                : null
                                        }
                                        style={{marginRight: 20}}
                                        placeholder={["Эхлэх хугацаа", "Дуусах хугацаа"]}
                                        onChange={(dateString, dateValue) =>
                                            this.dateHandle(dateString, dateValue)
                                        }
                                    />
                                    <Input
                                        loading={status}
                                        disabled={status}
                                        style={{width: 150, marginRight: 20}} addonAfter={<CloseCircleFilled style={{color:'white'}}
                                                                                                             onClick={() => this.setState({search:''})} />} maxLength={60} placeholder='Гарчиг' value={this.state.search}
                                        name='search' onChange={(e) => this.setState({search: e.target.value})}
                                    />
                                    <Select
                                        loading={status}
                                        disabled={status}
                                        style={{width: 150, marginRight: 20}} placeholder={'Таг'}
                                        name='subTag' value={this.state.subTag} onChange={(e) => this.setState({subTag: e})}
                                    >
                                        <Option key={'ho_ta'} value=''>Бүх таг</Option>
                                        {Workplan_tags?.map( r=>
                                            r.subTags && r.subTags.length>0 ?
                                                <React.Fragment>
                                                    <Option disabled value={r._id} key={`${r._id}_option_multi`}>{r.title} <span style={{color:'#cacaca', fontSize:10}}>{(r.company || {}).name}</span></Option>
                                                    {r.subTags.map(c =>
                                                        <Option value={c._id} key={`${c._id}_option_multi`}>{c.title}</Option>
                                                    )
                                                    }
                                                </React.Fragment>
                                                :
                                                null
                                        )}
                                    </Select>
                                    <Select
                                        loading={status}
                                        disabled={status}
                                        style={{width: 150, marginRight: 20}} name='type' value={this.state.type} onChange={(e) => this.setState({type: e})}>
                                        <Option key={''} value=''>Бүгд</Option>
                                        <Option key={'orlogo'} value='orlogo'>Орлого</Option>
                                        <Option key={'zarlaga'} value='zarlaga'>Зарлага</Option>
                                    </Select>
                                    <Button loading={status} type="primary" icon={<SearchOutlined />} htmlType="submit" >Хайх</Button>
                                </Form>
                            </Row>
                            {
                                hasAction(['read_orlogo_zarlaga'], employee) ?
                                    <Row key={'user'}>
                                        <Title level={5} style={{marginRight: 10, marginBottom: 0, display: 'inline-block', width: 126, textAlign: 'right'}}>Хэрэглэгч:</Title>
                                        <Select
                                            loading={status || gettingEmployees}
                                            // disabled={status || gettingEmployees}
                                            name='user'
                                            allowClear showSearch={true}
                                            style={{ width: 886 }}
                                            placeholder="Хэрэглэгчийн нэр, овог болон утсаар хайх"
                                            onSelect={(e) => this.selectEmployee(e)}
                                            onClear={() => this.setState({user: ''})}
                                            onSearch={this.searchEmployees.bind(this)}
                                            filterOption={false}
                                            value={(this.state.user || {})._id}
                                            dropdownClassName={'orlogo-zarlaga-dropdown'}
                                            dropdownRender={(record) =>
                                                ((record.props || {}).options || []).length > 0 ?
                                                    ((record.props || {}).options || []).map((opt, index) =>
                                                        <Row
                                                            key={`multiple-column-select-column-${index}`}
                                                            className={((this.state.user || {})._id || 'a').toString() === opt.value ? 'row active' : 'row'}
                                                            onClick={() => this.selectEmployee(opt.value)}
                                                            style={{display: 'flex', alignItems: 'center'}}
                                                        >
                                                            {
                                                                (
                                                                    opt.children || []).map((child, ind) =>
                                                                    typeof child === 'object' ?
                                                                        <div style={{borderRadius: '50%', overflow: 'hidden', marginRight: 10}}
                                                                             key={`multiple-column-select-row-${ind}`}
                                                                        >
                                                                            <img
                                                                                style={{width: 50, height: 50, objectFit: 'cover', objectPosition: 'center'}}
                                                                                src={(child.props || {}).src ?
                                                                                    (child.props || {}).src
                                                                                    :
                                                                                    '/images/default-avatar.png'}
                                                                                onError={(e) => e.target.src = '/images/default-avatar.png'}
                                                                            />
                                                                        </div>
                                                                        :
                                                                        <span
                                                                            key={`multiple-column-select-span-${ind}`}
                                                                            style={{fontWeight: 'bold', fontSize: 17, display: 'inline-block'}}
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
                                                    <Option value={emp._id} key={emp._id}>
                                                        <img
                                                            style={{display: 'none'}}
                                                            src={((emp.user || {}).avatar || {}).path ?
                                                                `${config.get('hostMedia')}${((emp.user || {}).avatar || {}).path}`
                                                                :
                                                                '/images/default-avatar.png'}
                                                            onError={(e) => e.target.src = '/images/default-avatar.png'}
                                                        />
                                                        {
                                                            (((emp || {}).user || {}).last_name || '').slice(0,1).toUpperCase()}.
                                                        {(((emp || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                                                        (((emp || {}).user || {}).first_name || '').slice(1,(((emp || {}).user || {}).first_name || '').length)
                                                        }&nbsp;{
                                                        ` - ${((emp || {}).company || {}).name}`
                                                    }
                                                    </Option>
                                                )
                                            }
                                        </Select>
                                    </Row>
                                    :
                                    null
                            }
                        </div>
                        <Divider key={'orlogo-zarlaga-divider'}/>
                        <div style={{fontSize:16, marginBottom:10}}><span><span >Илэрц:</span> {starting_date} - {ending_date}</span></div>
                        <div style={{fontSize:14, marginBottom:20}}>
                            {
                                this.state.sortCompanyOrlogo.active ?
                                    this.state.sortCompanyOrlogo.order === 'descend' ? 
                                        <button
                                            className={'sortButton-orlogoZarlaga'} 
                                            onClick={() => this.changeCompanySort('Orlogo', 'ascend')}
                                        >
                                            <DownCircleTwoTone />
                                        </button>
                                        :
                                        <button
                                            className={'sortButton-orlogoZarlaga'} 
                                            onClick={() => this.changeCompanySort('Orlogo', 'descend')}
                                        >
                                            <UpCircleTwoTone />
                                        </button>
                                    :
                                    this.state.sortCompanyOrlogo.order === 'descend' ? 
                                        <button
                                            className={'sortButton-orlogoZarlaga'}
                                            onClick={() => this.changeCompanySort('Orlogo', 'ascend')}
                                        >
                                            <DownCircleOutlined  />
                                        </button>
                                        :
                                        <button
                                            className={'sortButton-orlogoZarlaga'} 
                                            onClick={() => this.changeCompanySort('Orlogo', 'descend')}
                                        >
                                            <UpCircleOutlined/>
                                        </button>
                            }
                            <span style={{userSelect: 'none'}}>Орлого: </span><Tag style={{marginRight:20, fontSize:14}} color={'green'}>{(orlogo || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮</Tag>
                            {
                                this.state.sortCompanyZarlaga.active ?
                                    this.state.sortCompanyZarlaga.order === 'descend' ? 
                                        <button
                                            className={'sortButton-orlogoZarlaga'} 
                                            onClick={() => this.changeCompanySort('Zarlaga', 'ascend')}
                                        >
                                            <DownCircleTwoTone />
                                        </button>
                                        :
                                        <button
                                            className={'sortButton-orlogoZarlaga'} 
                                            onClick={() => this.changeCompanySort('Zarlaga', 'descend')}
                                        >
                                            <UpCircleTwoTone />
                                        </button>
                                    :
                                    this.state.sortCompanyZarlaga.order === 'descend' ? 
                                        <button
                                            className={'sortButton-orlogoZarlaga'}
                                            onClick={() => this.changeCompanySort('Zarlaga', 'ascend')}
                                        >
                                            <DownCircleOutlined  />
                                        </button>
                                        :
                                        <button
                                            className={'sortButton-orlogoZarlaga'} 
                                            onClick={() => this.changeCompanySort('Zarlaga', 'descend')}
                                        >
                                            <UpCircleOutlined/>
                                        </button>
                            }
                            <span style={{userSelect: 'none'}}>Зарлага: </span><Tag style={{fontSize:14}} color={'volcano'}>{(zarlaga || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮</Tag>
                        </div>
                        {ending_date && starting_date?
                            <div>
                                {sortedCompanyOrlogo && sortedCompanyOrlogo.length>1  ?
                                    sortedCompanyOrlogo.map(r =>
                                        <div style={{fontSize:14, marginBottom:10, position:'relative', paddingLeft:130}}>
                                            <span style={{ position:'absolute', left:0, display:'inline-block',fontWeight:600, width:125, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{((r.company || {}).name || '')}</span>
                                            <span style={{display:'inline-block'}}>
                                                Орлого: <Tag style={{marginRight:20, fontSize:14}} color={'green'}>{(r.orlogo || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮</Tag>
                                            </span>
                                            <span>
                                                Зарлага: <Tag style={{fontSize:14}} color={'volcano'}>{(r.zarlaga || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮</Tag>
                                            </span>
                                        </div>
                                    )
                                    :
                                    null
                                }
                            </div>
                            :
                            null
                        }
                        {
                            (user || {}).user ?
                                <div key={'user-div'} style={{display: 'flex', flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: '10px 30px 10px 10px', width: 'max-content', borderTopRightRadius: 20}}>
                                    <img
                                        style={{width: 75, height: 75, objectFit: 'cover', objectPosition: 'center', borderRadius: '50%', overflow: 'hidden', marginRight: 10}}
                                        src={((user.user || {}).avatar || {}).path ?
                                            `${config.get('hostMedia')}${((user.user || {}).avatar || {}).path}`
                                            :
                                            '/images/default-avatar.png'}
                                        onError={(e) => e.target.src = '/images/default-avatar.png'}
                                    />
                                    <Title style={{marginBottom: 0}} level={4}>{`${(user.user || {}).last_name} ${(user.user || {}).first_name}`}</Title>
                                </div>
                                :
                                null
                        }
                        <Table
                            size={'small'}
                            rowKey={(record) => {return record._id}}
                            dataSource={orlogoZarlagas}
                            columns={columns} loading={status}
                            locale={{emptyText: 'Хоосон байна'}}
                            pagination={{
                                pageSize: this.state.pageSize,
                                current: this.state.pageNum+1,
                                total: all,
                                position: ['topRight', 'bottomRight']
                            }}
                            onChange={this.search.bind(this)}
                        />
                    </React.Fragment>
                }
                <Drawer
                    title={
                        this.state.insertingUser && (Object.keys(this.state.insertingUser) || []).length > 0 && (mainUser._id || 'as').toString() !== ((this.state.insertingUser || {})._id || '').toString() ?
                            this.state.insertingType === 'orlogo' ? "Орлогын мэдээлэл" : "Зарлагын мэдээлэл"
                            :
                            this.state._id !== '' ? this.state.insertingType === 'orlogo' ? "Орлого шинэчлэх" : "Зарлага шинэчлэх" : "Орлого зарлага үүсгэх"
                    }
                    maskClosable={false}
                    onClose={this.clearDrawer.bind(this)}
                    width={720}
                    className={'orlogo-zarlaga'}
                    visible={this.state.visible}
                    key={'drawer-orlogo-zarlaga'}
                    footer={
                        this.state.insertingUser && (Object.keys(this.state.insertingUser) || []).length > 0 && (mainUser._id || 'as').toString() !== ((this.state.insertingUser || {})._id || '').toString() ?
                            null
                            :
                            <div style={{textAlign: 'right'}}>
                                <Button style={{marginRight: 20}} onClick={this.clearDrawer.bind(this)}>Болих</Button>
                                <Button
                                    type="primary" form={'orlogoZarlagaForm'}
                                    htmlType={'submit'} loading={status}
                                >
                                    {this.state._id !== '' ? 'Шинэчлэх' : 'Үүсгэх'}
                                </Button>
                            </div>
                    }
                >
                    {
                        this.state.insertingUser && (Object.keys(this.state.insertingUser) || []).length > 0 && (mainUser._id || 'as').toString() !== ((this.state.insertingUser || {})._id || '').toString() ?
                            <>
                                <Title style={{marginBottom: 15}} level={4}>{`${(this.state.insertingUser || {}).last_name} ${(this.state.insertingUser || {}).first_name} хэрэглэгчийн ${
                                    this.state.insertingType === 'orlogo' ? 'орлогын ' : 'зарлагын '
                                } мэдээлэл`}</Title>
                                <Row style={{fontSize: 16, marginBottom: 10}}>
                                    <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Компани:</Col>
                                    <Col span={14}>{(this.state.insertingCompany || {}).name}</Col>
                                </Row>
                                <Row style={{fontSize: 16, marginBottom: 10}}>
                                    <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Гарчиг:</Col>
                                    <Col span={14}>{this.state.insertingTitle}</Col>
                                </Row>
                                <Row style={{fontSize: 16, marginBottom: 10}}>
                                    <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Тайлбар:</Col>
                                    <Col span={14}>{this.state.insertingDescription}</Col>
                                </Row>
                                <Row style={{fontSize: 16, marginBottom: 10}}>
                                    <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Төрөл:</Col>
                                    <Col span={14}>{this.state.insertingType === 'orlogo' ? <Tag color={'green'}>Орлого</Tag> : <Tag color={'red'}>Зарлага</Tag>}</Col>
                                </Row>
                                <Row style={{fontSize: 16, marginBottom: 10}}>
                                    <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Мөнгөн дүн:</Col>
                                    <Col span={14}>{`${`${this.state.insertingAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}₮`}</Col>
                                </Row>
                                {
                                    this.state.insertingSubtag ?
                                        <Row style={{fontSize: 16, marginBottom: 10}}>
                                            <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Tag:</Col>
                                            <Col span={14}>{this.findSubTag(this.state.insertingSubtag)}</Col>
                                        </Row>
                                        :
                                        null
                                }
                                <Row style={{fontSize: 16, marginBottom: 10}}>
                                    <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Хугацаа:</Col>
                                    <Col span={14}>{moment(this.state.insertingDate).format('YYYY-MM-DD HH:mm:ss')}</Col>
                                </Row>
                                {
                                    this.state.insertingStartDate && this.state.insertingEndDate ?
                                        <Row style={{fontSize: 16, marginBottom: 10}}>
                                            <Col span={6} style={{textAlign: 'right', fontWeight: 'bold', marginRight: 8}}>Хамрах хүрээ:</Col>
                                            <Col span={14}>
                                                {moment(this.state.insertingStartDate).format('YYYY-MM-DD')}
                                                -
                                                {moment(this.state.insertingEndDate).format('YYYY-MM-DD')}
                                            </Col>
                                        </Row>
                                        :
                                        null
                                }
                            </>
                            :
                            <Form
                                id='orlogoZarlagaForm'
                                onFinish={this.submitOrlogoZarlaga.bind(this)}
                                fields={[
                                    {name: 'insertingTitle', value: this.state.insertingTitle},
                                    {name: 'insertingDescription', value: this.state.insertingDescription},
                                    {name: 'insertingType', value: this.state.insertingType},
                                    {name: 'insertingAmount', value: this.state.insertingAmount},
                                    {name: 'insertingSubtag', value: this.state.insertingSubtag},
                                    {name: 'insertingDate', value: this.state.insertingDate},
                                    {name: 'insertingRange', value: [this.state.insertingStartDate, this.state.insertingEndDate]},
                                ]}
                                labelCol={{
                                    span: 6,
                                }}
                                wrapperCol={{
                                    span: 14,
                                }}
                            >
                                {this.getFormItem(
                                    'Гарчиг', 'insertingTitle',
                                    [
                                        {
                                            required: true,
                                            message: 'Орлого зарлагын нэр оруулна уу.',
                                            transform: (value) => value.trim()
                                        }
                                    ],
                                    'input-text'
                                )}
                                {this.getFormItem(
                                    'Тайлбар', 'insertingDescription',
                                    [
                                        // {
                                        //     required: true,
                                        //     message: 'Орлого зарлагын тайлбар оруулна уу.',
                                        //     transform: (value) => value.trim()
                                        // }
                                    ],
                                    'textarea'
                                )}
                                {this.getFormItem(
                                    'Төрөл', 'insertingType',
                                    [
                                        {
                                            required: true,
                                            message: 'Орлого зарлагын төрлийг сонгоно уу.',
                                        }
                                    ],
                                    'select', ['orlogo', 'zarlaga']
                                )}
                                {this.getFormItem(
                                    'Мөнгөн дүн', 'insertingAmount',
                                    [
                                        {
                                            required: true,
                                            message: 'Орлого зарлагын мөнгөн дүнг оруулна уу.'
                                        }
                                    ],
                                    'input-number'
                                )}
                                <Form.Item
                                    label={'Tag'}
                                    name={'insertingSubtag'}
                                >
                                    <Select
                                        style={{width: '100%', marginRight: 20}} placeholder={'Таг'}
                                    >
                                        {Workplan_tags?.map( r=>
                                            r.subTags && r.subTags.length>0 ?
                                                <React.Fragment>
                                                    <Option disabled value={r._id} key={`${r._id}_option_multi`}>{r.title}</Option>
                                                    {r.subTags.map(c =>
                                                        <Option value={c._id} key={`${c._id}_option_multi`}>{c.title}</Option>
                                                    )
                                                    }
                                                </React.Fragment>
                                                :
                                                null
                                        )}
                                    </Select>
                                </Form.Item>
                                {this.getFormItem(
                                    'Хугацаа', 'insertingDate',
                                    [
                                        {
                                            required: true,
                                            message: 'Орлого зарлагын мөнгөн дүнг оруулна уу.',
                                        },
                                        {transform: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    ],
                                    'date-single'
                                )}
                                {this.getFormItem(
                                    'Хамрах хүрээ', ['insertingStartDate', 'insertingEndDate'],
                                    [], 'date-range', 'insertingRange'
                                )}
                            </Form>
                    }

                </Drawer>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(OrlogoZarlaga);