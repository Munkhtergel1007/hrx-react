import React from 'react'
import {connect} from 'react-redux'
import {Button, Calendar, Form, Input, Modal, Space, TimePicker, Typography} from "antd";
import moment from "moment";
import {isValidDate, msg} from '../../config'
const {Title, Text} = Typography
import * as actions from "../../actions/attendance_actions";
import {locale} from '../../lang';
class AttendanceModal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            localTime: props.time || moment((`${props.localTime}:08:00:00`)),
            reason: props.reason || ''
        }
    }
    submitLocalTime(vals) {
        if(!this.state.localTime) {
            return msg('error', locale('common_attendance.tsag_songono_uu'))
        } else if(this.state.localTime && !isValidDate(this.state.localTime)) {
            return msg('error', locale('common_attendance.tsag_shalgana_uu'))
        } else {
            this.props.dispatch(actions.editAttendance({
                id: this.props.id,
                editting: this.props.editting,
                localTime: moment(this.state.localTime).toDate(),
                reason: this.state.reason,
                employee: this.props.employee,
                user: this.props.user,
                timetable: this.props.timetable
            })).then(c => {
                if(c.json.success){
                    this.props.handleCancel()
                }
            })
        }
    }
    getListData(value, startDate, endDate) {
        let listData;
        const {
            dates
        } = this.props
        let endVacDate = new Date(endDate)
        // if(value >= startDate && value < endVacDate.addDays(1)) {
        dates.some((c) => moment(c).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) ?
            listData = [
                {type: 'yes'}
            ]
            : listData = [
                {type: 'no'}
            ]
        // }
        return listData || []
    }
    disabledCalendarDate(start, end, current) {
        return (current < start) || (current > end)
    }
    dateFullCellRender(value, startDate, endDate) {
        const listData = this.getListData(value, startDate, endDate)
        let style = {
            backgroundColor: '#1A3452',
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            display: 'inline-flex',
            // lineHeight: 24,
            color: '#fff',
            paddingInline: '13px',
            margin: '5px',
            // display: 'inline-block',
            position: 'relative'
        }
        let style1 = {
            // backgroundColor: '#1A3452',
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            display: 'inline-flex',
            paddingInline: '13px',
            // lineHeight: 24,
            // color: '#fff',
            margin: '5px',
            // display: 'inline-block',
            position: 'relative'
        }
        return (
            listData.map(item => (
                <div style={item.type === 'yes' ? style : style1} >
                    {moment(value).format('DD')}
                </div>
            ))
        )
    }
    componentWillUnmount() {
        this.setState({localTime: null})
    }

    render() {
        return (
            <Modal
                title={this.props.name}
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
                footer={this.props.type !== 'vacation' && this.props.type !== 'break' ? [
                    <Button
                        type='default'
                        onClick={this.props.handleCancel}
                        // style={{marginRight: 10}}
                    >
                        Болих
                    </Button>,
                    <Button
                        htmlType='submit'
                        type='primary'
                        form='editLocalTime'
                        disabled={!isValidDate(this.state.localTime)}
                    >
                        Оруулах
                    </Button>
                ]:
                null}
            >
                {this.props.type === 'vacation' ?
                    <Space
                        direction='vertical'
                    >
                        <Title level={5}>Амрах өдрүүд</Title>
                        <Calendar
                            defaultValue={moment(this.props.start_date)}
                            fullscreen={false}
                            dateFullCellRender={(e) => this.dateFullCellRender(e, moment(this.props.start_date), moment(this.props.end_date))}
                            disabledDate={this.disabledCalendarDate.bind(this, moment(this.props.start_date), moment(this.props.end_date))}
                        />
                    </Space>
                    : this.props.type === 'break' ?
                        <Space
                            direction='vertical'
                        >
                            <Title level={5}>Чөлөө авсан шалтгаан</Title>
                            <Text>{this.props.reason}</Text>
                            <Title level={5}>Чөлөө авсан өдрүүд</Title>
                            <Text>
                                {
                                    this.props.breakType === 'hour' ?
                                        `${moment(this.props.dates[0]).format('YYYY-MM-DD')} өдрийн ${moment(this.props.dates[0]).format('HH:mm:ss')} цагаас
                                        ${moment(this.props.dates[1]).format('HH:mm:ss')}`
                                        :
                                        `${moment(this.props.dates[0]).format('YYYY-MM-DD')}-${moment(this.props.dates[1]).format('YYYY-MM-DD')}`
                                }
                            </Text>
                            {
                                this.props.breakType !== 'hour' ?
                                    <>
                                        <Title level={5}>Цалинтай өдөр</Title>
                                        <Text>{this.props.paidDays}</Text>
                                    </>
                                    :
                                    null
                            }
                        </Space>
                        :
                        <div>
                            <p><b>Сонгосон өдөр:</b> {moment(this.props.localTime).format('YYYY/MM/DD')}</p>
                            <Form
                                layout='vertical'
                                id='editLocalTime'
                                fields={[
                                    // {name: 'localTime', value: this.props.localTime && moment(this.props.localTime)},
                                    // {name: 'reason', value: this.props.reason}
                                ]}
                                onFinish={this.submitLocalTime.bind(this)}
                            >
                                <Form.Item
                                    label='Цаг'
                                    // name='localTime'
                                >
                                    <TimePicker
                                        name='localTime'
                                        // defaultValue={this.props.time}
                                        value={this.state.localTime}
                                        format='HH:mm'
                                        placeholder='Цаг'
                                        onChange={(e, time) => this.setState({
                                            localTime: moment(`${this.props.localTime}T${time}:00+08:00`)
                                        })}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Шалтгаан'
                                    // name='reason'
                                >
                                    <Input.TextArea
                                        name='reason'
                                        value={this.state.reason ? this.state.reason : ''}
                                        // defaultValue={this.state.reason ? this.state.reason : ''}
                                        onChange={(e) => this.setState({
                                            reason: e.target.value
                                        })}
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                }
            </Modal>
        )
    }
}

export default AttendanceModal