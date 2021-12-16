import React from 'react'
import {connect} from "react-redux";
import {locale} from '../../lang';
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
    Table,
    Tag, Tooltip,
    Typography
} from 'antd'
import config, {printStaticRole} from "../../config";
import {
    getJobDescriptions,
    createJobDescriptions,
    deleteJobDescriptions
} from "../../actions/jobDescription_actions";
import moment from 'moment'
import {CheckCircleFilled, CloseCircleFilled, PlusOutlined, EnterOutlined, MinusOutlined, CloseOutlined, QuestionOutlined, EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {hasAction} from "../../config";
const {Text, Title} =  Typography
const {Panel} = Collapse

const reducer = ({main, jobDescription}) => ({main, jobDescription})

class jobDescription extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            _id: '',
            title: '',
            description: '',
            duties: [],
            duties_sub: [],
            duties_sub_temp: '',
            duties_title: '',
            duties_sub_rep: '',
            editingRep: '',
            units: {
                inner: [],
                outer: []
            },
            units_temp: {
                inner: '',
                outer: ''
            },
            management: {
                direct: [],
                indirect: [],
                substitute: [],
                manage: []
            },
            qualification: {
                behavior: [],
                soft_skills: [],
                hard_skills: [],
                language: [],
                computer_knowledge: []
            },
            units_inner_temp: '',
            units_outer_temp: '',
            management_direct_temp: '',
            management_indirect_temp: '',
            management_substitute_temp: '',
            management_manage_temp: '',
            qualification_behavior_temp: '',
            qualification_soft_skills_temp: '',
            qualification_hard_skills_temp: '',
            qualification_language_temp: '',
            qualification_computer_knowledge_temp: '',
            editing: '',
            editingValue: '',
            adding: false,
            editingArray: '',
            modal: false
        }
        this.clear = this.clear.bind(this);

    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        if(!hasAction([], employee)){
            this.props.history.replace('/not-found');
        }else{
            this.props.dispatch(getJobDescriptions());
        }
    }
    clear(){
        this.setState({
            visible: false,
            _id: '',
            title: '',
            description: '',
            duties: [],
            duties_sub: [],
            duties_sub_temp: '',
            duties_sub_rep: '',
            duties_title: '',
            units: {
                inner: [],
                outer: []
            },
            management: {
                direct: [],
                indirect: [],
                substitute: [],
                manage: []
            },
            qualification: {
                behavior: [],
                soft_skills: [],
                hard_skills: [],
                language: [],
                computer_knowledge: []
            },
            units_temp: {
                inner: '',
                outer: ''
            },
            management_direct_temp: '',
            management_indirect_temp: '',
            management_substitute_temp: '',
            management_manage_temp: '',
            qualification_behavior_temp: '',
            qualification_soft_skills_temp: '',
            qualification_hard_skills_temp: '',
            qualification_language_temp: '',
            qualification_computer_knowledge_temp: '',
            editing: '',
            editingValue: '',
            editingRep: '',
            adding: false,
            editingArray: '',
            modal: false,
            units_inner_temp: '',
            units_outer_temp: '',
        })
    }
    submitJobDescription(){
        if(!this.state.title || this.state.title === ''){
            config.get('emitter').emit('warning',  locale('common_jobdescription.alban_tushaal_ner_shaardlagatai') );
        }
        // else if(!this.state.description || this.state.description === ''){
        //     config.get('emitter').emit('warning', 'Ажлын байрны зорилго байх шаардлагатай.');
        // }else if(
        //     !this.state.duties ||
        //     (this.state.duties || []).length === 0 ||
        //     (this.state.duties || []).some(duty =>
        //         !duty.title ||
        //         duty.title === '' ||
        //         (duty.list || []).some(li =>
        //             !li.title ||
        //             li.title === '' ||
        //             li.repetition === ''
        //         )
        //     )
        // ){
        //     config.get('emitter').emit('warning', 'Ажлын байрны үндсэн чиг үүргүүд байх шаардлагатай.');
        // }else if(!this.state.qualification || (Object.values(this.state.qualification || {}) || []).every(qual => (qual || []).length === 0)){
        //     config.get('emitter').emit('warning', 'Ажлын байранд шаардагдах мэдлэг, ур чадвар байх шаардлагатай.');
        // }
        else{
            this.props.dispatch(createJobDescriptions({
                title: this.state.title,
                management: this.state.management,
                description: this.state.description,
                duties: this.state.duties,
                units: this.state.units,
                qualification: this.state.qualification,
                _id: this.state._id
            })).then(c => {
                if((c.json || {}).success){
                    this.clear();
                }
            });
        }
    }
    changeObjectItem(parent, child, action, id){
        let initial = ((this.state || {})[`${parent}`] || {})[`${child}`] || [];
        let string = `${parent}_${child}_temp`;
        if(action === 'delete'){
            initial = initial.filter(ini => (ini._id || '').toString() !== (id || 'sd').toString())
            this.setState({
                [parent]: {
                    ...((this.state || [])[parent] || []),
                    [child]: initial
                },
            });
        }else if(action === 'edit'){
            initial = (initial || []).map(ini => {
                if((ini._id || '').toString() !== (id || 'sd').toString()){
                    return ini;
                }
                return {
                    ...ini,
                    title: this.state.editingValue || ''
                }
            })
            this.setState({
                [parent]: {
                    ...((this.state || [])[parent] || []),
                    [child]: initial,
                },
                editing: '',
                editingValue: ''
            });
        }else{
            this.setState({
                [parent]: {
                    ...((this.state || [])[parent] || []),
                    [child]: [...initial, {_id: id, title: (this.state || [])[string]}]
                },
                [string]: ''
            })
        }
    }
    changeArrayItem(parent, child, action, _id){
        let string = `${parent}_${child}`;
        let sub_initial = ((this.state || [])[string] || [])
        if(action === 'insert'){
            this.setState({
                [string]: [
                    ...sub_initial,
                    {
                        title: (this.state || [])[string + '_temp'] || '',
                        repetition: (this.state || [])[string + '_rep'] || '',
                        _id: _id
                    }
                ],
                [string + '_temp']: '',
                [string + '_rep']: ''
            })
        }else if(action === 'delete'){
            sub_initial = ((this.state || [])[string] || []).filter((ini) => (ini._id || 'as').toString() !== (_id || '').toString());
            this.setState({
                [string]: sub_initial
            })
        }else{
            sub_initial = ((this.state || [])[string] || []).map((ini) => {
                if((ini._id || 'as').toString() !== (_id || '').toString()){
                    return ini;
                }
                return {
                    ...ini,
                    title: this.state.editingValue || '',
                    repetition: this.state.editingRep || '',
                }
            });
            this.setState({
                [string]: sub_initial,
                editing: '',
                editingValue: '',
                editingRep: ''
            })
        }
    }
    changeArray(parent, child, childKey, type){
        let string = `${parent}_${child}`;
        let title = `${parent}_title`;
        if(type === 'insert'){
            if(this.state[title] && this.state[title] !== '' && ((this.state || [])[string] || []).length > 0){
                let par = [...((this.state || [])[parent] || []), {
                    title: this.state[title] || '',
                    _id: childKey,
                    list: ((this.state || [])[string] || [])
                }];
                this.setState({
                    [parent]: par,
                    [title]: '',
                    editing: '',
                    editingValue: '',
                    editingRep: '',
                    adding: false,
                    [string]: [],
                    [string + '_temp']: '',
                    [string + '_rep']: '',
                    editingArray: ''
                })
            }
        }else if(type === 'edit'){
            if(this.state[title] && this.state[title] !== '' && ((this.state || [])[string] || []).length > 0){
                let par = ((this.state || [])[parent] || []).map(par => {
                    if((par._id || 'as').toString() !== (childKey || '').toString()){
                        return par;
                    }
                    return {
                        ...par,
                        title: this.state[title],
                        list: ((this.state || [])[string] || [])
                    }
                })
                this.setState({
                    [parent]: par,
                    [title]: '',
                    editing: '',
                    editingValue: '',
                    editingRep: '',
                    adding: false,
                    [string]: [],
                    [string + '_temp']: '',
                    [string + '_rep']: '',
                    editingArray: ''
                })
            }
        }else{
            let deleted = ((this.state || [])[parent] || []).filter(ele => (ele._id || 'as').toString() !== (childKey || '').toString());
            this.setState({
                [parent]: deleted
            })
        }
    }
    getProperName(e){
        switch (e) {
            case 'inner': return locale('common_jobdescription.dotood_negj');
            case 'outer': return locale('common_jobdescription.gadaad_negj');
            case 'direct': return locale('common_jobdescription.shuud_alban_tushaal');
            case 'indirect': return locale('common_jobdescription.shuud_bus_alban_tushaal');
            case 'substitute': return locale('common_jobdescription.Orlon_alba_tushaal');
            case 'manage': return locale('common_jobdescription.shuud_u_alban_tushaal');
            case 'behavior': return locale('common_jobdescription.zan_tuluv');
            case 'soft_skills': return locale('common_jobdescription.soft_skill');
            case 'hard_skills': return locale('common_jobdescription.hard_skill');
            case 'language': return locale('common_jobdescription.langs');
            case 'computer_knowledge': return locale('common_jobdescription.computer_skill');
            default: return locale('common_jobdescription.garchig');
        }
    }
    getRepetition(e){
        switch (e[0]) {
            case 'u': return 'Ө';
            case 's': return 'С';
            case 't': return 'Т';
            default: return 'Ө';
        }
    }
    getListItem(parent, child, item, type){
        return (
            <li
                key={`${parent}-${child}-${item._id}`}
                onDoubleClick={() => this.setState({editing: item._id, editingValue: item.title, editingRep: item.repetition})}
            >
                {
                    (this.state.editing || '') !== (item._id || 'as') ?
                        <Popover
                            title={this.getProperName(child)}
                            content={item.title}
                        >
                            {
                                type === 'object' ?
                                    <div key={`${item._id}-div`} className={'li-div'}>
                                        <div style={{width: '90%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}} key={`${item._id}-title`}>
                                            {item.title}
                                        </div>
                                        <div className={'close-div'}>
                                            <CloseCircleFilled style={{color: 'red', fontSize: 16}}
                                               onClick={() => type === 'object' ?
                                                   this.changeObjectItem(parent, child, 'delete', item._id)
                                                   :
                                                   this.changeArrayItem(parent, child, 'delete', item._id)
                                               }/>
                                        </div>
                                    </div>
                                    :
                                    <div key={`${item._id}-div`} className={'li-div'}>
                                        <div style={{width: '80%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}} key={`${item._id}-title`}>
                                            {item.title}
                                        </div>
                                        <div style={{width: '10%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', wordBreak: 'break-all'}} key={`${item._id}-rep`}>
                                            {this.getRepetition(item.repetition)}
                                        </div>
                                        <div className={'close-div'}>
                                            <CloseCircleFilled style={{color: 'red', fontSize: 16}}
                                               onClick={() => type === 'object' ?
                                                   this.changeObjectItem(parent, child, 'delete', item._id)
                                                   :
                                                   this.changeArrayItem(parent, child, 'delete', item._id)
                                               }/>
                                        </div>
                                    </div>
                            }
                        </Popover>
                        :
                        <div key={`${parent}-${child}-${item._id}-div`} style={{display: 'flex', flexDirection: 'row'}}>
                            <Input.TextArea
                                rows={2}
                                key={`${parent}-${child}-${item._id}-input`}
                                value={this.state.editingValue}
                                onChange={(e) => this.setState({editingValue: e.target.value })}
                            />
                            <div key={`${parent}-${child}-${item._id}-div-sel`} style={{height: 30}}>
                                {
                                    type === 'array' ?
                                        <Select value={this.state[`editingRep`]} style={{width: 120}} onSelect={(e) => this.setState({editingRep: e})}>
                                            <Select.Option value={'udur'}>{locale('common_jobdescription.udur')}</Select.Option>
                                            <Select.Option value={'sar'}>{locale('common_jobdescription.sar')}</Select.Option>
                                            <Select.Option value={'tuhai'}>{locale('common_jobdescription.tuhai')}</Select.Option>
                                        </Select>
                                        :
                                        null
                                }
                            </div>
                            <Space
                                direction={'vertical'}
                            >
                                <Button
                                    size={'small'}
                                    key={`${parent}-${child}-${item._id}-button-edit`}
                                    style={{backgroundColor: '#fff', color: '#1A3452', border: 'none', boxShadow: 'none'}}
                                    onClick={() => {
                                        if(this.state.editingValue !== ''){
                                            type === 'object' ?
                                                this.changeObjectItem(parent, child, 'edit', item._id)
                                                :
                                                this.changeArrayItem(parent, child, 'edit', item._id)
                                        }
                                    }}
                                    icon={<EnterOutlined />}
                                />
                                <Button
                                    size={'small'} danger
                                    style={{border: 'none', boxShadow: 'none'}}
                                    key={`${parent}-${child}-${item._id}-button-cancel`}
                                    icon={<CloseOutlined />}
                                    onClick={() => this.setState({editing: '', editingValue: '', editingRep: ''})}
                                />
                            </Space>
                        </div>
                }
            </li>
        )
    }
    generateKey(parent, child){
        return `${parent}-${child}-${Math.random()}`;
    }
    transformArray(data, parent, child, type){
        if(type === 'outer'){
            return ((data || [])[parent] || []).map(temp => {
                return {
                    title: temp,
                    _id: this.generateKey(parent, child)
                }
            })
        }else{
            return (((data || [])[parent] || [])[child] || []).map(temp => {
                return {
                    title: temp,
                    _id: this.generateKey(parent, child)
                }
            })
        }
    }
    getInput(parent, child, type){
        let string = `${parent}_${child}_temp`;
        let value = (this.state || [])[string];
        let disabled = type === 'object' ? ((this.state || [])[string] === '') : ((this.state || [])[string] === '') && (this.state || [])[`${parent}_${child}_rep`] === '';
        return (
            <React.Fragment>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                    <Input.TextArea
                        style={{width: '80%', marginBottom: 10}}
                        placeholder={locale('common_jobdescription.darj_oruulakh')}
                        rows={1}
                        key={`${parent}-${child}-input`}
                        id={`${parent}-${child}-input`}
                        value={(this.state || [])[string]}
                        onChange={(e) => this.setState({[string]: e.target.value})}
                        onPressEnter={(e) => {
                            e.preventDefault();
                            let _id = this.generateKey(parent, child);
                            if((value || '').trim() && (value || 'as').trim() !== ''){
                                if(type === 'object'){
                                    this.changeObjectItem(parent, child, 'insert', _id);
                                }else{
                                    if((this.state || [])[`${parent}_${child}_rep`] && (this.state || [])[`${parent}_${child}_rep`] !== ''){
                                        this.changeArrayItem(parent, child, 'insert', _id);
                                    }
                                }
                            }
                        }}
                    />
                    <div style={{height: 30, marginRight: 10}}>
                        {
                            type === 'array' ?
                                <Select value={this.state[`${parent}_${child}_rep`]} style={{width: '150px', marginLeft: 10}} onChange={(e) => this.setState({[`${parent}_${child}_rep`]: e})}>
                               
                                    <Select.Option value={'udur'}>{locale('common_jobdescription.udur')}</Select.Option>
                                    <Select.Option value={'sar'}>{locale('common_jobdescription.sar')}</Select.Option>
                                    <Select.Option value={'tuhai'}>{locale('common_jobdescription.tuhai')}</Select.Option>
                                </Select>
                                :
                                null
                        }
                    </div>
                    <Button
                        disabled={disabled}
                        style={disabled ? {backgroundColor: '#fff', color: '#1A3452', border: 'none', boxShadow: 'none', opacity: 0.5} : {backgroundColor: '#fff', color: '#1A3452', border: 'none', boxShadow: 'none'}}
                        onClick={() => {
                            let _id = this.generateKey(parent, child);
                            if((value || '').trim() && (value || 'as').trim() !== ''){
                                if(type === 'object'){
                                    this.changeObjectItem(parent, child, 'insert', _id);
                                }else{
                                    if((this.state || [])[`${parent}_${child}_rep`] && (this.state || [])[`${parent}_${child}_rep`] !== ''){
                                        this.changeArrayItem(parent, child, 'insert', _id);
                                    }
                                }
                            }
                        }}
                        icon={<EnterOutlined />}
                    />
                </div>
            </React.Fragment>
        )
    }
    render(){
        const {dispatch, jobDescription: { gettingJobDescriptions, jobDescriptions } } = this.props;
        return (
            <React.Fragment>
                <Card
                    title={locale('common_jobdescription.ajil_bair_tod')}
                    bordered={true}
                    loading={gettingJobDescriptions}
                    extra={
                        <Button
                            type={'primary'}
                            onClick={() => this.setState({visible: true})}
                            icon={<PlusOutlined />}
                        >
                            {locale('common_jobdescription.ajil_bair_nemeh')}
                        </Button>
                    }
                >
                    {
                        (jobDescriptions || []).length > 0 ?
                            <Table
                                pagination={false}
                                rowKey={(record) => {return record._id}}
                                dataSource={jobDescriptions}
                                columns={[
                                    {
                                        title: '№',
                                        key: '№',
                                        width: 120,
                                        render: (record) => (jobDescriptions || []).indexOf(record)+1
                                    },
                                    {
                                        title: locale('common_jobdescription.ner'),
                                        key: 'title',
                                        ellipsis: true,
                                        render: (record) =>
                                            <a style={{color: '#1890ff'}} onClick={() => {
                                                let units = {
                                                    inner: this.transformArray(record, 'units', 'inner', 'inner'),
                                                    outer: this.transformArray(record, 'units', 'outer', 'inner'),
                                                };
                                                let management = {
                                                    direct: this.transformArray(record, 'direct', '', 'outer'),
                                                    indirect: this.transformArray(record, 'indirect', '', 'outer'),
                                                    substitute: this.transformArray(record, 'substitute', '', 'outer'),
                                                    manage: this.transformArray(record, 'manage', '', 'outer'),
                                                };
                                                let qualification = {
                                                    behavior: this.transformArray(record, 'qualification', 'behavior', 'inner'),
                                                    soft_skills: this.transformArray(record, 'qualification', 'soft_skills', 'inner'),
                                                    hard_skills: this.transformArray(record, 'qualification', 'hard_skills', 'inner'),
                                                    language: this.transformArray(record, 'qualification', 'language', 'inner'),
                                                    computer_knowledge: this.transformArray(record, 'qualification', 'computer_knowledge', 'inner')
                                                }
                                                this.setState({
                                                    modal: true,
                                                    visible: false,
                                                    title: record.title,
                                                    description: record.description,
                                                    duties: record.duties,
                                                    units: units,
                                                    management: management,
                                                    qualification: qualification,
                                                    _id: record._id
                                                })
                                            }}>{record.title}</a>
                                    },
                                    {
                                        title: locale('common_jobdescription.uildluud'),
                                        key: 'actions',
                                        width: 120,
                                        render: (record) =>
                                            <React.Fragment>
                                                <Button
                                                    key={record._id + 'edit'}
                                                    icon={<EditOutlined />}
                                                    onClick={() => {
                                                        let units = {
                                                            inner: this.transformArray(record, 'units', 'inner', 'inner'),
                                                            outer: this.transformArray(record, 'units', 'outer', 'inner'),
                                                        };
                                                        let management = {
                                                            direct: this.transformArray(record, 'direct', '', 'outer'),
                                                            indirect: this.transformArray(record, 'indirect', '', 'outer'),
                                                            substitute: this.transformArray(record, 'substitute', '', 'outer'),
                                                            manage: this.transformArray(record, 'manage', '', 'outer'),
                                                        };
                                                        let qualification = {
                                                            behavior: this.transformArray(record, 'qualification', 'behavior', 'inner'),
                                                            soft_skills: this.transformArray(record, 'qualification', 'soft_skills', 'inner'),
                                                            hard_skills: this.transformArray(record, 'qualification', 'hard_skills', 'inner'),
                                                            language: this.transformArray(record, 'qualification', 'language', 'inner'),
                                                            computer_knowledge: this.transformArray(record, 'qualification', 'computer_knowledge', 'inner')
                                                        }
                                                        this.setState({
                                                            visible: true,
                                                            title: record.title,
                                                            description: record.description,
                                                            duties: record.duties,
                                                            units: units,
                                                            management: management,
                                                            qualification: qualification,
                                                            _id: record._id
                                                        })
                                                    }}
                                                />
                                                <Popconfirm
                                                    title={ locale('common_jobdescription.ajil_biar_delete')}
                                                    okText={ locale('common_jobdescription.yes')} cancelText={ locale('common_jobdescription.no')}
                                                    onConfirm={() => dispatch(deleteJobDescriptions({_id: record._id}))}
                                                >
                                                    <Button
                                                        danger
                                                        key={record._id + 'delete'}
                                                        icon={<DeleteOutlined />}
                                                    />
                                                </Popconfirm>
                                            </React.Fragment>
                                    }
                                ]}
                                expandable={{
                                    expandedRowRender: record => <React.Fragment>
                                        <b>{ locale('common_jobdescription.ashiglasan_alban_tushaal')}: </b>
                                        {
                                            (record.role || []).map(role => <Tag key={role._id}>{role.name}</Tag>)
                                        }
                                    </React.Fragment>,
                                    rowExpandable: record => (record.role || []).length > 0,
                                }}
                            />
                            :
                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_jobdescription.ajil_bair_baihgui')}</span>} />
                    }
                </Card>
                <Drawer
                    title={this.state._id !== '' ? locale('common_jobdescription.ajil_bair_uurchluh') : locale('common_jobdescription.ajil_bair_uusgeh') }
                    maskClosable={false}
                    onClose={this.clear.bind(this)}
                    width={1000}
                    className={'jobDescription'}
                    visible={this.state.visible}
                    key={'drawer-jobDescription'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button style={{marginRight: 20}} onClick={this.clear}>{ locale('common_jobdescription.bolikh')}</Button>
                            <Button
                                type="primary"
                                onClick={this.submitJobDescription.bind(this)}
                            >
                                {this.state._id === '' ? locale('common_jobdescription.uusgeh') : locale('common_jobdescription.shinechleh')}
                            </Button>
                        </div>
                    }
                >
                    <div key={'job-title-div'} className={'job-description-div'}>
                        <Input
                            value={this.state.title}
                            bordered={false}
                            style={{textAlign: 'center', fontSize: 18}}
                            placeholder={locale('common_jobdescription.alban_tushaal_ner')}
                            onChange={(e) => this.setState({...this.state, title: e.target.value})}
                        />
                    </div>
                    <div key={'job-management-div'} className={'job-description-div'}>
                        {/*{*/}
                        {/*    (Object.keys(this.state.management || {}) || []).map(mana =>*/}
                        {/*        <Row key={`${mana}_div`} className={'qualification-row'}>*/}
                        {/*            <Col span={12}*/}
                        {/*                 style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid black', fontWeight: 500, fontSize: 15}}*/}
                        {/*            >*/}
                        {/*                {this.getProperName(mana)}*/}
                        {/*            </Col>*/}
                        {/*            <Col span={12}>*/}
                        {/*                {*/}
                        {/*                    ((this.state.management || {})[mana] || []).length > 0 ?*/}
                        {/*                        <React.Fragment>*/}
                        {/*                            <ul>*/}
                        {/*                                {((this.state.management || {})[mana] || []).map(manage =>*/}
                        {/*                                    this.getListItem('management', mana, manage, 'object')*/}
                        {/*                                )}*/}
                        {/*                            </ul>*/}
                        {/*                        </React.Fragment>*/}
                        {/*                        :*/}
                        {/*                        <div className={'grayed-out'}>*/}
                        {/*                            Хоосон байна*/}
                        {/*                        </div>*/}
                        {/*                }*/}
                        {/*                {this.getInput('management', mana, 'object')}*/}
                        {/*            </Col>*/}
                        {/*        </Row>*/}
                        {/*    )*/}
                        {/*}*/}
                        <span key={'job-description-span'} className={'job-description-span'}>{locale('common_jobdescription.alban_tushaal')}</span>
                        <div className={'job-inner-div'}>
                            {
                                (Object.keys(this.state.management || {}) || []).map((mana, ind) =>
                                    <React.Fragment key={`job-management-${mana}-fragment`}>
                                        <div key={`job-management-${mana}-div`}>
                                            {this.getProperName(mana)}
                                        </div>
                                        <Row key={`job-management-${mana}-row`}>
                                            <Col span={12} key={`job-management-${mana}-col-1`}>
                                                {
                                                    ((this.state.management || {})[mana] || []).length > 0 ?
                                                        <ul>
                                                            {((this.state.management || {})[mana] || []).map(manage =>
                                                                this.getListItem('management', mana, manage, 'object')
                                                            )}
                                                        </ul>
                                                        :
                                                        <div className={'grayed-out'}>
                                                            {locale('common_jobdescription.khooson')}
                                                        </div>
                                                }
                                            </Col>
                                            <Col span={12} key={`job-management-${mana}-col-2`}>
                                                {this.getInput('management', mana, 'object')}
                                            </Col>
                                        </Row>
                                        <hr className={'job-hr'}/>
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </div>
                    <div key={'job-description-div'} className={'job-description-div'}>
                        <span key={'job-description-span'} className={'job-description-span'}> {locale('common_jobdescription.ajil_bair_zorilgo')}</span>
                        <Input.TextArea
                            value={this.state.description}
                            onChange={(e) => this.setState({...this.state, description: e.target.value})}
                        />
                    </div>
                    <div key={'job-duties-div'} className={'job-description-div'}>
                        <div>
                            <span key={'job-duties-span'} className={'job-description-span'}>{locale('common_jobdescription.ajil_undsen_uureg')}</span>
                            &nbsp;
                            <Popover
                                title={ locale('common_jobdescription.tailbar')}
                                content={
                                    <React.Fragment>
                                        <div key={Math.random()}>{locale('common_jobdescription.u_udur')}</div>
                                        <div key={Math.random()}>{locale('common_jobdescription.s_sar')}</div>
                                        <div key={Math.random()}>{locale('common_jobdescription.t_tuhai')}</div>
                                    </React.Fragment>
                                }
                            >
                                <QuestionOutlined />
                            </Popover>
                        </div>
                        <Table
                            rowKey={(record) => {return record._id}}
                            pagination={false}
                            locale={{emptyText: locale('common_jobdescription.khooson')}}
                            size='small'
                            dataSource={this.state.duties}
                            columns={[
                                {title: '№', key: '№', render: (record) => (this.state.duties || []).indexOf(record)+1, width: 70},
                                {
                                    title: locale('common_jobdescription.Undsen_chig_uurguud'),
                                    children: [
                                        {
                                            title: locale('common_jobdescription.khiih_ajil'),
                                            dataIndex: 'title',
                                            key: 'title',
                                        },
                                        {
                                            title: locale('common_jobdescription.khiigdeh_ajil'),
                                            key: 'list',
                                            render: (record) => <ol key={record._id} style={{marginBottom: 0}}>
                                                {(record.list || []).map((lis) =>
                                                    <li key={lis._id}>
                                                        <Tooltip placement="bottom" title={lis.title}>
                                                            {lis.title}
                                                        </Tooltip>
                                                    </li>
                                                )}
                                            </ol>,
                                            ellipsis: {
                                                showTitle: true,
                                            }
                                        },
                                        {
                                            title: locale('common_jobdescription.davtamj'),
                                            key: 'list_repetition',
                                            render: (record) => <ol key={record._id+'_repetition'} style={{listStyle: 'none', padding: 'none', marginBottom: 0}}>
                                                {(record.list || []).map((lis) => <li key={lis._id}>{this.getRepetition(lis.repetition)}</li>)}
                                            </ol>,
                                            width: 110
                                        },
                                    ],
                                    key: 'duties',
                                },
                                {
                                    title: locale('common_jobdescription.uildel'),
                                    key: 'actions',
                                    width: 65,
                                    render: (record) => <div key={`${record._id}_action_div`}>
                                        <Button
                                            icon={<EditOutlined />} size={'small'}
                                            onClick={() => this.setState({
                                                adding: true,
                                                duties_title: record.title,
                                                duties_sub: record.list,
                                                editingArray: record._id
                                            })}
                                        />
                                        <Popconfirm
                                            title={locale('common_jobdescription.delete')}
                                            okText={locale('common_jobdescription.yes')} cancelText={locale('common_jobdescription.no')}
                                            onConfirm={() => this.changeArray('duties', '', record._id, 'delete')}
                                        >
                                            <Button danger icon={<DeleteOutlined />} size={'small'}/>
                                        </Popconfirm>
                                    </div>
                                }
                            ]}
                            footer={ () =>
                                this.state.adding ?
                                    <React.Fragment>
                                        <Row>
                                            <Col span={10}>
                                                <span>{locale('common_jobdescription.khiih_ajil')}</span>
                                                <Input.TextArea
                                                    defaultValue={this.state.duties_title}
                                                    values={this.state.duties_title}
                                                    onChange={(e) => this.setState({...this.state, duties_title: e.target.value})}
                                                />
                                            </Col>
                                            <Col span={14}>
                                                <span>{locale('common_jobdescription.khiigdeh_ajil')}</span>
                                                {
                                                    (this.state.duties_sub || []).length > 0 ?
                                                        <ol>
                                                            {(this.state.duties_sub || []).map(duty =>
                                                                this.getListItem('duties', 'sub', duty, 'array')
                                                            )}
                                                        </ol>
                                                        :
                                                        <div className={'grayed-out'}>
                                                            {locale('common_jobdescription.khooson')}
                                                        </div>
                                                }
                                            </Col>
                                        </Row>
                                        <div
                                            style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}
                                        >
                                            <div style={{width: '80%', marginTop: 10, marginRight: 20}}>
                                                {this.getInput('duties', 'sub', 'array')}
                                            </div>
                                            <Button
                                                size={'small'}
                                                onClick={() => this.setState({
                                                    editing: '',
                                                    editingValue: '',
                                                    duties_sub: [],
                                                    duties_sub_temp: '',
                                                    adding: false,
                                                    editingArray: ''
                                                })}
                                            >
                                                {locale('common_jobdescription.bolikh')}
                                            </Button>
                                            <Button
                                                disabled={(this.state.duties_sub || []).length === 0}
                                                style={{marginLeft: 10}}
                                                size={'small'}
                                                type={'primary'}
                                                onClick={() => {
                                                    if(this.state.editingArray !== ''){
                                                        this.changeArray('duties', 'sub', this.state.editingArray, 'edit')
                                                    }else{
                                                        let childKey = `duties-array-${Math.random()}`;
                                                        this.changeArray('duties', 'sub', childKey, 'insert')
                                                    }
                                                }}
                                            >
                                                {locale('common_jobdescription.khadgalakh')}
                                            </Button>
                                        </div>
                                    </React.Fragment>
                                    :
                                    <div style={{textAlign: 'right'}}>
                                        <Button
                                            type={'primary'}
                                            size={'small'}
                                            onClick={() => {
                                                this.setState({adding: true});
                                            }}
                                            icon={<PlusOutlined />}
                                        >
                                            {locale('common_jobdescription.nemeh_btn')}
                                        </Button>
                                    </div>
                            }
                        />
                    </div>
                    <div key={'job-unit-div'} className={'job-description-div'}>
                        <span key={'job-unit-span'} className={'job-description-span'}>{locale('common_jobdescription.khamtarch_ajillah')}</span>
                        <div className={'job-inner-div'}>
                            {
                                (Object.keys(this.state.units || {}) || []).map((unit, ind) =>
                                    <React.Fragment key={`job-units-${unit}-fragment`}>
                                        <div key={`job-units-${unit}-div`}>
                                            {this.getProperName(unit)}
                                        </div>
                                        <Row key={`job-units-${unit}-row`}>
                                            <Col span={12} key={`job-units-${unit}-col-1`}>
                                                {
                                                    ((this.state.units || {})[unit] || []).length > 0 ?
                                                        <ul>
                                                            {((this.state.units || {})[unit] || []).map(uni =>
                                                                this.getListItem('units', unit, uni, 'object')
                                                            )}
                                                        </ul>
                                                        :
                                                        <div className={'grayed-out'}>
                                                            {locale('common_jobdescription.khooson')}
                                                        </div>
                                                }
                                            </Col>
                                            <Col span={12} key={`job-units-${unit}-col-2`}>
                                                {this.getInput('units', unit, 'object')}
                                            </Col>
                                        </Row>
                                        <hr className={'job-hr'}/>
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </div>
                    <div key={'job-qualification-div'} className={'job-description-div'}>
                        <span key={'job-qualification-span'} className={'job-description-span'}>{locale('common_jobdescription.medleg_chadvar')}</span>
                        <div className={'job-inner-div'}>
                            {
                                (Object.keys(this.state.qualification || {}) || []).map((qual, ind) =>
                                    <React.Fragment key={`job-qualification-${qual}-fragment`}>
                                        <div key={`job-qualification-${qual}-div`}>
                                            {this.getProperName(qual)}
                                        </div>
                                        <Row key={`job-qualification-${qual}-row`}>
                                            <Col span={12} key={`job-qualification-${qual}-col-1`}>
                                                {
                                                    ((this.state.qualification || {})[qual] || []).length > 0 ?
                                                        <ul>
                                                            {((this.state.qualification || {})[qual] || []).map(quali =>
                                                                this.getListItem('qualification', qual, quali, 'object')
                                                            )}
                                                        </ul>
                                                        :
                                                        <div className={'grayed-out'}>
                                                            {locale('common_jobdescription.khooson')}
                                                        </div>
                                                }
                                            </Col>
                                            <Col span={12} key={`job-qualification-${qual}-col-2`}>
                                                {this.getInput('qualification', qual, 'object')}
                                            </Col>
                                        </Row>
                                        <hr className={'job-hr'}/>
                                    </React.Fragment>
                                )
                            }
                        </div>
                    </div>
                </Drawer>
                <Modal
                    visible={this.state.modal}
                    centered
                    width={800}
                    title={locale('common_jobdescription.ajil_bair_tod')}
                    onCancel={this.clear}
                    footer={null}
                    className={'jobDescription'}
                >
                    <div style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 10}}>
                        {this.state.title}
                    </div>
                    <div style={{marginBottom: 10}}>
                        <b>{locale('common_jobdescription.ajil_bair_zorilgo')}:&nbsp;</b>
                        <span>{this.state.description}</span>
                    </div>
                    <div style={{marginBottom: 10}}>
                        <b>{locale('common_jobdescription.ajil_chig_uurguud')}:&nbsp;</b>
                        <Table
                            rowKey={(record) => {return record._id}}
                            dataSource={this.state.duties}
                            pagination={false}
                            columns={[
                                {
                                    title: '№',
                                    key: '№',
                                    width: 120,
                                    render: (record) => (this.state.duties || []).indexOf(record)+1
                                },
                                {
                                    title: locale('common_jobdescription.ner'),
                                    key: 'title',
                                    children: [
                                        {
                                            title: locale('common_jobdescription.khiih_ajil'),
                                            key: 'hiih ajil',
                                            dataIndex: 'title'
                                        },
                                        {
                                            title:  locale('common_jobdescription.khiigdeh_ajil'),
                                            key: 'hiigdeh ajil',
                                            render: (record) => <ol key={record._id} style={{marginBottom: 0}}>
                                                {(record.list || []).map((lis) =>
                                                    <li key={lis._id}>
                                                        <Tooltip placement="bottom" title={lis.title}>
                                                            {lis.title}
                                                        </Tooltip>
                                                    </li>
                                                )}
                                            </ol>,
                                            ellipsis: {
                                                showTitle: true,
                                            }
                                        },
                                        {
                                            title: locale('common_jobdescription.davtamj'),
                                            key: 'repetition',
                                            render: (record) => <ol key={record._id+'_repetition'} style={{listStyle: 'none', padding: 'none', marginBottom: 0}}>
                                                {(record.list || []).map((lis) => <li key={lis._id}>{this.getRepetition(lis.repetition)}</li>)}
                                            </ol>,
                                            width: 110
                                        },
                                    ]
                                },
                            ]}
                        />
                    </div>
                    <div style={{marginBottom: 10}}>
                        <b>{locale('common_jobdescription.khamtarch_ajillah')}:&nbsp;</b>
                        <Row>
                            <Col span={12}>
                                <div style={{border: '1px solid black'}}>
                                {/*<div>*/}
                                    <div style={{textAlign: 'center', borderBottom: '1px solid black', padding: '10px 0', height: 45}}>{locale('common_jobdescription.dotood')}</div>
                                    {
                                        ((this.state.units || {}).inner || []).length > 0 ?
                                            <ul>
                                                {((this.state.units || {}).inner || []).map(inn =>
                                                    <li key={inn._id}>{inn.title}</li>
                                                )}
                                            </ul>
                                            :
                                            <div className={'grayed-out'}>
                                                {locale('common_jobdescription.khooson')}
                                            </div>
                                    }
                                </div>
                            </Col>
                            <Col span={12}>
                                <div style={{border: '1px solid black'}}>
                                {/*<div>*/}
                                    <div style={{textAlign: 'center', borderBottom: '1px solid black', padding: '10px 0', height: 45}}>{locale('common_jobdescription.gadaad')}</div>
                                    {
                                        ((this.state.units || {}).outer || []).length > 0 ?
                                            <ul>
                                                {((this.state.units || {}).outer || []).map(out =>
                                                    <li key={out._id}>{out.title}</li>
                                                )}
                                            </ul>
                                            :
                                            <div className={'grayed-out'}>
                                                {locale('common_jobdescription.khooson')}
                                            </div>
                                    }
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <b>{locale('common_jobdescription.medleg_chadvar')}:&nbsp;</b>
                        {
                            (Object.keys(this.state.qualification || {}) || []).map(qual =>
                                <Row key={`${qual}_div`} className={'qualification-row'}>
                                    <Col span={12}
                                         style={{display: 'flex', justifyContent: 'center', alignItems: 'center', borderRight: '1px solid black', fontWeight: 500, fontSize: 15}}
                                    >
                                        {this.getProperName(qual)}
                                    </Col>
                                    <Col span={12}>
                                        {
                                            ((this.state.qualification || {})[qual] || []).length > 0 ?
                                                <React.Fragment>
                                                    <ul>
                                                        {((this.state.qualification || {})[qual] || []).map(qualif =>
                                                            <li key={qualif._id}>{qualif.title}</li>
                                                        )}
                                                    </ul>
                                                </React.Fragment>
                                                :
                                                <div className={'grayed-out'}>
                                                    {locale('common_jobdescription.khooson')}
                                                </div>
                                        }
                                    </Col>
                                </Row>
                            )
                        }
                    </div>
                </Modal>
            </React.Fragment>
        )
    }
}

export default connect(reducer)(jobDescription)