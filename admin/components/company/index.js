import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {
    Tabs,
    Card,
    Button,
    Modal,
    Form,
    Switch,
    Input,
    Row,
    Col,
    Tag,
    Popconfirm,
    InputNumber,
    Radio,
    List,
    Dropdown,
    Avatar,
    Menu,
    Select,
    Spin,
    Table,
    Tooltip
} from 'antd';
import config from '../../config';
import {
    FileDoneOutlined,
    GiftOutlined,
    PlusOutlined,
    UsergroupAddOutlined,
    UserAddOutlined,
    DownOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    EditOutlined
} from '@ant-design/icons';
import {
    createCompany,
    changeCreateTabKey,
    createUser,
    setCMRole,
    employeeRemoveCM,
    searchUser,
    employeeAddCM,
    setEmployees,
    getCompanies,
    changeCompanyBundle,
    setCompanyBundle,
    changeCompanyStatus
} from '../../actions/company_actions';
import moment from 'moment';
import {getBundles} from "../../actions/bundle_actions";
import NumberFormat from "react-number-format";

const {TabPane} = Tabs;
const {Option} = Select;

const reducer = ({company, main, bundle}) => ({company, main, bundle});
const printStaticRole = function (role) {
    switch (role) {
        case 'chairman' :
            return 'Удирдлага';
        case 'hrManager' :
            return 'Хүний нөөц';
        case 'employee' :
            return 'Ажилтан';
        case 'lord' :
            return 'Эзэмшигч / Ерөнхий захирал /';
        default:
            return 'Ажилтан';
    }
};

