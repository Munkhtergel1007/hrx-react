import React, {Fragment} from "react";
import { connect } from 'react-redux';
import config from "../../config";
import moment from 'moment';
import {
    PlusOutlined,
    EditFilled,
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
    Typography,
    Table,
    DatePicker
} from 'antd';
import * as depActions from "../../actions/department_actions";
import { getAllEmployees, getEmployeeStandard} from '../../actions/employee_actions'
import {SwatchesPicker} from 'react-color'
import MediaLib from "../media/MediaLib";
const reducer = ({ main, settings, department, employee }) => ({ main, settings, department, employee });

class Alba extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pageNum: 0,
            pageSize:10,
        };
        document.title = 'Тохиргоо | Алба  |  TATATUNGA';
    }
    componentDidMount() {
        this.props.dispatch(depActions.getDepartment({pageNum: this.state.pageNum, pageSize: this.state.pageSize}));
    }
    componentWillUnmount() {
        this.props.dispatch(depActions.departmentUnmount());
    }
    openModal(data) {
        this.props.dispatch(depActions.openModal(data));
    }
    closeModal() {
        this.props.dispatch(depActions.closeModal());
    }
    submitDepartment(){
        const {department:{department}} = this.props;
        if(!department.title || (department.title && department.title.trim() === '' )){
            return config.get('emitter').emit('warning', ("Хэлтсийн нэрийг оруулна уу!"));
        }
        this.props.dispatch(depActions.submitDepartment(department));
    }
    onChangeHandler(e) {
        this.props.dispatch(depActions.onChangeHandler({name:e.target.name, value: e.target.value}));
    }
    tableOnChange(data){
        const {dispatch } = this.props;
        let cc = {
            pageNum:data.current - 1,
            pageSize:this.state.pageSize,
        };
        this.setState({pageNum : data.current - 1});
        this.props.dispatch(depActions.getDepartment(cc));
    }
    render() {
        const { dispatch, main: {company}, department:{gettingDepartment, creatingDepartment, all, departments, visible, department} } = this.props;
        let pagination = {
            total : all,
            current: this.state.pageNum + 1,
            pageSize : this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false
        };
        return (
            <React.Fragment>
                    <Drawer
                        title="Алба"
                        closable={false}
                        onClose={this.closeModal.bind(this)}
                        width={360}
                        visible={visible}
                        key={'department_edit_draw'}
                    >
                        <Row justify="center" align="center">
                            <Col span={22}>
                                <Form
                                    size={'small'}
                                    layout="vertical"
                                    onFinish={this.submitDepartment.bind(this)}
                                    // fields={[
                                    //     {name: 'name', value: this.state.name},
                                    //     {name: 'desc', value: this.state.desc},
                                    // ]}
                                >
                                    <Form.Item
                                        label="Нэр"
                                        rules={[
                                            {
                                                required: department.title === '',
                                                message: 'Нэр оруулна уу!',
                                            },
                                        ]}
                                    >
                                        <Input name='title' value={department.title} onChange={this.onChangeHandler.bind(this)} placeholder="Хэлтсийн нэр" />
                                    </Form.Item>
                                    <Button
                                        style={{float: 'right'}}
                                        htmlType="button"
                                        onClick={this.closeModal.bind(this)}
                                    >
                                        Болих
                                    </Button>
                                    <Button
                                        style={{float: 'left'}}
                                        htmlType="submit"
                                        type={'primary'}
                                        loading={creatingDepartment}
                                        disabled={
                                            creatingDepartment
                                        }
                                    >
                                        {department._id ? 'Шинэчлэх' : 'Үүсгэх'}
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Drawer>
                <Row justify="center" align="center" style={{width: '100%'}} className={'settings-roles'}>
                    <Col span={22}>
                        <div style={{width: '100%', height: 30, marginBottom: 30}}>
                            <Button type='primary' onClick={this.openModal.bind(this, {})} style={{float: 'right'}} icon={<PlusOutlined />}>
                                Алба
                            </Button>
                        </div>
                        {
                            gettingDepartment ?
                                <div style={{textAlign: 'center', marginTop: 30}}>
                                    <Spin />
                                </div>
                                :
                                <Table
                                    loader={gettingDepartment}
                                    columns={[
                                        {
                                            key: 'dep_num',
                                            title: '№',
                                            width: 80,
                                            render: (text, record, idx) => (
                                                (this.state.pageNum * this.state.pageSize) + idx + 1
                                            ),
                                        },
                                        {
                                            key: 'dep_title',
                                            title: 'Нэр',
                                            render: (text, record) => (
                                                record.title ?
                                                    record.title
                                                    :
                                                    `-`
                                            ),
                                        },
                                        {
                                            key: 'dep_created',
                                            title: 'Огноо',
                                            render: (text, record, idx) => (
                                                record.created ? moment(record.created).format('YYYY-MM-DD') : '-'
                                            ),
                                        },
                                        {
                                            key: 'dep_action',
                                            title: 'Үйлдэл',
                                            render: (text, record) => (
                                                <div style={{width: 240}}>
                                                    <Button size={"small"} style={{marginRight: 10}} key={record._id+'edit'}
                                                            onClick = {this.openModal.bind(this, record )}
                                                    >
                                                        <EditFilled/> Засах
                                                    </Button>
                                                    {/*<Popconfirm*/}
                                                    {/*    title={`Та устгах гэж байна!`}*/}
                                                    {/*    onConfirm={this.delete.bind(this, record._id)}*/}
                                                    {/*    okText="Усгах"*/}
                                                    {/*    placement="left"*/}
                                                    {/*    cancelText="Болих"*/}
                                                    {/*>*/}
                                                    {/*    <Button type={"primary"} key={record._id} danger size={"small"} loading={!!record.loading}>*/}
                                                    {/*        <DeleteFilled/> Устгах*/}
                                                    {/*    </Button>*/}
                                                    {/*</Popconfirm>*/}
                                                </div>
                                            ),
                                            width: 240
                                        },
                                    ]}
                                    dataSource={departments}
                                    pagination={pagination}
                                    onChange={this.tableOnChange.bind(this)}
                                />
                        }
                    </Col>
                </Row>
            </React.Fragment>
        );
    }
}

export default connect(reducer)(Alba);