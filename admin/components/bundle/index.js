import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import {
    Tabs, Card, Button, Modal, Form, Switch, Input, Row, Col, Popconfirm, InputNumber, Radio, List, Dropdown, Avatar, Menu, Select, Spin, Table, Divider, DatePicker, Tooltip
} from 'antd';
import config from '../../config';
import { FileDoneOutlined, GiftOutlined, PlusOutlined, UsergroupAddOutlined, UserAddOutlined, DownOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { insertBundle, getBundles, handleSingleChange, setSingleBundle, changeBundleStatus } from '../../actions/bundle_actions';
import moment from 'moment';
import NumberFormat from 'react-number-format';
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

const reducer = ({bundle, main}) => ({bundle, main});
const printStaticRole = function(role){
    switch(role){
        case 'chairman' : return 'Удирдлага';
        case 'hrManager' : return 'Хүний нөөц';
        case 'employee' : return 'Ажилтан';
        default: return 'Ажилтан';
    }
};
class SystemBundle extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            createModal: false
        };
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getBundles());
    }
    handleSingleChange(e, type){
        if(e){
            let data = {};
            if(typeof e === 'string'){
                data[type] = e;
            } else if((e || [])[0]){
                data.between = data.between || {};
                data.between.start_date = (e || [])[0];
                data.between.end_date = (e || [])[1];
            } else {
                data[e.target.name] = e.target.value;
            }
            this.props.dispatch(handleSingleChange(JSON.parse(JSON.stringify(data))));
        }
    }
    createBundle(){
        let vals = this.props.bundle.singleBundle || {};
        this.props.dispatch(insertBundle({
            ...vals,
            between: {
                start_date: vals.between ? new Date(vals.between.start_date) : null,
                end_date: vals.between ? new Date(vals.between.end_date) : null,
            }
        })).then((c) => {
            if(c.json.success){
                this.setState({createModal: false})
            }
        });
    }
    changeBundleStatus(status, bundle){
        const {dispatch} = this.props;
        let bundleStatus = Object.assign(bundle, {
            id: bundle._id,
            status: status
        })
        dispatch(changeBundleStatus(bundleStatus))
    }
    handleModal(data, visible){
        this.setState({createModal: visible});
        this.props.dispatch(setSingleBundle(data))
    }
    render(){
        const {
            createModal
        } = this.state;
        const {
            dispatch,
            bundle: {
                creating,
                bundles,
                singleBundle,
                gettingBundles
            }
        } = this.props;
        const {
            type,
            title,
            desc,
            cost,
            sale,
            days,
            num_recruitment,
            num_file_size,
            between,
        } = singleBundle || {};
        return (
            <Card
                extra={[
                    <Button icon={<PlusOutlined />} onClick={() => this.handleModal({}, true)}>Багц үүсгэх</Button>
                ]}
            >
                <List
                    size={'small'}
                    itemLayout="horizontal"
                    loading={gettingBundles}
                    dataSource={bundles}
                    renderItem={item => (
                        <List.Item
                            key={item._id}
                            actions={
                                item.loading ?
                                    [
                                        <NumberFormat
                                            displayType={'text'}
                                            value={item.cost || item.sale}
                                            renderText={value => <span>{value || 0}₮</span>}
                                            thousandSeparator={true}
                                        />,
                                        <Spin />
                                    ]
                                :
                                    [
                                        <NumberFormat
                                            displayType={'text'}
                                            value={item.cost || item.sale}
                                            renderText={value => <span>{value || 0}₮</span>}
                                            thousandSeparator={true}
                                        />,
                                        <Popconfirm
                                            placement="bottomRight"
                                            title={"Багц устгах гэж байна!"}
                                            onConfirm={this.changeBundleStatus.bind(this, 'delete', item)}
                                            okText="Хасах"
                                            cancelText="Болих"
                                        >
                                            <Tooltip title={'Устгах'}>
                                                <DeleteOutlined />
                                            </Tooltip>
                                        </Popconfirm>,
                                        <div onClick={() => this.handleModal(item, true)}>
                                            <Tooltip title={'Харах'}>
                                                <EyeOutlined />
                                            </Tooltip>
                                        </div>
                                    ]
                            }
                        >
                            <List.Item.Meta
                                title={item.title}
                                description={item.desc}
                            />
                        </List.Item>
                    )}
                />
                <Modal
                    visible={createModal}
                    onOk={() => console.log()}
                    onCancel={() => this.handleModal({}, false)}
                    closable={false}
                    footer={null}
                >
                    <Row type="flex" justify="center" align="middle">
                        <div style={{marginTop: 30}}>
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 16 }}
                                size={'small'}
                                layout="horizontal"
                                onFinish={this.createBundle.bind(this)}
                            >
                                <Form.Item
                                    label="Нэр"
                                    name="title"
                                >
                                    <Input value={title} defaultValue={title} name="title" placeholder="Багц нэр" onChange={this.handleSingleChange.bind(this)}/>
                                </Form.Item>
                                <Form.Item
                                    label="Тайлбар"
                                    name="desc"
                                >
                                    <Input.TextArea value={desc} defaultValue={desc} name="desc" placeholder="Тайлбар" onChange={this.handleSingleChange.bind(this)} />
                                </Form.Item>
                                <Form.Item
                                    label="Үнэ"
                                    name="cost"
                                >
                                    <InputNumber
                                        style={{width: '100%'}}
                                        defaultValue={cost}
                                        value={cost}
                                        min={0}
                                        onChange={(e) => this.handleSingleChange(String(e), 'cost')}
                                        formatter={value => (`₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "\'"))}
                                        parser={value => value.replace(/\₮\s?|(\'*)/g, '')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Төрөл"
                                    name="type"
                                    rules={[
                                        {
                                            required: !(type),
                                            message: 'Төрөл оруулна уу!',
                                        },
                                    ]}
                                >
                                    <Select defaultValue={type} value={type} style={{ width: 120 }} onChange={(e) => this.handleSingleChange(e, 'type')}>
                                        <Option value="zarlal">Зарлал</Option>
                                        <Option value="bagtaamj">Багтаамж</Option>
                                        <Option value="semi">Хосолсон</Option>
                                    </Select>
                                </Form.Item>


                                {
                                    (type === 'zarlal' || type === 'semi') &&
                                    <Form.Item
                                        label="Зар оруулах хязгаар"
                                        name="num_recruitment"
                                        rules={[
                                            {
                                                required: !(num_recruitment),
                                                message: 'Зар оруулах хязгаар оруулна уу!',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            defaultValue={num_recruitment}
                                            value={num_recruitment}
                                            min={0}
                                            name="num_recruitment"
                                            onChange={(e) => this.handleSingleChange(String(e), 'num_recruitment')}
                                        />
                                    </Form.Item>
                                }
                                {
                                    (type === 'bagtaamj' || type === 'semi') &&
                                    <Form.Item
                                        label="FileSize хэмжээ / GB /"
                                        name="num_file_size"
                                        rules={[
                                            {
                                                required: !(num_file_size),
                                                message: 'FileSize хэмжээ оруулна уу!',
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            defaultValue={num_file_size}
                                            value={num_file_size}
                                            min={0}
                                            name="num_file_size"
                                            onChange={(e) => this.handleSingleChange(String(e), 'num_file_size')}
                                        />
                                    </Form.Item>
                                }

                                <Form.Item
                                    label="Хугацаа / өдрөөр /"
                                    name="days"
                                >
                                    <InputNumber
                                        min={0}
                                        name="days"
                                        defaultValue={days}
                                        onChange={(e) => this.handleSingleChange(String(e), 'days')}
                                    />
                                </Form.Item>

                                <Divider />

                                <Form.Item
                                    label="Хямдрал"
                                    name="sale"
                                >
                                    <InputNumber
                                        style={{width: '100%'}}
                                        name="sale"
                                        defaultValue={sale}
                                        value={sale}
                                        formatter={value => (`₮ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "\'"))}
                                        parser={value => value.replace(/\₮\s?|(\'*)/g, '')}
                                        onChange={(e) => this.handleSingleChange(String(e), 'sale')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="Хямдралын хугацаа"
                                    name="between"
                                >
                                    <RangePicker value={[moment((between || {}).start_date || moment()), moment((between || {}).end_date) || moment()]} defaultValue={[moment((between || {}).start_date || moment()), moment((between || {}).end_date || moment())]} onChange={(e) => this.handleSingleChange(e, 'between')}/>
                                </Form.Item>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <React.Fragment>
                                            <Popconfirm
                                                placement="bottomRight"
                                                title={"Та Багц үүсгэх үйлдэлээ цуцлах гэж байна!"}
                                                onConfirm={() => this.handleModal({}, false)}
                                                okText="Тийм"
                                                cancelText="Үгүй"
                                            >
                                                <Button style={{marginRight: 10}}>
                                                    Болих
                                                </Button>
                                            </Popconfirm>
                                            <Button type="primary" htmlType="submit" loading={creating}>Үүсгэх</Button>
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

export default connect(reducer)(SystemBundle)