class Company extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            createModal: false,
            createUser: false,
            pageNum: 0,
            pageSize: 50
        }
    }

    componentDidMount() {
        const {dispatch} = this.props;
        dispatch(getCompanies());
        dispatch(getBundles());
    }

    createCompany(vals) {
        this.props.dispatch(createCompany(vals));
    }

    createUser(vals) {
        this.props.dispatch(createUser(vals)).then((data) => {
            if (data.json.success) {
                this.setState({createUser: false});
            }
        });
    }

    createEmployee() {
        const emps = (this.props.company.companyMembers || []).map((c) => {
            return {
                company: c.company,
                user: c.user._id,
                staticRole: c.staticRole,
            }
        });
        if (emps.length === 0) {
            return config.get('emitter').emit('error', 'Ажилтан сонгоно уу!');
        } else {
            this.props.dispatch(setEmployees({emps: emps}));
        }
    }

    changeCompanyBundle(id) {
        this.props.dispatch(changeCompanyBundle(id));
    }

    setCompanyBundle() {
        const {dispatch, company: {singleCompany}} = this.props;
        dispatch(setCompanyBundle({company: singleCompany._id, bundle: singleCompany.bundle})).then((c) => {
            if (c.json.success) {
                this.setState({createModal: false});
            }
        });
    }

    changeCompanyStatus(status, company) {
        const {dispatch} = this.props;
        let companyStatus = Object.assign(company, {
            id: company._id,
            status: status
        })
        dispatch(changeCompanyStatus(companyStatus))
    }

    render() {
        const {
            dispatch,
            company: {
                companies,
                settingCompanyBundle,
                singleCompany,
                creating,
                createTabActive,
                searchingUser,
                creatingUser,
                searchedUsers,
                companyMembers
            },
            bundle: {
                bundles,
                gettingBundles
            }
        } = this.props;
        const {createModal, createUser} = this.state;
        const columns = [
            {
                title: '№',
                render: (text, record, idx) => (
                    (this.state.pageNum * this.state.pageSize) + idx + 1
                ),
            },
            {
                title: 'Нэр',
                render: (text, record) => (
                    record.name
                ),
            },
            {
                title: 'Email',
                render: (text, record) => (
                    record.email
                ),
            },
            {
                title: 'Утас',
                render: (text, record) => (
                    record.phone
                ),
            },
            {
                title: 'Ажилчид',
                render: (text, record) => (
                    record.employees
                ),
            },
            {
                title: 'Огноо',
                render: (text, record) => moment(record.created).format('YYYY/MM/DD hh:mm'),
            },
            // {
            //     title: '',
            //     render: (text, record) =>
            //         <Button
            //             type="light"
            //             icon={<EyeOutlined />}
            //             loading={creating}
            //             onClick={() => this.enterLoading(2)}
            //         />,
            // },
            {
                title: '',
                render: (record) => (
                    record.status === 'lock' ?
                        <Tag color='red'>Locked</Tag>
                        : null
                )
            },
            {
                title: 'Үйлдлүүд',
                render: (record) =>
                    <div>
                        <Link to={`/admin/editCompany/${record._id}`}>
                            <Button
                                icon={<EditOutlined/>}
                                style={{marginRight: '10px'}}
                            >Засах</Button>
                        </Link>
                        {
                            record.status === 'lock' || record.status === 'delete'
                                ?
                                <Popconfirm
                                    placement="bottomRight"
                                    title={`${record.name} компанийг сэргээх үү?`}
                                    onConfirm={this.changeCompanyStatus.bind(this, 'active', record)}
                                    okText="Тийм"
                                    cancelText="Үгүй"
                                >
                                    <Button
                                        icon={<EditOutlined/>}
                                        style={{marginRight: '10px'}}
                                        type='dashed'
                                    >Сэргээх</Button>
                                </Popconfirm>
                                :
                                <Popconfirm
                                    placement="bottomRight"
                                    title={`${record.name} компанийг цоожлох уу?`}
                                    onConfirm={this.changeCompanyStatus.bind(this, 'lock', record)}
                                    okText="Тийм"
                                    cancelText="Үгүй"
                                >
                                    <Button
                                        icon={<EditOutlined/>}
                                        style={{marginRight: '10px'}}
                                        type='dashed'
                                    >Lock</Button>
                                </Popconfirm>
                        }
                        <Popconfirm
                            placement="bottomRight"
                            title={`${record.name} компанийг устгах үү?`}
                            onConfirm={this.changeCompanyStatus.bind(this, 'delete', record)}
                            okText="Тийм"
                            cancelText="Үгүй"
                        >
                            <Button
                                icon={<DeleteOutlined/>}
                                type='primary'
                                danger
                            >Устгах</Button>
                        </Popconfirm>
                    </div>
            }
        ];
        return (
            <Card
                extra={[
                    <Button icon={<PlusOutlined/>} onClick={() => this.setState({createModal: true})}>Компани
                        үүсгэх</Button>
                ]}
            >
                <Table dataSource={companies} columns={columns} pagination={false}/>
                <Modal
                    visible={createModal}
                    onOk={() => console.log()}
                    onCancel={() => this.setState({createModal: false})}
                    closable={false}
                    footer={null}
                >
                    <Tabs
                        defaultActiveKey="1"
                        onTabClick={(e) => dispatch(changeCreateTabKey(e))}
                        activeKey={createTabActive}
                    >
                        <TabPane
                            tab={
                                <span>
                                  <FileDoneOutlined/>
                                  Компани үүсгэх
                                </span>
                            }
                            key="1"
                        >
                            <Row type="flex" justify="center" align="middle">
                                <div style={{marginTop: 30}}>
                                    <Form
                                        labelCol={{span: 8}}
                                        wrapperCol={{span: 16}}
                                        size={'small'}
                                        layout="horizontal"
                                        onFinish={this.createCompany.bind(this)}
                                    >
                                        <Form.Item
                                            label="Нэр"
                                            name="name"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Нэр оруулна уу!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Компани нэр"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Email / Компани /"
                                            name="email"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Email / Компани / оруулна уу!',
                                                    pattern: new RegExp(/^\S+@\S+\.\S+$/)
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Email"/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Утас / Компани /"
                                            name="phone"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Утас / Компани / оруулна уу!',
                                                    pattern: new RegExp(/^[0-9]{8}$/)
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Утас"/>
                                        </Form.Item>
                                        <Form.Item label="Website" name="website">
                                            <Input placeholder="Website"/>
                                        </Form.Item>
                                        <Form.Item
                                       label="Domain"
                                            name="domain"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Domain оруулна уу!',
                                                },
                                            ]}
                                        >
                                            <Input addonBefore={<span style={{color: 'white'}}>https://</span>}
                                                   suffix={".tatatunga.mn"} placeholder="Domain нэр"/>
                                        </Form.Item>
                                        <Form.Item label="Consulting" name="isCons">
                                            <Switch/>
                                        </Form.Item>
                                        <Form.Item
                                            label="Хаяг"
                                            name="address"
                                            rules={[
                                                {
                                                    required: false,
                                                    message: 'Хаяг оруулна уу!',
                                                },
                                            ]}
                                        >
                                            <Input placeholder="Хаяг"/>
                                        </Form.Item>
                                        <Row>
                                            <Col span={24} style={{textAlign: 'right'}}>
                                                {
                                                    !(singleCompany || {})._id ?
                                                        <React.Fragment>
                                                            <Popconfirm
                                                                placement="bottomRight"
                                                                title={"Та компани үүсгэх үйлдэлээ цуцлах гэж байна!"}
                                                                onConfirm={() => this.setState({createModal: false})}
                                                                okText="Тийм"
                                                                cancelText="Үгүй"
                                                            >
                                                                <Button style={{marginRight: 10}}>
                                                                    Болих
                                                                </Button>
                                                            </Popconfirm>
                                                            <Button type="primary" htmlType="submit"
                                                                    loading={creating}>Үүсгэх</Button>
                                                        </React.Fragment>
                                                        :
                                                        <Button
                                                            onClick={() => this.setState({createModal: false})}>Хаах</Button>
                                                }
                                            </Col>
                                        </Row>
                                    </Form>
                                </div>
                            </Row>
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                  <UsergroupAddOutlined/>
                                  Гишүүн нэмэх
                                </span>
                            }
                            disabled={!(singleCompany || {})._id}
                            key="2"
                        >
                            <Row>
                                <Col span={16}>
                                    {/*<Input.Search*/}
                                    {/*    placeholder={'Хэрэглэгч хайх'}*/}
                                    {/*    size={'small'}*/}
                                    {/*    onChange={(e) => dispatch(searchUser({search: e.target.value}))}*/}
                                    {/*    onSearch={(e) => dispatch(searchUser({search: e}))}*/}
                                    {/*/>*/}
                                    <Select
                                        value={''}
                                        size={'small'}
                                        placeholder="Хэрэглэгч хайх"
                                        notFoundContent={searchingUser ? <Spin size="small"/> : null}
                                        filterOption={false}
                                        onSearch={(e) => dispatch(searchUser({search: e}))}
                                        onChange={(e) => dispatch(employeeAddCM(e))}
                                        style={{width: "100%"}}
                                        showSearch
                                    >
                                        {searchedUsers.map(d => (
                                            <Option
                                                key={d._id}>{`${(d.first_name || '').charAt(0).toUpperCase()}. ${d.last_name}`}</Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={8}>
                                    <Button icon={<UserAddOutlined/>} style={{float: 'right'}} size={'small'}
                                            onClick={() => this.setState({createUser: true})}>Хэрэглэгч үүсгэх</Button>
                                </Col>
                            </Row>
                            <div style={{marginTop: 20, marginBottom: 20}}>
                                <List
                                    className="demo-loadmore-list"
                                    itemLayout="horizontal"
                                    dataSource={companyMembers}
                                    renderItem={item => (
                                        <List.Item
                                            key={item._id}
                                            actions={[
                                                <Dropdown overlay={
                                                    <Menu>
                                                        <Menu.Item key={'lord'} onClick={() => dispatch(setCMRole({
                                                            _id: (item.user || {})._id,
                                                            staticRole: 'lord'
                                                        }))}>
                                                            Эзэмшигч / Ерөнхий захирал /
                                                        </Menu.Item>
                                                        <Menu.Item key={'chairman'} onClick={() => dispatch(setCMRole({
                                                            _id: (item.user || {})._id,
                                                            staticRole: 'chairman'
                                                        }))}>
                                                            Удирдлага
                                                        </Menu.Item>
                                                        <Menu.Item key={'hrManager'} onClick={() => dispatch(setCMRole({
                                                            _id: (item.user || {})._id,
                                                            staticRole: 'hrManager'
                                                        }))}>
                                                            Хүний нөөц
                                                        </Menu.Item>
                                                        <Menu.Item key={'employee'} onClick={() => dispatch(setCMRole({
                                                            _id: (item.user || {})._id,
                                                            staticRole: 'employee'
                                                        }))}>
                                                            Ажилтан
                                                        </Menu.Item>
                                                    </Menu>
                                                }>
                                                <span className="ant-dropdown-link">
                                                    {printStaticRole(item.staticRole)} <DownOutlined/>
                                                </span>
                                                </Dropdown>,
                                                <Popconfirm
                                                    placement="bottomRight"
                                                    title={"Ажилтан дундаас хасах гэж байна!"}
                                                    onConfirm={() => dispatch(employeeRemoveCM(item._id))}
                                                    okText="Хасах"
                                                    cancelText="Болих"
                                                >
                                                    <DeleteOutlined/>
                                                </Popconfirm>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <Avatar
                                                        src={((item.user || {}).avatar || {}).path || '/images/default-avatar.png'}/>
                                                }
                                                title={`${((item.user || {}).first_name || '').charAt(0).toUpperCase()}. ${(item.user || {}).last_name}`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <Row>
                                <Col span={24} style={{textAlign: 'right'}}>
                                    <React.Fragment>
                                        <Button style={{marginRight: 10}}
                                                onClick={() => this.setState({createModal: false})}>
                                            Хаах
                                        </Button>
                                        <Button type="primary" onClick={this.createEmployee.bind(this)}
                                                htmlType="submit" loading={creating}>Ажилтан нэмэх</Button>
                                    </React.Fragment>
                                </Col>
                            </Row>
                        </TabPane>
                        <TabPane
                            tab={
                                <span>
                                  <GiftOutlined/>
                                  Багц сонгох
                                </span>
                            }
                            disabled={!(singleCompany || {})._id}
                            key="3"
                        >
                            <Form onFinish={() => this.setCompanyBundle()}>
                                <List
                                    className="demo-loadmore-list"
                                    itemLayout="horizontal"
                                    loading={gettingBundles}
                                    dataSource={bundles}
                                    renderItem={item => (
                                        <List.Item
                                            key={item._id}
                                            actions={
                                                item._id === singleCompany.bundle ?
                                                    [
                                                        <NumberFormat
                                                            displayType={'text'}
                                                            value={item.cost || item.sale}
                                                            renderText={value => <span>{value || 0}₮</span>}
                                                            thousandSeparator={true}
                                                        />,
                                                        <CheckCircleOutlined/>
                                                    ]
                                                    : [
                                                        <NumberFormat
                                                            displayType={'text'}
                                                            value={item.cost || item.sale}
                                                            renderText={value => <span>{value || 0}₮</span>}
                                                            thousandSeparator={true}
                                                        />
                                                    ]
                                            }
                                            onClick={this.changeCompanyBundle.bind(this, item._id)}
                                            style={{cursor: 'pointer'}}
                                        >
                                            <List.Item.Meta
                                                title={item.title}
                                            />
                                        </List.Item>
                                    )}
                                />
                                <Row>
                                    <Col span={24} style={{textAlign: 'right'}}>
                                        <React.Fragment>
                                            <Button style={{marginRight: 10}}
                                                    onClick={(e) => this.setState({createModal: false})}>
                                                Хаах
                                            </Button>
                                            <Button type="primary" htmlType="submit" loading={settingCompanyBundle}
                                                    disabled={!singleCompany.bundle}>Багц нэмэх</Button>
                                        </React.Fragment>
                                    </Col>
                                </Row>
                            </Form>
                        </TabPane>
                    </Tabs>
                </Modal>
                <Modal
                    visible={createUser}
                    onOk={() => console.log()}
                    onCancel={() => this.setState({createUser: false})}
                    closable={false}
                    footer={null}
                >
                    <Row type="flex" justify="center" align="middle">
                        <div style={{marginTop: 30}}>
                            <Form
                                labelCol={{span: 10}}
                                wrapperCol={{span: 14}}
                                size={'small'}
                                layout="horizontal"
                                onFinish={this.createUser.bind(this)}
                            >
                                <Form.Item
                                    label="Овог"
                                    name="last_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Овог оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Овог"/>
                                </Form.Item>
                                <Form.Item
                                    label="Нэр"
                                    name="first_name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Нэр оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Нэр"/>
                                </Form.Item>
                                <Form.Item
                                    label="Регистрийн дугаар"
                                    name="register_id"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Регистрийн дугаар оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Регистрийн дугаар"/>
                                </Form.Item>
                                <Form.Item
                                    label="И-мэйл"
                                    name="email"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'И-мэйл оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="И-мэйл"/>
                                </Form.Item>
                                <Form.Item
                                    label="Нэвтрэх нэр"
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Нэвтрэх нэр оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Нэвтрэх нэр"/>
                                </Form.Item>
                                <Form.Item
                                    label="Утасны дугаар"
                                    name="phone"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Утасны дугаар оруулна уу!',
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder="Утасны дугаар" style={{width: 200}}/>
                                </Form.Item>
                                <Form.Item
                                    label="Нууц үг"
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Нууц үг оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Input placeholder="Нууц үг" style={{width: 200}}/>
                                </Form.Item>
                                <Form.Item
                                    label="Хүйс"
                                    name="gender"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Хүйс оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value="male">Эр</Radio>
                                        <Radio value="female">Эм</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Row>
                                    <Col span={24} style={{textAlign: 'right'}}>
                                        <React.Fragment>
                                            <Button onClick={() => this.setState({createUser: false})}
                                                    style={{marginRight: 10}}>
                                                Болих
                                            </Button>
                                            <Button type="primary" htmlType="submit"
                                                    loading={creatingUser}>Үүсгэх</Button>
                                        </React.Fragment>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Row>
                </Modal>
            </Card>
        )
    }
}


export default connect(reducer)(Company);