import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config, {
    uuidv4
} from "../../config";
import NumberFormat from 'react-number-format';
import moment from 'moment';
import {
    PlusOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import {
    Layout,
    Menu,
    Button,
    Spin,
    Row,
    Col,
    Drawer,
    Typography,
    Popconfirm,
    Empty,
    List,
    Table,
    Avatar,
    DatePicker,
} from 'antd';
import {
    getBundles,
    createCharge,
    getCharges,
} from '../../actions/settings_actions';
import {SwatchesPicker} from 'react-color'
import MediaLib from "../media/MediaLib";
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Charges extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            bundle: {},
            visible: false
        };
        document.title = 'Тохиргоо | Цэнэглэлт  |  TATATUNGA';
    }
    componentDidMount() {
        this.props.dispatch(getCharges());
    }
    createCharge(){
        let bundle = this.state.bundle._id;
        if(bundle === ''){
            config.get('emitter').emit('error', 'Багц сонгоно уу!');
        } else {
            this.props.dispatch(createCharge({bundle: bundle})).then((c) => {
                if(c.json.success){
                    this.setState({bundle: {}, visible: false});
                }
            });
        }
    }
    render() {
        const { dispatch, main: {company}, settings: { bundles, gettingBundles, requestingBundle, gettingCharges, requests } } = this.props;
        const printStatus = (status) => {
            switch(status){
                case 'pending':
                    return 'Хүлээгдэж буй';
                case 'active':
                    return 'Цэнэглэгдсэн';
                case 'cancel':
                    return 'Цуцлагдсан';
                default: return '-';
            }
        };
        return (
            <React.Fragment>
                <Row justify="center" align="center" style={{width: '100%'}} className={'settings-roles'}>
                    <Col span={22}>
                        <div style={{width: '100%', height: 30, marginBottom: 30}}>
                            <Button type='primary' onClick={() => this.setState({visible: true})} style={{float: 'right'}} icon={<PlusOutlined />}>
                                Цэнэглэх
                            </Button>
                        </div>
                        {
                            gettingCharges ?
                                <div style={{textAlign: 'center', marginTop: 30}}>
                                    <Spin />
                                </div>
                            : requests.length > 0 ?
                                <Table
                                    columns={[
                                        {
                                            title: '№',
                                            key: '№',
                                            width: 40,
                                            render: (text, record, index) => index + 1
                                        },
                                        {
                                            title: 'Багц',
                                            key: 'Багц',
                                            render: (text, record) => (record.type || {}).title || '-'
                                        },
                                        {
                                            title: 'Зарлал /ш/',
                                            key: 'Зарлал /ш/',
                                            align: 'center',
                                            render: (text, record) => (record.type || {}).num_recruitment > 0 ? (record.type || {}).num_recruitment + 'ш' : '-'
                                        },
                                        {
                                            title: 'Файл хэмжээ /GB/',
                                            key: 'Файл хэмжээ /GB/',
                                            align: 'center',
                                            render: (text, record) => (record.type || {}).num_file_size > 0 ? (record.type || {}).num_file_size + 'GB' : '-'
                                        },
                                        {
                                            title: 'Огноо',
                                            key: 'Огноо',
                                            render: (text, record) => moment(record.created).format('YYYY/MM/DD hh:mm')
                                        },
                                        {
                                            title: 'Төлөв',
                                            key: 'Төлөв',
                                            render: (text, record) =>
                                                <span style={{
                                                    border: 'none',
                                                    background: (
                                                        record.status === 'cancel' ?
                                                            '#BF708C'
                                                        : '#fbfbfb'
                                                    ),
                                                    color: (record.status === 'cancel' ? '#fbfbfb' : record.status === 'active' ? 'green' : 'initial'),
                                                    padding: '1px 10px',
                                                    borderRadius: '5px',
                                                    fontSize: '14px',
                                                }}>
                                                    {printStatus(record.status)}
                                                </span>
                                        },
                                        {
                                            title: 'Хүсэлт илгээсэн',
                                            key: 'Хүсэлт илгээсэн',
                                            render: (text, record) => {
                                                let usr = (record.employee || {}).user || {};
                                                return (
                                                    <div>
                                                        <Avatar src={(usr.avatar || {}).path || '/images/default-avatar.png'} size={17}/>
                                                        <span style={{marginLeft: 10}}>{(usr.first_name || '').charAt(0).toUpperCase()}. {usr.last_name}</span>
                                                    </div>
                                                );
                                            }
                                        }
                                    ]}
                                    dataSource={requests}
                                    pagination={false}
                                />
                            : <Empty />
                        }
                    </Col>
                </Row>
                <Drawer
                    title="Цэнэглэлт хүсэлт илгээх"
                    closable={false}
                    onClose={() => this.setState({visible: false, bundle: {}})}
                    width={720}
                    visible={this.state.visible}
                    key={'Цэнэглэлт-үүсгэх'}
                    afterVisibleChange={(visible) => visible && bundles.length === 0 && !gettingBundles ? dispatch(getBundles()) : false}
                >
                    {
                        gettingBundles ?
                            <div style={{textAlign: 'center', marginTop: 30}}>
                                <Spin/>
                            </div>
                        : bundles.length > 0 ?
                            <List
                                className={'bundle-items'}
                                dataSource={bundles}
                                renderItem={item => (
                                    <List.Item key={uuidv4()} className={(this.state.bundle._id === item._id ? 'active' : '')} onClick={() => this.setState({bundle: item})}>
                                        <List.Item.Meta
                                            title={item.title}
                                            description={item.desc}
                                        />
                                        <NumberFormat value={item.sale || item.cost} displayType={'text'} renderText={value => `${value}₮`} thousandSeparator={true}/>
                                        {this.state.bundle._id === item._id && <CheckCircleOutlined style={{color: '#bf4b66', marginLeft: 10}}/>}
                                    </List.Item>
                                )}
                            />
                        : <Empty />
                    }
                    <div style={{marginTop: 30, marginBottom: 30}}>
                        <Button
                            style={{float: 'right'}}
                            htmlType="button"
                            onClick={() => this.setState({visible: false, bundle: ''})}
                        >
                            Болих
                        </Button>
                        <Popconfirm placement="topLeft" title={<span>
                            Та "{<NumberFormat value={this.state.bundle.sale || this.state.bundle.cost} displayType={'text'} renderText={value => <b>{value}₮</b>} thousandSeparator={true}/>}" - ийн цэнэглэлт хийх гэж байна!
                        </span>} onConfirm={this.createCharge.bind(this)} okText="Илгээх" cancelText="Болих">
                            <Button
                                style={{float: 'left'}}
                                type={'primary'}
                                loading={requestingBundle}
                                disabled={
                                    !this.state.bundle._id || requestingBundle
                                }
                            >
                                Цэнэглэлт хүсэлт илгээх
                            </Button>
                        </Popconfirm>
                    </div>
                </Drawer>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Charges);