import React from 'react'
import {connect} from "react-redux";
import { locale } from '../../lang';
import {
    Avatar,
    Badge,
    Button,
    Calendar,
    Card,
    Col,
    Collapse,
    DatePicker,
    Divider,
    Drawer,
    Empty,
    Form,
    Input,
    InputNumber,
    List,
    Modal,
    Popconfirm,
    Popover,
    Row,
    Select,
    Space,
    Table, Checkbox,
    Tag, Tooltip,
    Typography
} from 'antd'
import config, {printStaticRole} from "../../config";
import {
    getEmployeeOrientation,
    getOrientation,
    deleteOrientation,
    createOrientation,
    changeEmployeeOrientation,
    finishEmployeeOrientation,
} from "../../actions/orientation_actions";
import moment from 'moment'
import {CheckCircleFilled, CloseCircleFilled, PlusOutlined, EnterOutlined, MinusOutlined, CloseOutlined, QuestionOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {companyAdministrator} from "../../config";

import { Link } from 'react-router-dom';
const reducer = ({main, orientation}) => ({main, orientation})

class Orientation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            _id: '',
            title: '',
            notAllCheckedEnv: false,
            checkedAllEnv: false,
            checkedListEnv: [],
            notAllCheckedExtra: false,
            checkedAllExtra: false,
            checkedListExtra: [],
            addingEnv: false,
            addingEnvTemp: '',
            addingExtra: false,
            addingExtraTemp: '',
            listsEnv: [locale("common_orientation.shiree"), locale("common_orientation.sandal"), locale("common_orientation.Computer"), locale("common_orientation.dotuur_huvtsas"), locale("common_orientation.Ajliin_huvtsas"), locale("common_orientation.unemleh"), locale("common_orientation.ayga"), locale("common_orientation.devter"), locale("common_orientation.uzeg_bal")],
            listsExtra: [
                locale("common_orientation.1"),
                locale("common_orientation.2"),
                locale("common_orientation.3"),
                locale("common_orientation.4"),
                locale("common_orientation.5"),
                locale("common_orientation.6"),
                locale("common_orientation.7"),
                locale("common_orientation.8"),
                locale("common_orientation.9"),
                locale("common_orientation.10"),
                locale("common_orientation.11"),
                locale("common_orientation.12"),
                locale("common_orientation.13"),
                locale("common_orientation.14"),
                locale("common_orientation.15"),
                locale("common_orientation.16"),
                locale("common_orientation.17"),
                locale("common_orientation.18"),
                locale("common_orientation.19"),
            ],
            orientationPageNum: 0,
            orientationPageSize: 5,
            orientationSearch: '',
            employeePageNum: 0,
            employeePageSize: 5,
            employeeSearch: '',

            modal: false,
            singleListsEnv: [],
            singleListsExtra: [],
            first_name: '',
            last_name: '',
            register_id: '',
            orientationEmployee_id: '',
        }
        this.clear = this.clear.bind(this);

    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        if(!companyAdministrator( employee)){
            this.props.history.replace('/not-found');
        }else{
            this.props.dispatch(getEmployeeOrientation({search: '', pageNum: this.state.employeePageNum, pageSize: this.state.employeePageSize}));
            this.props.dispatch(getOrientation({search: '', pageNum: this.state.orientationPageNum, pageSize: this.state.orientationPageSize}));
        }
    }
    clear(){
        this.setState({
            visible: false,
            _id: '',
            title: '',
            notAllCheckedEnv: false,
            checkedAllEnv: false,
            checkedListEnv: [],
            notAllCheckedExtra: false,
            checkedAllExtra: false,
            checkedListExtra: [],
            addingEnv: false,
            addingEnvTemp: '',
            addingExtra: false,
            addingExtraTemp: '',
            listsEnv: [locale("common_orientation.shiree"), locale("common_orientation.sandal"), locale("common_orientation.Computer"), locale("common_orientation.dotuur_huvtsas"), locale("common_orientation.Ajliin_huvtsas"), locale("common_orientation.unemleh"), locale("common_orientation.ayga"), locale("common_orientation.devter"), locale("common_orientation.uzeg_bal")],
            listsExtra: [
                locale("common_orientation.1"),
                locale("common_orientation.2"),
                locale("common_orientation.3"),
                locale("common_orientation.4"),
                locale("common_orientation.5"),
                locale("common_orientation.6"),
                locale("common_orientation.7"),
                locale("common_orientation.8"),
                locale("common_orientation.9"),
                locale("common_orientation.10"),
                locale("common_orientation.11"),
                locale("common_orientation.12"),
                locale("common_orientation.13"),
                locale("common_orientation.14"),
                locale("common_orientation.15"),
                locale("common_orientation.16"),
                locale("common_orientation.17"),
                locale("common_orientation.18"),
                locale("common_orientation.19"),
            ],

            modal: false,
            singleListsEnv: [],
            singleListsExtra: [],
            first_name: '',
            last_name: '',
            register_id: '',
            orientationEmployee_id: ''
        })
    }
    submitOrientation(){
        if(!this.state.title || this.state.title === ''){
            config.get('emitter').emit(locale("common_orientation.hutulburin_nere"));
        }else if(!this.state.checkedListEnv || ((this.state.checkedListEnv || []).length === 0 && (this.state.checkedListExtra || []).length === 0)){
            config.get('emitter').emit(locale("common_orientation.songoh_heseg"));
        }else{
            this.props.dispatch(createOrientation({
                _id: this.state._id,
                title: this.state.title,
                list_environment: this.state.checkedListEnv,
                list_extra: this.state.checkedListExtra,
            })).then(c => {
                if((c.json || {}).success){
                    this.clear();
                }
            })
        }
    }
    searchEmployees(e){
        const {dispatch} = this.props;
        let self = this;
        clearTimeout(this.state.timeOutEmployee);
        let timeOutEmployee = setTimeout(function(){
            dispatch(getEmployeeOrientation({search: e, pageNum: 0, pageSize: self.state.employeePageSize}));
        }, 300);
        this.setState({timeOut: timeOutEmployee, employeeSearch: e, employeePageNum: 0});
    }
    searchOrientation(e){
        const {dispatch} = this.props;
        let self = this;
        clearTimeout(this.state.timeOutOrien);
        let timeOutOrien = setTimeout(function(){
            dispatch(getOrientation({search: e, pageNum: 0, pageSize: self.state.orientationPageSize}));
        }, 500);
        this.setState({timeOut: timeOutOrien, orientationSearch: e, orientationPageNum: 0});
    }
    changeOrientation(){
        const {dispatch} = this.props;
        dispatch(changeEmployeeOrientation({
            listEnv: self.state.checkedListEnv,
            listExtra: self.state.checkedListExtra,
            _id: self.state.orientationEmployee_id
        }));
    }
    checkAll(type, checked, modal){
        if(type === 'env'){
            if(checked){
                this.setState({
                    checkedListEnv: (modal ? (this.state.singleListsEnv || []) : (this.state.listsEnv || [])), checkedAllEnv: true, notAllCheckedEnv: false
                });
            }else{
                this.setState({checkedListEnv: [], checkedAllEnv: false});
            }
        }else{
            if(checked){
                this.setState({
                    checkedListExtra: (modal ? (this.state.singleListsExtra || []) : (this.state.listsExtra || [])), checkedAllExtra: true, notAllCheckedExtra: false
                });
            }else{
                this.setState({checkedListExtra: [], checkedAllExtra: false});
            }
        }
    }
    handleChange(checking, type, modal){
        if(type === 'env' || type === 'Env'){
            this.setState({
                checkedListEnv: checking,
                notAllCheckedEnv:
                    modal ? !!(checking || []).length && (checking || ['as']).length !== (this.state.singleListsEnv || []).length
                        : !!(checking || []).length && (checking || ['as']).length !== (this.state.listsEnv || []).length,
                checkedAllEnv:
                    modal ? (checking || ['as']).length === (this.state.singleListsEnv || []).length
                        : (checking || ['as']).length === (this.state.listsEnv || []).length
            });
        }else{
            this.setState({
                checkedListExtra: checking,
                notAllCheckedExtra:
                    modal ? !!(checking || []).length && (checking || ['as']).length !== (this.state.singleListsExtra || []).length
                        : !!(checking || []).length && (checking || ['as']).length !== (this.state.listsExtra || []).length,
                checkedAllExtra:
                    modal ? (checking || ['as']).length === (this.state.singleListsExtra || []).length
                        : (checking || ['as']).length === (this.state.listsExtra || []).length
            });
        }
    }
    getInput(type){
        let stringTemp = `adding${type}Temp`;
        let stringList = `lists${type}`;
        let disabled = (this.state || [])[stringTemp] === '';
        return (
            <div key={stringList} style={{marginTop: 10, display: 'flex', flexDirection: 'row'}}>
                <Input
                    value={(this.state || [])[stringTemp]}
                    onChange={(e) => this.setState({[stringTemp]: e.target.value})}
                    key={stringTemp}
                    onPressEnter={() => {
                        let value = ((this.state || [])[stringTemp] || '').trim();
                        if(value !== '' && !((this.state || [])[stringList] || []).includes(value)){
                            this.setState({
                                [stringList]: [...((this.state || [])[stringList] || []), value],
                                [`adding${type}`]: false,
                                [stringTemp]: ''
                            }, () => {
                                this.handleChange([...((this.state || [])[`checkedList${type}`] || []), value], type)
                            })
                        }else{
                            config.get('emitter').emit('warning', locale("common_orientation.warning"));
                        }
                    }}
                    style={{width: '80%'}}
                    placeholder={locale("common_orientation.enter")}
                />
                <Button
                    disabled={disabled}
                    style={
                        disabled ?
                            {backgroundColor: '#fff', color: '#1A3452', border: 'none', boxShadow: 'none', opacity: 0.5, width: '10%'}
                            :
                            {backgroundColor: '#fff', color: '#1A3452', border: 'none', boxShadow: 'none', width: '10%'}
                    }
                    onClick={() => {
                        let value = ((this.state || [])[stringTemp] || '').trim();
                        if(value !== '' && !((this.state || [])[stringList] || []).includes(value)){
                            this.setState({
                                [stringList]: [...((this.state || [])[stringList] || []), value],
                                [`adding${type}`]: false,
                                [stringTemp]: ''
                            }, () => {
                                this.handleChange([...((this.state || [])[`checkedList${type}`] || []), value], type)
                            })
                        }else{
                            config.get('emitter').emit('warning', locale("common_orientation.warning1"));
                        }
                    }}
                    icon={<EnterOutlined />}
                />
                <Button
                    style={{color: 'red', width: '10%', border: 'none', boxShadow: 'none'}}
                    onClick={() => this.setState({
                        [stringTemp]: '',
                        [`adding${type}`]: false
                    })}
                    icon={<CloseOutlined />}
                />
            </div>
        )
    }
    render(){
        const {dispatch, orientation: {gettingOrientation, gettingEmployees, orientation, orientationEmployees, allOrientation, allEmployees, changingOrientation} } = this.props;
        return (
            <div className={'orientation'}>
                <Card
                    title={locale("common_orientation.shine_ajil")}
                    bordered={true}
                    style={{marginBottom: 20}}
                >
                    <Input placeholder={locale("common_orientation.haih")}
                           value={this.state.employeeSearch}
                           onChange={(e) => this.searchEmployees(e.target.value)}
                    />
                    {
                        (orientationEmployees || []).length > 0 ?
                            <Table
                                rowKey={(record) => {return record._id}}
                                dataSource={orientationEmployees}
                                columns={[
                                    {
                                        title: '№', key: '№', width: 100,
                                        render: (record) =>
                                            (orientationEmployees || []).indexOf(record)+(this.state.employeePageSize*this.state.employeePageNum)+1
                                    },
                                    {
                                        title: locale("common_orientation.ner"),
                                        render: (record) =>
                                            <Link style={{color: 'rgb(24, 144, 255)'}} to={`/worker/${record.employee?._id}/anket`}>
                                                {(((record.employee || {}).user || {}).first_name || '').slice(0,1).toUpperCase()+
                                                (((record.employee || {}).user || {}).first_name || '').slice(1,(((record.employee || {}).user || {}).first_name || '').length)}
                                            </Link>
                                    },
                                    {title: locale("common_orientation.ovog"), render: (record) => (((record.employee || {}).user || {}).last_name || '').slice(0,1).toUpperCase()+
                                            (((record.employee || {}).user || {}).last_name || '').slice(1,(((record.employee || {}).user || {}).last_name || '').length)},
                                    {
                                        title: locale("common_orientation.RD"), dataIndex: 'employee',
                                        render: (record) => <span key={`${record._id}-span`} style={{textTransform: 'uppercase'}}>{((record.user || {}).register_id || '')}</span>
                                    },
                                    {
                                        title: locale("common_orientation.do"),
                                        render: (record) =>
                                            <Button onClick={() => {
                                                let checked_env = [];
                                                let checked_extra = [];
                                                (record.list_environment || []).map(li => {
                                                    li.done ? checked_env.push(li.title) : null;
                                                });
                                                (record.list_extra || []).map(li => {
                                                    li.done ? checked_extra.push(li.title) : null;
                                                });
                                                this.setState({
                                                    modal: true,
                                                    singleListsEnv: (record.list_environment || []).map(li => li.title),
                                                    singleListsExtra: (record.list_extra || []).map(li => li.title),
                                                    checkedListEnv: checked_env,
                                                    checkedListExtra: checked_extra,
                                                    checkedAllEnv:
                                                        (record.list_environment || ['as']).length === (checked_env || []).length,
                                                    notAllCheckedEnv:
                                                        !!(checked_env || []).length &&
                                                        (record.list_environment || ['as']).length !== (checked_env || []).length,
                                                    checkedAllExtra:
                                                        (record.list_extra || ['as']).length === (checked_extra || []).length,
                                                    notAllCheckedExtra:
                                                        !!(checked_extra || []).length &&
                                                        (record.list_extra || ['as']).length !== (checked_extra || []).length,
                                                    first_name: record.employee?.user?.first_name || '',
                                                    last_name: record.employee?.user?.last_name || '',
                                                    register_id: record.employee?.user?.register_id || '',
                                                    orientationEmployee_id: record._id
                                                })
                                            }}>
                                                {locale("common_orientation.hutulbur_harah")}
                                            </Button>
                                    }
                                ]}
                                loading={gettingEmployees}
                                pagination={{current: this.state.employeePageNum+1, pageSize: this.state.employeePageSize, total: allEmployees}}
                                onChange={(e) => this.setState({employeePageNum: e.current-1}, () => {
                                    this.props.dispatch(getEmployeeOrientation({
                                        search: this.state.employeeSearch,
                                        pageNum: this.state.employeePageNum,
                                        pageSize: this.state.employeePageSize
                                    }))
                                })}
                            />
                            :
                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale("common_orientation.shine_ajil_baihgui")}</span>}/>
                    }
                </Card>

                <Card
                    title={locale("common_orientation.chigluuleh")}
                    bordered={true}
                    extra={
                        <Button
                            type={'primary'}
                            onClick={() => this.setState({visible: true})}
                            icon={<PlusOutlined/>}
                        >
                            {locale("common_orientation.chigluuleh_nemeh")}
                        </Button>
                    }
                >
                    <Input placeholder={locale("common_orientation.chigluuleh_haih")}
                           value={this.state.orientationSearch}
                           onChange={(e) => this.searchOrientation(e.target.value)}
                    />
                    {
                        (orientation || []).length > 0 ?
                            <Table
                                rowKey={(record) => {return record._id}}
                                dataSource={orientation}
                                loading={gettingOrientation}
                                columns={[
                                    {title: '№', key: '№', width: 100,
                                        render: (record) => (orientation || []).indexOf(record)+(this.state.orientationPageSize*this.state.orientationPageNum)+1},
                                    {title:locale("common_orientation.hutulburin_ner") , key: 'title', dataIndex: 'title', ellipsis: true},
                                    {title:locale("common_orientation.uildluud"), key: 'actions', width: 150, render: (record) => (
                                            <React.Fragment>
                                                <Button
                                                    size={'small'}
                                                    key={record._id+'_edit'}
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        this.setState({
                                                            visible: true,
                                                            _id: record._id,
                                                            title: record.title,
                                                            checkedListEnv: record.list_environment,
                                                            checkedListExtra: record.list_extra,
                                                            checkedAllEnv:
                                                                (record.list_environment || ['as']).length === (this.state.listsEnv || []).length,
                                                            notAllCheckedEnv:
                                                                !!(record.list_environment || []).length
                                                                && (record.list_environment|| ['as']).length !== (this.state.listsEnv || []).length,
                                                            checkedAllExtra:
                                                                (record.list_extra || ['as']).length === (this.state.listsExtra || []).length,
                                                            notAllCheckedExtra:
                                                                !!(record.list_extra || []).length
                                                                && (record.list_extra || ['as']).length !== (this.state.listsExtra || []).length
                                                        })
                                                    }}
                                                />
                                                <Popconfirm
                                                    title={locale("common_orientation.hutulbur_ustgah")}
                                                    okText={locale("common_orientation.tiim")}
                                                    cancelText={locale("common_orientation.ugui")}
                                                    onConfirm={() => dispatch(deleteOrientation({
                                                        _id: record._id,
                                                        pageNum: this.state.orientationPageNum,
                                                        pageSize: this.state.orientationPageSize,
                                                        index: (orientation || []).indexOf(record),
                                                        search: this.state.orientationSearch
                                                    }))}
                                                >
                                                    <Button
                                                        style={{marginLeft: 5}}
                                                        size={'small'}
                                                        key={record._id+'_delete'}
                                                        icon={<DeleteOutlined />}
                                                        danger
                                                    />
                                                </Popconfirm>
                                            </React.Fragment>
                                        )}
                                ]}
                                pagination={{current: this.state.orientationPageNum+1, pageSize: this.state.orientationPageSize, total: allOrientation}}
                                onChange={(e) => {
                                    this.setState({orientationPageNum: e.current-1}, () => {
                                        this.props.dispatch(getOrientation({
                                            search: this.state.orientationSearch,
                                            pageNum: this.state.orientationPageNum,
                                            pageSize: this.state.orientationPageSize
                                        }))
                                    });
                                }}
                                expandable={{
                                    expandedRowRender: record => <React.Fragment>
                                        <b>{locale("common_orientation.alban")}</b>
                                        {
                                            (record.role || []).map(role => <Tag key={role._id}>{role.name}</Tag>)
                                        }
                                    </React.Fragment>,
                                    rowExpandable: record => (record.role || []).length > 0,
                                }}
                            />
                            :
                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale("common_orientation.chigluuleh_baihgui")}</span>}/>
                    }
                </Card>
                <Drawer
                    title={this.state._id !== '' ? locale("common_orientation.hutulbur.uurchluh") : locale("common_orientation.chigluuleg_uusgeh")}
                    maskClosable={false}
                    onClose={this.clear.bind(this)}
                    width={720}
                    visible={this.state.visible}
                    key={'drawer-orientation'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button style={{marginRight: 20}} onClick={this.clear}>{locale("common_orientation.bolih")}</Button>
                            <Button
                                type="primary"
                                onClick={this.submitOrientation.bind(this)}
                            >
                                {this.state._id === '' ? locale("common_orientation.uusgeh") : locale("common_orientation.shinechleh")}
                            </Button>
                        </div>
                    }
                >
                    <div className={'orientation-div'} key={'orientation-title'}>
                        <b>{locale("common_orientation.hutulbur_ner")}</b>
                        <Input value={this.state.title} onChange={(e) => this.setState({title: e.target.value})} />
                    </div>
                    <div className={'orientation-div'} key={'orientation-group1'}>
                        <Row>
                            <Col span={12}>
                                <Checkbox
                                    checked={this.state.checkedAllEnv}
                                    indeterminate={this.state.notAllCheckedEnv}
                                    onChange={(e) => this.checkAll('env', e.target.checked || false)}
                                >
                                    <b>{locale("common_orientation.ajil_belen")}</b>
                                </Checkbox>
                            </Col>
                            <Col span={12} className={'orientation-col'}>
                                <Button
                                    size={'small'}
                                    icon={<PlusOutlined />}
                                    type={'primary'}
                                    onClick={() => this.setState({addingEnv: true})}
                                >
                                    {locale("common_orientation.nemeh")}
                                </Button>
                            </Col>
                        </Row>
                        <Checkbox.Group
                            style={{marginLeft: 20}}
                            options={this.state.listsEnv}
                            value={this.state.checkedListEnv}
                            onChange={(e) => this.handleChange(e, 'env')}
                        />
                        {
                            this.state.addingEnv ?
                                this.getInput('Env')
                                :
                                null
                        }
                    </div>

                    <div className={'orientation-div'} key={'orientation-group2'}>
                        <Row>
                            <Col span={12}>
                                <Checkbox
                                    checked={this.state.checkedAllExtra}
                                    indeterminate={this.state.notAllCheckedExtra}
                                    onChange={(e) => this.checkAll('extra', e.target.checked || false)}
                                >
                                    <b>{locale("common_orientation.busad")}</b>
                                </Checkbox>
                            </Col>
                            <Col span={12} className={'orientation-col'}>
                                <Button
                                    size={'small'}
                                    icon={<PlusOutlined />}
                                    type={'primary'}
                                    onClick={() => this.setState({addingExtra: true})}
                                >
                                    {locale("common_orientation.nemeh")}
    
                                </Button>
                            </Col>
                        </Row>
                        <Checkbox.Group
                            style={{marginLeft: 20}}
                            options={this.state.listsExtra}
                            value={this.state.checkedListExtra}
                            onChange={(e) => this.handleChange(e, 'extra')}
                        />
                        {
                            this.state.addingExtra ?
                                this.getInput('Extra')
                                :
                                null
                        }
                    </div>
                </Drawer>
                <Modal
                    visible={this.state.modal}
                    centered
                    width={800}
                    title={locale("common_orientation.chigluuleh")}
                    onCancel={() => {
                        let cc = {
                            listEnv: this.state.checkedListEnv,
                            listExtra: this.state.checkedListExtra,
                            _id: this.state.orientationEmployee_id
                        }
                        this.setState({
                            notAllCheckedEnv: false,
                            checkedAllEnv: false,
                            checkedListEnv: [],
                            notAllCheckedExtra: false,
                            checkedAllExtra: false,
                            checkedListExtra: [],
                            modal: false,
                            singleListsEnv: [],
                            singleListsExtra: [],
                            first_name: '',
                            last_name: '',
                            register_id: '',
                            orientationEmployee_id: ''
                        }, () => {
                            this.props.dispatch(changeEmployeeOrientation(cc));
                        });
                    }}
                    footer={null}
                    className={'jobDescription'}
                >
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div>
                            <b>{locale("common_orientation.ner")}:&nbsp;</b>
                            {(this.state.first_name || '').slice(0,1).toUpperCase()+
                            ((this.state.first_name || '').slice(1,(this.state.first_name || '').length))}
                        </div>
                        <div style={{marginLeft: 10}}>
                            <b>{locale("common_orientation.ovog")}:&nbsp;</b>
                            {(this.state.last_name || '').slice(0,1).toUpperCase()+
                            ((this.state.last_name || '').slice(1,(this.state.last_name || '').length))}
                        </div>
                        <div style={{marginLeft: 10}}>
                            <b>{locale("common_orientation.RD")}:&nbsp;</b>
                            <span style={{textTransform: 'uppercase'}}>{this.state.register_id}</span>
                        </div>
                    </div>
                    <hr style={{height: 1, border: 'none', backgroundColor: 'rgba(0,0,0,0.2)'}}/>
                    <div className={'orientation-div'}>
                        <Checkbox
                            disabled={changingOrientation}
                            checked={this.state.checkedAllEnv}
                            indeterminate={this.state.notAllCheckedEnv}
                            onChange={(e) => this.checkAll('env', e.target.checked || false, true)}
                        >
                            <b>{locale("common_orientation.belen")}</b>
                        </Checkbox>
                        <Checkbox.Group
                            disabled={changingOrientation}
                            style={{marginLeft: 20}}
                            options={this.state.singleListsEnv}
                            value={this.state.checkedListEnv}
                            onChange={(e) => this.handleChange(e, 'env', true)}
                        />
                        <Checkbox
                            disabled={changingOrientation}
                            checked={this.state.checkedAllExtra}
                            indeterminate={this.state.notAllCheckedExtra}
                            onChange={(e) => this.checkAll('extra', e.target.checked || false, true)}
                        >
                            <b>{locale("common_orientation.busad")}</b>
                        </Checkbox>
                        <Checkbox.Group
                            disabled={changingOrientation}
                            style={{marginLeft: 20}}
                            options={this.state.singleListsExtra}
                            value={this.state.checkedListExtra}
                            onChange={(e) => this.handleChange(e, 'extra', true)}
                        />
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <Button
                            type={'primary'}
                            onClick={() => this.props.dispatch(finishEmployeeOrientation({_id: this.state.orientationEmployee_id})).then(c => {
                                if(c.json?.success){
                                    this.clear()
                                }
                            })}
                        >
                            {locale("common_orientation.duusgah")}
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default connect(reducer)(Orientation)