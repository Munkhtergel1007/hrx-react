import React, { Fragment } from 'react';
import {connect} from 'react-redux';
import {
    Tabs, Card,
    Button, Popconfirm,
    Select,Table,
    DatePicker, Tag, Empty
} from 'antd';
import config, {uuidv4} from '../../config';
import { FileDoneOutlined, CloseCircleOutlined, CheckCircleOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import {getCompanyRequests, changeCompanyReqStatus} from "../../actions/company_actions";
const reducer = ({compTrans, main, company, bundle, compReqs}) => ({compTrans, main, company, bundle, compReqs});

class CompanyRequests extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            pageNum: 0,
            pageSize: 20,
            status: 'all'
        }
    }
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(getCompanyRequests({pageSize: this.state.pageSize, pageNum: this.state.pageNum, status: this.state.status}));
    }
    changeCompanyReqStatus(status, company) {
        const {dispatch} = this.props;
        let companyReqStatus = Object.assign(company, {
            id: company._id,
            status: status
        })
        dispatch(changeCompanyReqStatus(companyReqStatus))
    }
    paginationChangeHandler(e) {
        this.setState({pageNum: e.current - 1})
        this.props.dispatch(getCompanyRequests({pageSize: this.state.pageSize, pageNum: e.current - 1, status: this.state.status}))
    }
    filter(e) {
        this.setState({status: e})
        this.props.dispatch(getCompanyRequests({pageSize: this.state.pageSize, pageNum: e.current - 1, status: e}))
    }
    render() {
        const {
            requests,
            gettingReqs,
            all
        } = this.props.compReqs;
        let pagination = {
            total: all,
            current: this.state.pageNum + 1,
            pageSize: this.state.pageSize,
            position: 'bottom',
            showSizeChanger: false
        }
        const columns = [
            {
                title: '№',
                render: (text, record, idx) => (this.state.pageNum * this.state.pageSize) + idx + 1
            },
            {
                title: 'Овог нэр',
                render: (text, record) => `${record.lord?.user?.last_name} ${record.lord?.user?.first_name}`
            },
            {
                title: 'И-мэйл',
                render: (text, record) => record.lord?.user?.email
            },
            {
                title: 'Утас',
                render: (text, record) => record.lord?.user?.phone
            },
            {
                title: 'Байгууллага',
                render: (text, record) => record.name
            },
            {
                title: 'Хаяг',
                render: (text, record) => record.domain
            },
            {
                title: 'Огноо',
                render: (text, record) => moment(record.created).format('YYYY/MM/DD hh:mm')
            },
            {
                title: 'Төлөв',
                render: (record) => (
                    <Tag color={record.status === 'disapprove' ? 'red' : 'gray'}>
                        {record.status ? record.status.charAt(0).toUpperCase() + record.status.slice(1) : 'Pending'}
                    </Tag>
                )
            },
            {
                title: '',
                render: (record) => {
                    return <div>
                        <Popconfirm
                            title={'Зөвшөөрөх үү?'}
                            okText={'Тийм'}
                            cancelText={'Үгүй'}
                            onConfirm={this.changeCompanyReqStatus.bind(this, 'active', record)}
                        >
                            <Button
                                style={{marginRight: '10px'}}
                                type='primary'
                                icon={<CheckCircleOutlined/>}
                            />
                        </Popconfirm>
                        {
                            record.status !== 'disapprove' ?
                                <Popconfirm
                                    title={'Татгалзах уу?'}
                                    okText={'Тийм'}
                                    cancelText={'Үгүй'}
                                    onConfirm={this.changeCompanyReqStatus.bind(this, 'disapprove', record)}
                                >
                                    <Button
                                        icon={<CloseCircleOutlined/>}
                                        danger
                                    />
                                </Popconfirm>
                                :
                                null
                        }
                    </div>;
                }
            }
        ];
        return (
            <Card loading={gettingReqs} title={'Компани'}>
                <Select value={this.state.status} onSelect={(e) => this.setState({status: e})} style={{width: 500}}>
                    <Select.Option value={'all'} key={'all'}>Бүгд</Select.Option>
                    <Select.Option value={'pending'} key={'pending'}>Хүлээгдэж буй</Select.Option>
                    <Select.Option value={'disapprove'} key={'disapprove'}>Татгалзсан</Select.Option>
                </Select>
                <Button
                    icon={<SearchOutlined/>} type={'primary'}
                    onClick={() => this.setState({pageNum: 0}, () =>
                        this.props.dispatch(getCompanyRequests({pageSize: this.state.pageSize, pageNum: this.state.pageNum, status: this.state.status})))}
                />
                {
                    (requests || []).length > 0 ?
                        <Table
                            dataSource={requests}
                            columns={columns}
                            pagination={pagination}
                            onChange={this.paginationChangeHandler.bind(this)}
                        />
                        :
                        <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Хайлтын илэрц олдсонгүй.</span>} />
                }
            </Card>
        )
    }
}


export default connect(reducer)(CompanyRequests)