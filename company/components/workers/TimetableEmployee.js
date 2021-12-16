import React from "react";
import {Col, Form, Row, Divider, Empty, Select, Button, Drawer, Popconfirm} from "antd";
import {connect} from 'react-redux'
import config, {
    uuidv4,
    hasAction,
    isValidDate,
    printMnDay
} from "../../config";
import { EditOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getTimetables } from "../../actions/settings_actions";
import {getEmployeeTimetable, changeEmployeeTimetable} from "../../actions/employee_actions";
const reducer = ({main, employee}) => ({main, employee});

class TimetableEmployee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            timetable: ''
        };
    }
    componentDidMount(){
        const {main: {employee}} = this.props;
        // console.log(empSingle.timetable)
        // this.props.dispatch(getEmployeeTimetable({_id: empSingle.timetable}));
        if(hasAction(['deal_with_timetable'], employee) ){
            this.props.dispatch(getTimetables({pageSize: 10, pageNum: 0}));
        }
    }
    clear(){
        this.props.dispatch(getTimetables({pageSize: 10, pageNum: 0}));
        this.setState({
            ...this.state,
            timetable: '',
            visible: false
        })
    }
    search(e){
        const {dispatch} = this.props;
        clearTimeout(this.state.timeOut);
        let timeOut = setTimeout(function(){
            dispatch(getTimetables({search: e}));
        }, 300);
        this.setState({...this.state, timeOut: timeOut, search: e})
    }
    deleteEmployeeTimetable(){
        const { main: {employee}, empSingle} = this.props;
        this.props.dispatch(changeEmployeeTimetable({employeeId: empSingle._id, deleteTim: true}));
        this.clear();
    }
    changeEmployeeTimetable(){
        const { main: {employee}, empSingle} = this.props;
        if(!this.state.timetable || this.state.timetable === ''){
            return config.get('emitter').emit('warning', ("Цагийн хуваарь сонгоно уу."));
        }
        this.props.dispatch(changeEmployeeTimetable({timetableId: this.state.timetable, employeeId: empSingle._id}));
        this.clear();
    }
    render(){
        const { main: {employee}, employee: {empSingle, gettingTimetable, timetables}} = this.props;
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        let timetable = (empSingle.timetable || {});
        function getTable(passed) {
            return (
                <div>
                    <b>{(passed || {}).title}</b>
                    <table border={'1px solid black'} style={{marginBottom: 5}}>
                        <thead>
                        <tr>
                            <td />
                            {days.map(day => <td style={{padding: '10px 0'}}><p style={{writingMode: 'vertical-rl', textAlign: 'right', marginBottom: 0}}>{printMnDay(day)}</p></td>)}
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Эхлэх цаг</td>
                            {
                                days.map(day =>
                                    ((passed || {}).days || []).some(itm =>
                                        itm.title === day
                                    ) ?
                                        <td style={{textAlign: 'center'}}>
                                            {
                                                ((passed || {}).days || []).map(itm =>
                                                    itm.title === day ? itm.startingHour : null
                                                )
                                            }
                                        </td>
                                        :
                                        <td rowSpan={2} style={{padding: '10px 0'}}><p style={{writingMode: 'vertical-rl', textAlign: 'right', marginBottom: 0}}>Амрана</p></td>
                                )
                            }
                        </tr>
                        <tr>
                            <td>Дуусах цаг</td>
                            {
                                days.map(day =>
                                    ((passed || {}).days || []).some(itm =>
                                        itm.title === day
                                    ) ?
                                        <td style={{textAlign: 'center'}}>
                                            {
                                                ((passed || {}).days || []).map(itm =>
                                                    itm.title === day ? itm.endingHour : null
                                                )
                                            }
                                        </td>
                                        :
                                        null
                                )
                            }
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
        return (
            <Row justify="center" align="center" style={{width: '100%'}} className={'emp-anket'}>
                <Col span={20}>
                    <div style={{margin: '50px auto 30px'}}>
                        <Divider orientation="left" plain>
                            <b style={{fontSize: 16, display: 'block'}}>Цагийн хуваарь</b>
                        </Divider>
                        {
                            Object.keys(timetable).length !== 0 ?
                                <div style={{float: 'right'}}>
                                    <Popconfirm
                                        title={`Цагийн хуваариас хасах уу?`}
                                        onConfirm={this.deleteEmployeeTimetable.bind(this)}
                                        okText="Тийм"
                                        cancelText="Үгүй"
                                    >
                                        <Button style={!hasAction(['deal_with_timetable'], employee) ? {display: 'none'} : null} type='danger' icon={<DeleteOutlined/>}>
                                            Устгах
                                        </Button>
                                    </Popconfirm>
                                    <Button style={!hasAction(['deal_with_timetable'], employee) ? {display: 'none'} : { marginLeft: 10}}
                                            onClick={() => this.setState({...this.state, visible: true, timetable: ((timetable || {})._id || '')})} type='primary'
                                            icon={<EditOutlined/>}
                                    >
                                        Өөрчлөх
                                    </Button>
                                </div>
                                :
                                <div style={{float: 'right'}}>
                                    <Button style={!hasAction(['deal_with_timetable'], employee) ? {display: 'none'} : { marginLeft: 10}}
                                            onClick={() => this.setState({...this.state, visible: true, timetable: ((timetable || {})._id || '')})} type='primary'
                                            icon={<PlusOutlined />}
                                    >
                                        Цагийн хуваарь
                                    </Button>
                                </div>
                        }
                        <div style={{clear: 'both'}} />
                        { Object.keys((timetable || {})).length !== 0 ?
                            getTable(timetable)
                            :
                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Цагийн хуваарь байхгүй байна.</span>} />
                        }
                    </div>
                </Col>
                <Drawer
                    title={'Ажилтанд цагийн хуваарь оноох'}
                    visible={this.state.visible}
                    onClose={this.clear.bind(this)}
                    width={720}
                    closable={false}
                    footer={
                        <div style={{textAlign: 'right'}}>
                            <Button onClick={this.clear.bind(this)} style={{marginRight: 20}}>Болих</Button>
                            <Button type='primary' disabled={this.state.timetable === '' || (timetable && timetable._id === this.state.timetable) }
                                    onClick={this.changeEmployeeTimetable.bind(this)}
                            >
                                Хадгалах
                            </Button>
                        </div>
                    }
                >
                    <Select
                        placeholder="Цагийн хуваарь"
                        onSelect={(e) => this.setState({...this.state, timetable: e})}
                        showSearch={true}
                        value={this.state.timetable}
                        filterOption={false}
                        notFoundContent={'Цагийн хуваарь олдсонгүй'}
                        onSearch={this.search.bind(this)}
                        style={{ width: '50%', marginBottom: 20 }}
                        disabled={!hasAction(['deal_with_timetable'], employee)}
                        loading={gettingTimetable}
                    >
                        {timetables.map(time => <Select.Option key={time._id} value={time._id}>{time.title}</Select.Option>)}
                    </Select>
                    {
                        this.state.timetable !== '' ?
                            timetables.some(time => time._id === this.state.timetable) ?
                                (timetables || []).map(tim =>
                                    (tim._id || {}).toString() === this.state.timetable ?
                                        getTable(tim)
                                        :
                                        null
                                )
                                :
                                getTable(timetable)
                            :
                            null
                    }
                </Drawer>
            </Row>
        )
    }
}

export default connect(reducer)(TimetableEmployee)