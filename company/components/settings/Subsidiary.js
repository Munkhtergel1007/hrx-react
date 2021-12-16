import React, {Fragment} from "react";
import { connect } from 'react-redux';
import {locale} from "../../lang";
import config, {hasAction, printStaticRole} from "../../config";
import moment from 'moment';
import {
    PlusOutlined,
    EditFilled,
    UserOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Button,
    Spin,
    Form,
    Row,
    Col,
    Input,
    Drawer,
    Typography, Alert,
    Space, Tag, Popconfirm,
    Table, Image, Divider, Checkbox,
    DatePicker, List, Avatar, Empty, Select
} from 'antd';
import SubsidiaryListItem from "./include/SubsidiaryListItem";
import {deleteUserRewards, getEmployeeStandard} from '../../actions/employee_actions';
import {
    getUsers,
    deleteSubsidiaryCompany,
    getSubsidiaryCompany,
    createSubsidiaryCompany
} from '../../actions/settings_actions';
import Tags from "./Tags";
import employee from "../../reducers/employee";

const reducer = ({ main, settings, subsidiary }) => ({ main, settings, subsidiary });

class Subsidiary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            name: '',
            domain: '',
            independent: true,
            lord: {
                _id: '',
                first_name: '',
                last_name: '',
                register_id: '',
                username: '',
                password: '',
                passwordRep: ''
            },
            searchErr: false,
            deleting: false,
            deletingId: '',
            selected: []
        };
        this.clear = this.clear.bind(this);
        this.submitSubsidiaryCompany = this.submitSubsidiaryCompany.bind(this);
        document.title = 'Тохиргоо | Охин компани | TATATUNGA';
    }
    componentDidMount() {
        const { dispatch, main: {company, employee}  } = this.props;
        if(!hasAction(['read_subsidiary'], employee)){
            this.props.history.replace('/not-found');
        }else{
            if((company.parent || '').toString() === ''){
                dispatch(getSubsidiaryCompany());
                dispatch(getUsers({search: ''}));
            }
            // dispatch(getEmployeeStandard({pageSize: 10, pageNum: 0, staticRole: ['employee', 'lord', 'chairman', 'hrManager'], extraProp: ['register_id', 'username']}))
        }
    }
    searchUsers(e) {
        const {dispatch} = this.props;
        const regex = new RegExp("(^[a-z0-9а-яөүё-]*$)", "i");
        if(regex.test(e)){
            clearTimeout(this.state.timeOut);
            let timeOut = setTimeout(function(){
                dispatch(getUsers({search: e}));
                // dispatch(getEmployeeStandard({pageSize: 10, pageNum: 0, staticRole: ['employee', 'lord', 'chairman', 'hrManager'], search: e, extraProp: ['register_id', 'username']}));
            }, 300);
            this.setState({...this.state, timeOut: timeOut, searchErr: false})
        }else{
            this.setState({...this.state, searchErr: true})
        }
    }
    findUser(e){
        const {subsidiary: {users}} = this.props;
        let lord = {
            _id: '',
            first_name: '',
            last_name: '',
            register_id: '',
            username: '',
            password: '',
            passwordRep: ''
        };
        (users || []).map(user => {
            if((user._id || '').toString() === e){
                lord._id = user._id;
                lord.first_name = (user).first_name || '';
                lord.last_name = (user).last_name || '';
                lord.register_id = (user).register_id || '';
                lord.username = (user).username || '';
                lord.password = '********';
                lord.passwordRep = '********'
            }
        });
        this.setState({...this.state, lord: lord});
    }
    findCompany(e){
        const {subsidiary: {subCompanies}} = this.props;
        let id = '';
        let found = {
            name: '',
            description: '',
            logo: {},
            emp_count: 0,
            employees: [],
        };
        (subCompanies || []).map(com => {
            if((com._id || '').toString() === e){
                id = e;
                (found || {}).name = com.name;
                (found || {}).description = com.description;
                (found || {}).logo = com.logo;
                (found || {}).emp_count = com.emp_count;
                (found || {}).employees = com.employees;
                (found || {}).willBeDeletedBy = com.willBeDeletedBy;
                (found || {}).deletionRequestedBy = com.deletionRequestedBy || {};
            }
        });
        this.setState({
            deletingId: id,
            selected: [found]
        });
    }
    clear(){
        this.setState({
            visible: false,
            name: '',
            domain: '',
            independent: false,
            lord: {
                _id: '',
                first_name: '',
                last_name: '',
                register_id: '',
                username: '',
                password: '',
                passwordRep: ''
            },
            searchErr: false,
            deleting: false,
            deletingId: ''
        });
    }
    submitSubsidiaryCompany(){
        const { dispatch, main: {company, employee}  } = this.props;
        if((company.parent || '').toString() !== ''){
            return config.get('emitter').emit('Охин компанийг зөвхөн толгой компаниас үүсгэнэ');
        }
        const domain_regex = new RegExp("^[a-zA-Z0-9]{5,19}$", "i");
        const username_regex = new RegExp("^[0-9a-zA-Z_]*$", "i");
        const register_regex = new RegExp("^[а-яА-ЯөӨүҮёЁ]{2}[0-9]{8}$", "i");
        if(!this.state.name || this.state.name === ''){
            config.get('emitter').emit('warning', 'Компаний нэрийг оруулна уу.');
        }else if(!this.state.domain || this.state.domain === ''){
            config.get('emitter').emit('warning', 'Компаний domain-ийг оруулна уу.');
        }else if(!domain_regex.test(this.state.domain)){
            config.get('emitter').emit('warning', 'Компаний domain латин үсгээр бичигдсэн байх ёстой.');
        }else if(!(this.state.lord || {}).username || (this.state.lord || {}).username === ''){
            config.get('emitter').emit('warning', 'Хэрэглэгчийн нэвтрэх нэрийг оруулна уу.');
        }else if(!username_regex.test((this.state.lord || {}).username)){
            config.get('emitter').emit('warning', 'Хэрэглэгчийн нэвтрэх нэр зөвхөн тоо болон латин үсгээр бичигдсэн байх ёстой.');
        }else if(!(this.state.lord || {}).first_name || (this.state.lord || {}).first_name === '') {
            config.get('emitter').emit('warning', 'Хэрэглэгчийн нэрийг оруулна уу.');
        }else if(!(this.state.lord || {}).last_name || (this.state.lord || {}).last_name === ''){
            config.get('emitter').emit('warning', 'Хэрэглэгчийн овгийг оруулна уу.');
        }else if(!(this.state.lord || {}).register_id || (this.state.lord || {}).register_id === ''){
            config.get('emitter').emit('warning', 'Хэрэглэгчийн регистрийн дугаарыг оруулна уу.');
        }else if(!register_regex.test((this.state.lord || {}).register_id)){
            config.get('emitter').emit('warning', 'Хэрэглэгчийн регистрийн дугаар буруу байна.');
        }else if((this.state.lord || {}).password !== (this.state.lord || {}).passwordRep){
            config.get('emitter').emit('error', 'Хэрэглэгчийн нууц үг таарахгүй байна.');
        }else{
            this.props.dispatch(createSubsidiaryCompany({name: this.state.name, domain: this.state.domain, independent: this.state.independent, lord: this.state.lord}))
                .then(c => {
                    if((c.json || {}).success){
                        this.clear();
                    }
                })
        }
    }
    deleteSubcompany(id){
        const {main: {employee}} = this.props;
        if(hasAction('delete_subsidiary'), employee){
            this.props.dispatch(deleteSubsidiaryCompany({companyId: id})).then(c => {
                if((c.json || {}).success){
                    this.clear();
                }
            });
        }else{
            config.get('emitter').emit('Error', 'Танд энэ үйлддийг хийх эрх байхгүй байна');
        }
    }
    render() {
        const { dispatch, main: {company, employee}, subsidiary: {gettingCompanies, subCompanies, gettingUsers, users}  } = this.props;
        const regex = new RegExp(".*([a-z0-9а-яөүё-]).*", "i");
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}} className={'settings-roles'}>

                    {/*<Popconfirm*/}
                    {/*    title='Компани устгах уу?'*/}
                    {/*    visible={this.state.key === this.state._id && this.state.deleting}*/}
                    {/*    onCancel={() => this.setState({key: null, type: ''})}*/}
                    {/*    onConfirm={() => this.respondToRequest('approved', record._id)}*/}
                    {/*    cancelText='Болих'*/}
                    {/*    okText='Зөвшөөрөх'*/}
                    {/*>*/}
                    {/*    <Button icon={<DeleteOutlined />} />*/}
                    {/*</Popconfirm>*/}

                    <Col span={18} className='subsidiary-col'>
                        {
                            hasAction('create_subsidiary', employee) ?
                                <div style={{width: '100%', marginBottom: 30}}>
                                    <div style={{float: 'left'}} key='delete-subsidiary-div'>
                                        {
                                            hasAction('delete_subsidiary', employee) && subCompanies.length > 0 ?
                                                <Button danger onClick={() => this.setState({deleting: true})} type='primary' icon={<DeleteOutlined />}
                                                        disabled={(company.parent || '').toString() !== ''}>
                                                    Охин компани устгах
                                                </Button>
                                                :
                                                null
                                        }
                                    </div>
                                    <div style={{float: 'right'}} key='create-subsidiary-div'>
                                        <Button onClick={() => this.setState({visible: true})} type='primary' icon={<PlusOutlined />}
                                                disabled={(company.parent || '').toString() !== ''}>
                                            {locale('common_subsidiary.Ohin_k nemeh')}
                                        </Button>
                                    </div>
                                    <div style={{clear: 'both'}}/>
                                </div>
                                :
                                null
                        }
                        {
                            (company.parent || '').toString() !== '' ?
                                <Alert
                                    message="Охин компани үүсгэх боломжгүй байна"
                                    description="Охин компанийг зөвхөн толгой компаниас үүсгэнэ"
                                    type="warning"
                                    showIcon
                                />
                                :
                                null
                        }
                        {
                            (company.parent || '').toString() !== '' ?
                                null
                                :
                                (gettingCompanies) ?
                                    <div style={{textAlign: 'center', marginTop: 30}}>
                                        <Spin />
                                    </div>
                                    :
                                    (subCompanies || []).length > 0 ?
                                        <List
                                            bordered
                                            itemLayout="vertical"
                                            renderItem={(item, index) => (
                                                <SubsidiaryListItem {...item} index={index} />
                                            )}
                                            dataSource={subCompanies}
                                        />
                                        :
                                        <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale('common_subsidiary.Ohin_k_B baina')} </span>} />
                        }
                    </Col>
                </Row>
                <Drawer
                    title= {locale('common_subsidiary.Ohin_k uusgeh')}
                    maskClosable={false}
                    onClose={this.clear}
                    width={720}
                    visible={this.state.visible}
                    key={'drawer-subsidiary-create'}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button style={{marginRight: 20}} onClick={this.clear}>{locale('common_subsidiary.Bolih')}</Button>
                            <Button
                                type="primary"
                                form='subsidiaryCompanyForm'
                                htmlType='submit'
                                disabled={(company.parent || '').toString() !== ''}
                            >
                                {locale('common_subsidiary.Uusgeh')}
                            </Button>
                        </div>
                    }
                >
                    <Divider orientation='left' plain>{locale('common_subsidiary.Compane')}</Divider>

                    <Form
                        id='subsidiaryCompanyForm'
                        onFinish={this.submitSubsidiaryCompany}
                        fields={[
                            {name: 'name', value: this.state.name},
                            {name: 'domain', value: this.state.domain},
                            {name: 'independent', value: this.state.independent},
                            {name: 'username', value: (this.state.lord || {}).username},
                            {name: 'last_name', value: (this.state.lord || {}).last_name},
                            {name: 'first_name', value: (this.state.lord || {}).first_name},
                            {name: 'register_id', value: (this.state.lord || {}).register_id},
                            {name: 'password', value: (this.state.lord || {}).password},
                            {name: 'passwordRep', value: (this.state.lord || {}).passwordRep},
                        ]}
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 14,
                        }}
                    >
                        <Form.Item
                            label= {locale('common_subsidiary.Compane ner')}
                            name='name'
                            rules={[
                                {
                                    required: true,
                                    message: locale('common_subsidiary.Compane ner oruulnuu'),
                                    transform: (value) => value.trim()
                                }
                            ]}
                        >
                            <Input value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
                        </Form.Item>
                        <Form.Item
                            label= {locale('common_subsidiary.Compane domain')}
                            name='domain'
                            rules={[
                                {
                                    required: true,
                                    message: this.state.domain === '' ? locale('common_subsidiary.Compane domain oruulnuu')
                                        : locale('common_subsidiary.Compane domain aldaatai baina'),
                                    transform: (value) => value.toLowerCase().trim(),
                                    pattern: /^[a-zA-Z0-9]{5,19}$/i
                                }
                            ]}
                        >
                            <Input value={this.state.domain} onChange={(e) => this.setState({domain: e.target.value})} />
                        </Form.Item>
                        <Form.Item
                            name='independent'
                            valuePropName="checked"
                            wrapperCol={{
                                offset: 6,
                                span: 14,
                            }}
                        >
                            <Checkbox checked={this.state.independent} onChange={(e) => this.setState({independent: e.target.checked})}>{locale('common_subsidiary.Bie daasan eseh')}</Checkbox>
                        </Form.Item>

                        <Divider orientation='left' plain>{locale('common_subsidiary.Udirdah hereglegch')}</Divider>

                        <Form.Item
                            label={locale('common_subsidiary.Hereglegch haih')}
                        >
                            <Select
                                placeholder="Хэрэглэгчийн нэр, утас"
                                onSelect={(e) => this.findUser(e)}
                                showSearch={true}
                                allowClear={true}
                                autoClearSearchValue={false}
                                onClear={() => this.setState({
                                    lord: {
                                        _id: '',
                                        first_name: '',
                                        last_name: '',
                                        register_id: '',
                                        username: '',
                                        password: '',
                                        passwordRep: ''
                                    }
                                })}
                                searchValue={this.state.search}
                                value={(this.state.lord || {})._id}
                                filterOption={false}
                                notFoundContent={locale('common_subsidiary.Hereglegch oldsongui')}
                                onSearch={this.searchUsers.bind(this)}
                                loading={gettingUsers}
                            >
                                {(users || []).map(user => <Select.Option key={user._id} value={user._id}>
                                    <b key={`${user._id}_name`}>
                                        {(user.last_name || '').slice(0,1).toUpperCase()+(user.last_name || '').slice(1,(user.last_name || '').length)}&nbsp;
                                        {(user.first_name || '').slice(0,1).toUpperCase()+(user.first_name || '').slice(1,(user.first_name || '').length)}&nbsp;-&nbsp;
                                        {user.register_id || ''}
                                    </b>
                                </Select.Option>)}
                            </Select>
                            {
                                this.state.searchErr ?
                                    <Tag color='danger'>Зөвхөн тоо болон үсэг орох боломжтой.</Tag>
                                    :
                                    null
                            }

                        </Form.Item>

                        <Form.Item
                            label= {locale('common_subsidiary.Nevtreh ner')}
                            name='username'
                            rules={[
                                {
                                    required: true,
                                    message: (this.state.lord || {}).username === '' ? locale('common_subsidiary.Nevtreh ner oruulna uu')
                                        : locale('common_subsidiary.Nevtreh ner aldaatai baina'),
                                    transform: (value) => value.trim(),
                                    pattern: /^[0-9a-zA-Z_]*$/i
                                }
                            ]}
                        >
                            <Input disabled={(this.state.lord || {})._id} value={(this.state.lord || {}).username} onChange={(e) => this.setState({lord: {...this.state.lord, username: e.target.value}})} />
                        </Form.Item>
                        <Form.Item
                            label= {locale('common_subsidiary.Hereglegchiin ovog')}
                            name='last_name'
                            rules={[
                                {
                                    required: true,
                                    message: locale('common_subsidiary.Hereglegchiin ovog oruulna uu'),
                                    transform: (value) => value.trim()
                                }
                            ]}
                        >
                            <Input disabled={(this.state.lord || {})._id} value={(this.state.lord || {}).last_name} onChange={(e) => this.setState({lord: {...this.state.lord, last_name: e.target.value}})} />
                        </Form.Item>
                        <Form.Item
                            label= {locale('common_subsidiary.Hereglegchiin ner')}
                            name='first_name'
                            rules={[
                                {
                                    required: true,
                                    message: locale('common_subsidiary.Hereglegchiin ner oruulna uu'),
                                    transform: (value) => value.trim()
                                }
                            ]}
                        >
                            <Input disabled={(this.state.lord || {})._id} value={(this.state.lord || {}).first_name}  onChange={(e) => this.setState({lord: {...this.state.lord, first_name: e.target.value}})} />
                        </Form.Item>
                        <Form.Item
                            label= {locale('common_subsidiary.Register dugaar')}
                            name='register_id'
                            rules={[
                                {
                                    required: true,
                                    message: (this.state.lord || {}).register_id === '' ? locale('common_subsidiary.Registeriin dugaar oruulna uu') : locale('common_subsidiary.Registeriin dugaar aldaatai baina'),
                                    transform: (value) => value.trim(),
                                    pattern: /^[а-яА-ЯөӨүҮёЁ]{2}[0-9]{8}$/i
                                }
                            ]}
                        >
                            <Input disabled={(this.state.lord || {})._id} value={(this.state.lord || {}).register_id} onChange={(e) => this.setState({lord: {...this.state.lord, register_id: e.target.value}})} />
                        </Form.Item>
                        <Form.Item
                            label= {locale('common_subsidiary.Nuuts ug')}
                            name='password'
                            rules={[
                                {
                                    required: true,
                                    message: locale('common_subsidiary.Nuuts ug oruulan uu')
                                }
                            ]}
                        >
                            <Input.Password disabled={(this.state.lord || {})._id} value={(this.state.lord || {}).password} onChange={(e) => this.setState({lord: {...this.state.lord, password: e.target.value}})} />
                        </Form.Item>
                        {
                            (this.state.lord || {}).password !== '' && (this.state.lord || {}).password !== '********' ?
                                <Form.Item
                                    label= {locale('common_subsidiary.Nuuts ug davtah')}
                                    name='passwordRep'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Давтах нууц үг оруулна уу.',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }

                                                return Promise.reject(new Error( locale('common_subsidiary.Nuuts ug taarahgui bn')));
                                            },
                                        }),
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password disabled={(this.state.lord || {})._id} value={(this.state.lord || {}).passwordRep} onChange={(e) => this.setState({lord: {...this.state.lord, passwordRep: e.target.value}})} />
                                </Form.Item>
                                :
                                null
                        }
                        {
                            (this.state.lord || {}).first_name !== '' || (this.state.lord || {}).last_name !== '' || (this.state.lord || {}).username !== '' ?
                                <div style={{textAlign: 'right'}}>
                                    <Button
                                        onClick={() => this.setState({
                                            lord: {
                                                _id: '',
                                                first_name: '',
                                                last_name: '',
                                                register_id: '',
                                                username: '',
                                                password: '',
                                                passwordRep: ''
                                            }
                                        })}
                                        danger
                                    >{locale('common_subsidiary.Tseverleh')}</Button>
                                </div>
                                :
                                null
                        }
                    </Form>
                </Drawer>
                <Drawer
                    visible={this.state.deleting}
                    title='Охин компани устгах'
                    maskClosable={false}
                    onClose={this.clear}
                    width={720}
                    key={'drawer-subsidiary-delete'}
                    footer={
                        <Row style={{overflow: 'hidden', width: '100%'}}>
                            <Col span={16}>
                                <Alert
                                    message="Анхааруулга"
                                    description="Компани автоматаар 30 хоногийн дараа устах болно."
                                    type="warning"
                                    showIcon
                                />
                            </Col>
                            <Col span={8} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                <Button style={{marginRight: 20}} onClick={this.clear}>Болих</Button>
                                <Popconfirm
                                    title='Компани устгах уу?'
                                    okText='Тийм'
                                    cancelText='Үгүй'
                                    onConfirm={() => this.deleteSubcompany(this.state.deletingId)}
                                >
                                    <Button
                                        type="primary"
                                        danger
                                        disabled={!gettingCompanies && !this.state.deletingId}
                                    >
                                        Устгах
                                    </Button>
                                </Popconfirm>
                            </Col>
                        </Row>
                    }
                >
                    <Select
                        style={{width: '100%'}}
                        loading={gettingCompanies}
                        placeholder='Компани сонгоно уу?'
                        onSelect={(e) => this.findCompany(e)}
                        showSearch={true}
                        allowClear={true}
                        autoClearSearchValue={false}
                        onClear={() => this.setState({
                            deletingId: ''
                        })}
                        value={this.state.deletingId}
                        filterOption={false}
                        notFoundContent={'Компани олдсонгүй'}
                    >
                        { (subCompanies || []).map(sub => !sub.willBeDeletedBy ? <Select.Option key={sub._id} value={sub._id}>{sub.name}</Select.Option> : null) }
                    </Select>
                    {
                        this.state.deletingId ?
                            <List
                                itemLayout={'vertical'}
                                dataSource={this.state.selected || []}
                                renderItem={(item, index) => <SubsidiaryListItem {...item} index={index} />}
                            />
                            :
                            null
                    }
                </Drawer>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Subsidiary);