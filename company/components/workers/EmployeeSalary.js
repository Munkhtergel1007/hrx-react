import React from "react";
import {Button, Col, Divider, Row, Select, Tag, DatePicker, Table} from "antd";
import {getSalaryEmp} from '../../actions/employee_actions';
import {connect} from 'react-redux'
import moment from 'moment'
const {Option} = Select;

const reducer = ({main, employee}) => ({main, employee});

class EmployeeSalary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: moment(),
            end: moment(),
        };
    }
    componentDidMount() {
        const {employee: {empSingle}} = this.props;
        this.props.dispatch(getSalaryEmp({start: moment(this.state.start).format('YYYY-MM'), end: moment(this.state.end).format('YYYY-MM'), _id: empSingle._id}));
    }
    changeDuration(e){
        const {employee: {empSingle}} = this.props;
        this.setState({start: e[0], end: e[1]}, () => {
            this.props.dispatch(getSalaryEmp({start: moment(this.state.start).format('YYYY-MM'), end: moment(this.state.end).format('YYYY-MM'), _id: empSingle._id}));
        });
    }
    render() {
        const {main: {employee}, employee: {gettingSalaries, salaries}} = this.props;
        let format = 'YYYY-MM';
        let columns = [
            {
                key: '№',
                title: 'Сар',
                dataIndex: 'year_month',
                fixed: 'left',
                align: 'center',
                render: (record) => moment(record).format(format)
            },
            {
                key: 'initial_salary',
                title: 'Үндсэн цалин',
                dataIndex: 'initial_salary',
                align: 'center',
                fixed: 'left',
            },
            {
                key: 'bonus',
                title: 'Нэмэгдэл',
                align: 'center',
                children: [
                    {
                        key: 'nemegdel',
                        title: 'Нэмэгдэл',
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'nemegdel' ? (ad || {}).amount || 0 : null)
                    },
                    {
                        key: 'uramshuulal',
                        title: 'Урамшуулал',
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'uramshuulal' ? (ad || {}).amount || 0 : null)
                    },
                    {
                        key: 'iluu_tsagiin_huls',
                        title: 'Илүү цагийн хөлс',
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'iluu_tsagiin_huls' ? (ad || {}).amount || 0 : null)
                    },
                    {
                        key: 'bonus_busad',
                        title: 'Бусад',
                        align: 'center',
                        render: (record) => (record.add || []).map(ad => ad.type === 'busad' ? (ad || {}).amount || 0 : null)
                    },

                ]
            },
            {
                key: 'fine',
                title: 'Суутгал',
                align: 'center',
                children: [
                    {
                        key: 'n_d_sh',
                        title: 'НДШ',
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'n_d_sh' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'h_h_o_a_t',
                        title: 'ХХОАТ',
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'h_h_o_a_t' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'hotsrolt',
                        title: 'Хоцролт',
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'hotsrolt' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'taslalt',
                        title: 'Таслалт',
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'taslalt' ? (su || {}).amount || 0 : null)
                    },
                    {
                        key: 'fine_busad',
                        title: 'Бусад',
                        align: 'center',
                        render: (record) => (record.sub || []).map(su => su.type === 'busad' ? (su || {}).amount || 0 : null)
                    },

                ]
            },
            {
                key: 'total',
                title: 'Нийт',
                align: 'center',
                render: (record) => {
                    let sum = record.initial_salary || 0;
                    (record.add || []).map(ad => {
                        sum += ad.amount || 0
                    });
                    (record.sub || []).map(su => {
                        sum -= su.amount || 0
                    });
                    return sum;
                },
                fixed: 'right',
            }
        ];

        return (
            <Row justify="center" align="center" style={{width: '100%'}}>
                <Col span={20}>
                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16}}>Цалин</b>
                        </Divider>
                    </div>
                    <DatePicker.RangePicker
                        allowClear={false}
                        picker={'month'}
                        value={[this.state.start, this.state.end]}
                        onChange={(e) => this.changeDuration(e)}
                        disabled={gettingSalaries}
                        format={format}
                        placeholder={['Эхлэх хугацаа', 'Дуусах хугацаа']}
                        style={{marginBottom: 20}}
                    />
                    <Table
                        rowKey={(record) => {return record._id}}
                        loading={gettingSalaries}
                        columns={columns}
                        locale={{emptyText: 'Хоосон байна'}}
                        dataSource={salaries}
                        sticky
                        bordered
                        pagination={false}
                        scroll={{x: 2000}}
                        expandable={{
                            rowExpandable: (record) => (record.add || []).some(ad => (ad.description && ad.description !== ''))
                                || (record.sub || []).some(su =>(su.description && su.description !== '')),
                            expandedRowRender: (record) =>
                                <Row gutter={[20]}>
                                    <Col span={12}>
                                        <b style={{display: 'block', textAlign: 'center'}}>Нэмэгдэл</b>
                                        {(record.add || []).map(ad => ad.type === 'busad' ? (ad || {}).description || '' : null)}
                                    </Col>
                                    <Col span={12}>
                                        <b style={{display: 'block', textAlign: 'center'}}>Суутгал</b>
                                        {(record.sub || []).map(su => su.type === 'busad' ? (su || {}).description || '' : null)}
                                    </Col>
                                </Row>
                        }}
                    />
                </Col>
            </Row>
        )
    }
}

export default connect(reducer)(EmployeeSalary)