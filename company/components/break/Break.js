import React, {Component} from "react";
import { connect } from 'react-redux';
import config, {hasAction, printStaticRole} from "../../config";
import moment from "moment";
import {
    getAllBreak,
    editEmpBreak,
} from "../../actions/break_actions";
import { Link } from 'react-router-dom';

const reducer = ({ main, breaks }) => ({ main, breaks });
import {Card, Button, Table, Popconfirm, Tag, Input, Badge, Select, List, Row, Col, Typography, Slider, Progress, Tooltip} from 'antd';
const { Title, Paragraph } = Typography;
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import {locale} from '../../lang'

class Break extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: null,
            type: '',
            pageSize: 10,
            page: 0
        };
    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        if(!hasAction(['deal_with_break'], employee)){
            this.props.history.replace('/not-found');
        }else{
            this.props.dispatch(getAllBreak({pageSize: this.state.pageSize, page: this.state.page}));
        }
    }
    paginationChangeHandler(e) {
        this.setState({page: e.current - 1})
        this.props.dispatch(getAllBreak({pageSize: this.state.pageSize, page: e.current-1}))
    }
    respondToRequest(str, id){
        let {main: {employee}} = this.props;
        this.props.dispatch(editEmpBreak({emp: employee._id, id: id, status: str, pageSize: this.state.pageSize, page: this.state.page}))
    }

    render() {
        let {  main:{user, employee}, breaks: {breaks, all} } = this.props;

        function getStatus(stat) {
            let result = "";
            switch (stat) {
                case "pending":
                    result = locale('common_break.huleegdej_bui');
                    break;
                case "approved":
                    result = locale('common_break.zuwshuurugdsun');
                    break;
                case "declined":
                    result = locale('common_break.zuwshuurugduugui');
                    break;
                default:
                    result = "";
            }
            return (
                <Tag
                    color={
                        stat === "declined"
                            ? "error"
                            : stat === "approved"
                            ? "success"
                            : "default"
                    }
                >
                    {result}
                </Tag>
            );
        }
        let pagination = {
            total : all,
            current: this.state.page+1,
            pageSize : this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false
        };
        const columns = [
            {
                title: "№",
                key: "index",
                render: (text, record, idx) =>
                    (breaks || []).findIndex(elem => {
                        return elem.created === record.created;
                    }) + 1,
            },
            {
                title: locale('common_break.ner'),
                key: 'name',
                render: (record) => <p style={{marginBottom: '0'}}>{record.employee.user.last_name} {record.employee.user.first_name}</p>
            },
            {
                title: locale('common_break.shaltgaan'),
                key: "reason",
                dataIndex: "reason",
                width: "300px",
                render: record => (
                    <Tooltip
                        title={record}
                    >
                        {record}
                    </Tooltip>
                ),
            },
            {
                title: locale('common_break.ehleh_ognoo'),
                key: "starting_date",
                width: "125px",
                render: record => record.type === 'hour' ? moment(record.starting_date).format("YYYY-MM-DD HH:mm:ss") : moment(record.starting_date).format("YYYY-MM-DD"),
            },
            {
                title: locale('common_break.duusah_ognoo'),
                key: "ending_date",
                width: "125px",
                render: record => record.type === 'hour' ? moment(record.ending_date).format("YYYY-MM-DD HH:mm:ss") : moment(record.ending_date).format("YYYY-MM-DD"),
            },
            {
                title: locale('common_break.tsalin_awah_udur'),
                key: "numberOfDaysPaid",
                width: "125px",
                dataIndex: "howManyDaysPaid",
            },
            {
                title: locale('common_break.ywuulsan_hugatsaa'),
                key: "created",
                width: "125px",
                dataIndex: "created",
                render: record => moment(record).format("YYYY-MM-DD"),
            },
            {
                title: locale('common_break.hariu'),
                key: "status",
                width: '150px',
                dataIndex: "status",
                render: record => getStatus(record),
            },
            {
                key: "actions",
                width: "110px",
                render: record =>
                    record.status === 'pending' ?
                        <div>
                            <Popconfirm
                                title= {locale('common_break.huseltiig_zuwshuuruh_uu')}
                                visible={this.state.key === record._id && this.state.type === 'approve'}
                                onCancel={() => this.setState({key: null, type: ''})}
                                onConfirm={() => this.respondToRequest('approved', record._id)}
                                cancelText={locale('common_break.bolih')}
                                okText={locale('common_break.zuwshuuruh')}
                            >
                                <Button onClick={() => this.setState({key: record._id, type: 'approve'})} shape='circle' type='primary' icon={<CheckCircleOutlined />} />
                            </Popconfirm>
                            <Popconfirm
                                title={locale('common_break.huseltiig_tsutslah_uu')}
                                visible={this.state.key === record._id && this.state.type === 'decline'}
                                onCancel={() => this.setState({key: null, type: ''})}
                                onConfirm={() => this.respondToRequest('declined', record._id)}
                                cancelText={locale('common_break.bolih')}
                                okText={locale('common_break.tsutslah')}
                            >
                                <Button onClick={() => this.setState({key: record._id, type: 'decline'})} shape='circle' type='danger' icon={<CloseCircleOutlined />} />
                            </Popconfirm>
                        </div>
                        :
                        null
            },
        ];
        return (
            <Card
                title={locale('common_break.chuluu_awah_huseltuud')}
            >
                <Table dataSource={breaks} columns={columns} rowKey={(record)=> record._id}
                       expandable={{
                           expandedRowRender: record =>
                               <p style={{ margin: 0 }}>
                                   <b>{locale('common_break.hen_huseltiig')} {record.status === 'approved' ? locale('common_break.zuwshuursun') : locale('common_break.tsutsalsan')}</b>
                                   {record.approved_by.user.last_name} {record.approved_by.user.first_name}({printStaticRole(record.approved_by.emp.staticRole)})
                               </p>,
                           rowExpandable: record => record.status !== 'pending',
                       }}
                       onChange={this.paginationChangeHandler.bind(this)}
                       pagination={pagination}
                />
            </Card>
        );
    }
}

export default  connect(reducer)(Break);