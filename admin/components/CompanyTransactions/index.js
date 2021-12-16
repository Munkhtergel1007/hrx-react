import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import {
    Tabs,
    Card,
    Button,
    Modal,
    Form,
    Badge,
    Input,
    Row,
    Col,
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
    Divider,
    DatePicker,
    Tooltip,
    Drawer, Empty
} from 'antd';
import config, {uuidv4} from '../../config';
import { FileDoneOutlined, AppstoreAddOutlined, PlusOutlined, UsergroupAddOutlined, UserAddOutlined, DownOutlined, DeleteOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import {
    getCompanyTransactions,
    getChargeRequests,
    insertNewTrans
} from '../../actions/company_transaction_actions';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import {getCompanies, setCompanyBundle} from "../../actions/company_actions";
import {getBundles} from "../../actions/bundle_actions";
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const reducer = ({compTrans, main, company, bundle}) => ({compTrans, main, company, bundle});


class CompanyTransactions extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            createModal: false,
            company: '',
            bundle: '',
            num_recruitment: '',
            num_file_size: '',
            cost: '0',
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getChargeRequests());
        dispatch(getCompanyTransactions());
        dispatch(getCompanies({infoOnly: true}));
        dispatch(getBundles());
    }

    setCompanyBundle(){
        const { dispatch } = this.props;
        const { num_recruitment, num_file_size, company, bundle, cost } = this.state;
        if(num_recruitment !== '' || num_file_size !== ''){
            if(cost === '' || parseInt(cost) <= 0){
                config.get('emitter').emit('error', 'Үнэ оруулна уу!');
            } else {
                dispatch(insertNewTrans({num_recruitment, num_file_size, cost, company}));
            }
        } else {
            dispatch(setCompanyBundle({company: company, bundle: bundle})).then((c) => {
                if(c.json.success){
                    this.setState({createModal: false});
                }
            });
        }
    }
    render() {
        const {
            compTrans: {
                companyTransactions,
                insertingTrans,
                gettingChargeReqs,
                requests
            },
            company: {
                companies
            },
            bundle: {
                bundles,
                gettingBundles
            }
        } = this.props;
        const {
            createModal
        } = this.state;
        const columns = [
            {
                title: '№',
                render: (text, record, idx) => idx + 1
            },
            {
                title: 'Компани',
                render: (text, record) => record.company.name
            },
            {
                title: 'Багц',
                render: (text, record) => (record.system_bundle || {}).title || '-'
            },
            {
                title: 'Зарын хязгаар',
                render: (text, record) => record.transaction.recSize ? record.transaction.recSize + 'ш' : '-'
            },
            {
                title: 'File size',
                render: (text, record) => record.transaction.fileSize ? record.transaction.fileSize + 'GB' : '-'
            },
            {
                title: 'Үнэлгээ',
                render: (text, record) => <NumberFormat value={record.transaction.cost} displayType={'text'} thousandSeparator={true} renderText={value => `${value}₮`}/>
            },
            {
                title: 'Дуусах огноо',
                render: (text, record) => moment(record.ending_date).format('YYYY/MM/DD')
            },
            {
                title: 'Огноо',
                render: (text, record) => moment(record.created).format('YYYY/MM/DD hh:mm')
            },
        ];
        return (
            <Card
                title={
                    requests.length > 0 ?
                        <Button loading={gettingChargeReqs} icon={<AppstoreAddOutlined />} onClick={() => this.setState({visible: true})} style={{float: 'left'}}>Цэнэглэх хүсэлт <Badge count={requests.length} /></Button>
                    : null
                }
                extra={[
                    <Button icon={<PlusOutlined />} onClick={() => this.setState({createModal: true})}>Гүйлгээ үүсгэх</Button>
                ]}
            >
                <Table dataSource={companyTransactions} columns={columns} pagination={false}/>
                <Drawer
                    title="Цэнэглэлт хүсэлтүүд"
                    closable={false}
                    onClose={() => this.setState({visible: false, bundle: {}})}
                    width={720}
                    visible={this.state.visible}
                    key={'Цэнэглэлт-хүсэлтүүд'}
                >
                    {
                        gettingChargeReqs ?
                            <div style={{textAlign: 'center', marginTop: 30}}>
                                <Spin/>
                            </div>
                            : requests.length > 0 ?
                            <List
                                className={'bundle-items'}
                                dataSource={requests}
                                renderItem={item => {
                                    let comp = item.company || {};
                                    let type = item.type || {};
                                    return (
                                        <List.Item key={uuidv4()}>
                                            <List.Item.Meta
                                                avatar={
                                                    (
                                                        (comp.logo || {}).path ?
                                                            <Avatar shape="square" src={((comp.logo || {}).url + (comp.logo || {}).path) || '/images/default-company.png'} />
                                                        :
                                                            <Avatar>
                                                                {comp.name.split(' ')[0].charAt(0).toUpperCase()}
                                                                {comp.name.split(' ')[1] ? comp.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                                                            </Avatar>
                                                    )
                                                }
                                                title={<a href="https://ant.design">{comp.name}</a>}
                                                description={
                                                    <div>
                                                        <b>
                                                            "{type.title}"
                                                        </b>
                                                        <span> {type.num_recruitment}/ш/ + {type.num_file_size}GB = </span>
                                                        <NumberFormat value={type.sale || type.cost || 0} displayType={'text'} thousandSeparator={true} renderText={value => <b>{value}₮</b>}/>
                                                    </div>
                                                }
                                            />
                                            <div>{moment(item.created).format('YYYY/MM/DD hh:mm')}</div>
                                        </List.Item>
                                    )
                                }}
                            />
                            : <Empty />
                    }
                    <div style={{marginTop: 30, marginBottom: 30}}>
                        <Button
                            style={{float: 'right'}}
                            htmlType="button"
                            onClick={() => this.setState({visible: false, bundle: ''})}
                        >
                            Хаах
                        </Button>
                    </div>
                </Drawer>
                <Modal
                    visible={createModal}
                    onOk={() => this.setCompanyBundle()}
                    onCancel={() => this.setState({createModal: false})}
                    okText={'Гүйлгээ үүсгэх'}
                    okButtonProps={{
                        disabled: (this.state.company === '' && ( this.state.bundle === '' || (this.state.num_file_size === '' && this.state.num_recruitment === '') ) || insertingTrans),
                        loading: insertingTrans
                    }}
                    cancelText={'Цуцлах'}
                    closable={false}
                >
                    <Select placeholder={'Компани сонгоно уу!'} style={{ width: '100%' }} onChange={(e) => this.setState({company: e})}>
                        {
                            companies.map( c =>
                                <Option value={c._id}>{c.name}</Option>
                            )
                        }
                    </Select>
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Багц сонгох" key="1">
                            <div style={{marginTop: 30, marginBottom: 30}}>
                                <List
                                    size='small'
                                    itemLayout="horizontal"
                                    loading={gettingBundles}
                                    dataSource={bundles}
                                    style={this.state.company !== '' ? {} : {opacity: 0.5}}
                                    renderItem={item => (
                                        <List.Item
                                            key={item._id}
                                            actions={
                                                item._id === this.state.bundle ?
                                                    [
                                                        <NumberFormat
                                                            displayType={'text'}
                                                            value={item.cost || item.sale}
                                                            renderText={value => <span>{value || 0}₮</span>}
                                                            thousandSeparator={true}
                                                        />,
                                                        <CheckCircleOutlined />
                                                    ]
                                                    :   [
                                                        <NumberFormat
                                                            displayType={'text'}
                                                            value={item.cost || item.sale}
                                                            renderText={value => <span>{value || 0}₮</span>}
                                                            thousandSeparator={true}
                                                        />
                                                    ]
                                            }
                                            onClick={() => this.state.company !== '' ? this.setState({bundle: item._id}) : false}
                                            style={{cursor: (this.state.company !== '' ? 'pointer' : 'not-allowed')}}
                                        >
                                            <List.Item.Meta
                                                title={item.title}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="Шинээр үүсгэх" key="2">
                            <Row type="flex" justify="center" align="middle">
                                <div style={{marginTop: 30}}>
                                    <Form
                                        labelCol={{ span: 10 }}
                                        wrapperCol={{ span: 14 }}
                                        size={'small'}
                                        layout="horizontal"
                                    >
                                        <Form.Item
                                            label="Зар оруулах хязгаар"
                                            name="num_recruitment"
                                        >
                                            <InputNumber
                                                style={{width: '100%'}}
                                                min={0}
                                                disabled={this.state.company === ''}
                                                onChange={(e) => this.setState({num_recruitment: e})}
                                                formatter={value => (`₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "\'"))}
                                                parser={value => value.replace(/\₮\s?|(\'*)/g, '')}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="FileSize хэмжээ / GB /"
                                            name="num_file_size"
                                        >
                                            <InputNumber
                                                style={{width: '100%'}}
                                                min={0}
                                                disabled={this.state.company === ''}
                                                onChange={(e) => this.setState({num_file_size: e})}
                                                formatter={value => (`₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "\'"))}
                                                parser={value => value.replace(/\₮\s?|(\'*)/g, '')}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Үнэ"
                                            name="cost"
                                        >
                                            <InputNumber
                                                style={{width: '100%'}}
                                                min={0}
                                                disabled={this.state.company === '' && (this.state.num_recruitment === '' || this.state.num_file_size === '')}
                                                onChange={(e) => this.setState({cost: e})}
                                                formatter={value => (`₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "\'"))}
                                                parser={value => value.replace(/\₮\s?|(\'*)/g, '')}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                            </Row>
                        </TabPane>
                    </Tabs>
                </Modal>
            </Card>
        )
    }
}


export default connect(reducer)(CompanyTransactions)