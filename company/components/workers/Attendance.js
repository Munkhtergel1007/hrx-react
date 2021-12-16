import React from "react";
import config, {
  formattedActionsArray,
  hasAction,
  isValidDate,
  uuidv4,
  msg
} from "../../config";
import { locale } from "../../lang";
import {
  Button, Card, Col,
  Divider, Row, Select,
  Table, Tag, Drawer,
  DatePicker, Form, Input,
  TimePicker, InputNumber,
  Typography, Popconfirm,
  Calendar, Modal, Empty,
  Space, Tooltip
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  createBreak,
  getSingleEmpBreak,
  deleteBreak,
  getVacation,
  editBreak,
  submitSelectedDays
} from "../../actions/employee_actions";
const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;
const { Paragraph, Text, Title } = Typography;
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CloseCircleOutlined, CheckCircleOutlined, CloseCircleFilled, CheckCircleFilled
} from "@ant-design/icons";
const reducer = ({ main, employee, settings }) => ({
  main,
  employee,
  settings,
});

Date.prototype.addDays = function(days) {
  var date = new Date(this.valueOf())
  date.setDate(date.getDate() + days)
  return date
}

class EmployeeAttendanceComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      starting_date: "",
      ending_date: "",
      selected_date: '',
      selected_starting_hour: '',
      selected_ending_hour: '',
      maxDay: 0,
      number: 0,
      reason: "",
      pageNum: 0,
      _id: null,
      deleting: false,
      calendarVisible: false,
      selected_dates: [],
      startVac: '',
      endVac: '',
      vacId: '',
      modalVisible: false,
      type: 'day',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getVacation(this.props.paramsId));
    dispatch(getSingleEmpBreak(this.props.paramsId));
  }
  handleChange(e) {
    var state = Object.assign(this.state, {
      [e.target.name]: e.target.value,
    });
    this.setState(state);
  }
  handleNumberChange(e) {
    this.setState({ ...this.state, number: e });
  }
  getMaxDate(dateString1, dateString2) {
    let difference = 0;
    let date1 = new Date(dateString1);
    let date2 = new Date(dateString2);
    if (isValidDate(date1) && isValidDate(date2)) {
      difference = (date1.getTime() - date2.getTime()) / (1000 * 3600 * 24) + 1;
    }
    return difference;
  }
  dateHandle(string, value) {
    this.setState({
      ...this.state,
      starting_date: value[0],
      ending_date: value[1],
      maxDay: this.getMaxDate(value[1], value[0]),
    });
  }
  cancelBreak() {
    this.setState({
      type: 'day',
      visible: false,
      reason: "",
      starting_date: "",
      ending_date: "",
      number: 0,
      maxDay: 0,
      _id: null,
      selected_date: '',
      selected_starting_hour: '',
      selected_ending_hour: '',
    });
  }
  delete(_id, status) {
    if (status === "pending" || status === "deleted") {
      if (hasAction([], this.props.main.employee, this.props.paramsId, true)) {
        this.props.dispatch(deleteBreak({ _id: _id, emp: this.props.paramsId }));
      } else {
        config.get("emitter").emit("error", "Устгах эрхгүй байна.");
      }
    } else {
      config
        .get("emitter")
        .emit(
          "error",
          "Хүлээгдэж байгаа эсвэл цуцлагдсан хүсэлтийг устгах боломжтой"
        );
    }
    this.setState({ ...this.state, deleting: false, _id: null });
  }
  applyBreak(e) {
    const {
      employee: { empSingle },
    } = this.props;
    if(!this.state.type || this.state.type === '') {
      config.get("emitter").emit("error", locale("employee_att.emit.enterType"));
    } else if (this.state.reason === "") {
      config.get("emitter").emit("error", locale("employee_att.emit.enterReason"));
    } else {
      if(this.state.type === 'hour'){
        if(!this.state.selected_date || this.state.selected_date === '') return config.get('emitter').emit('error', locale("employee_att.emit.enterDay"))
        if(!this.state.selected_starting_hour || this.state.selected_starting_hour === '' || !isValidDate(this.state.selected_starting_hour))
          return config.get('emitter').emit('error', locale("employee_att.emit.timeStart"))
        if (!this.state.selected_ending_hour || this.state.selected_ending_hour === '' || !isValidDate(this.state.selected_ending_hour))
          return config.get('emitter').emit('error', locale("employee_att.emit.timeFinish"))
        let starting_date = `${moment(this.state.selected_date).format('YYYY/MM/DD')} ${moment(this.state.selected_starting_hour).format('HH:mm:ss')}`;
        let ending_date = `${moment(this.state.selected_date).format('YYYY/MM/DD')} ${moment(this.state.selected_ending_hour).format('HH:mm:ss')}`;
        this.props
          .dispatch(
            createBreak({
              type: this.state.type,
              _id: this.state._id,
              emp: empSingle._id,
              reason: this.state.reason,
              starting_date: starting_date,
              ending_date: ending_date,
              numberOfDaysPaid: this.state.number || 0,
            })
          )
          .then(e => {
            this.cancelBreak();
          });
      }else{
        if (
            this.state.starting_date === "" ||
            this.state.ending_date === ""
        ) {
          config.get("emitter").emit("error", locale("employee_att.emit.enterTime"));
        } else if (this.state.number > this.getMaxDate(this.state.ending_date, this.state.starting_date)) {
          config.get("emitter").emit("error", locale("employee_att.emit.salaryDay"));
        } else {
          this.props
            .dispatch(
              createBreak({
                type: this.state.type,
                _id: this.state._id,
                emp: empSingle._id,
                reason: this.state.reason,
                starting_date: this.state.starting_date,
                ending_date: this.state.ending_date,
                numberOfDaysPaid: this.state.number || 0,
              })
            )
            .then(e => {
              this.cancelBreak();
            });
        }
      }
    }
  }
  openModal(startDate, endDate, _id) {
    const {
      employee: {
        empVacation
      }
    } = this.props
    this.setState({
      modalVisible: true,
      startVac: moment(startDate),
      endVac: moment(endDate),
      vacId: _id
    })
  }
  onCalendarSelect(e) {
    const {
      selected_dates
    } = this.state
    let date = moment(e).format('YYYY-MM-DD')
    if(selected_dates.some((c) => moment(c).format('YYYY-MM-DD') === date)) {
      let aa = selected_dates.filter((i) => moment(i).format('YYYY-MM-DD') !== date)
      this.setState({
        selected_dates: aa
      })
    } else {
      selected_dates.push(date)
    }
  }
  getListData(value, startDate, endDate) {
    let listData;
    const {
      selected_dates
    } = this.state
    let endVacDate = new Date(endDate)
    if(value >= startDate && value < endVacDate) {
      selected_dates.some((c) => moment(c).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) ?
          listData = [
            {type: 'yes', content: locale("employee_att.vac")}
          ]
          : listData = [
            {type: 'no', content: locale("employee_att.vacNo")}
          ]
    } else {
      listData = [
        {type: 'disable'}
      ]
    }
    return listData || []
  }
  dateCellRender(startDate, endDate, value) {
    const listData = this.getListData(value, startDate, endDate)
    return (
        listData.map(item => (
            <div className='vacation-badge' onClick={() => this.onCalendarSelect(value)} >
              <Title level={5}>{item.content}</Title>
              {item.type === 'yes' ? <CheckCircleFilled className='calendar-icon-yes'/> : <CloseCircleFilled className='calendar-icon-no'/>}
            </div>
        ))
    )
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
    let disable = {
      // backgroundColor: '#1A3452',
      minWidth: '24px',
      height: 'auto',
      fontWeight: 400,
      borderRadius: 4,
      display: 'inline-flex',
      paddingInline: '13px',
      color: 'gainsboro',
      // lineHeight: 24,
      // color: '#fff',
      margin: '5px',
      // display: 'inline-block',
      position: 'relative'
    }
    // console.log(value)
    return (
        listData.map(item => (
            <div onClick={() => this.onCalendarSelect(value)} style={item.type === 'yes' ? style : item.type === 'disable' ? disable : style1} >
              {moment(value).format('DD')}
            </div>
        ))
    )
  }
  disabledCalendarDate(start, end, current) {
    return (current < start) || (current > end)
  }
  submitSelectedDays(selected_dates, id) {
    const {
      dispatch
    } = this.props
    if(this.state.selected_dates.length === 0) {
      return msg('error', locale("employee_att.emit.vacDay"))
    } else {
      dispatch(submitSelectedDays({
        selected_dates,
        id,
        emp: this.props.paramsId,
        starting_date: this.state.startVac,
        ending_date: this.state.endVac,
        rest: true
      })).then((c) => {
        if(c.json.success) {
          this.setState({
            modalVisible: false,
            selected_dates: [],
            startVac: '',
            endVac: '',
            vacId: ''
          })
        }
      })
    }
  }
  cancelVacation() {
    this.setState({
      modalVisible: false,
      selected_dates: [],
      startVac: '',
      endVac: '',
      vacId: '',
      calendarVisible: false
    })
  }
  submitAllDays(startDate, stopDate) {
    let dateArray = new Array();
    let currentDate = new Date(startDate)
    while (currentDate <= stopDate) {
      dateArray.push(moment(new Date(currentDate)))
      currentDate = currentDate.addDays(1)
    }
    this.props.dispatch(submitSelectedDays({
      selected_dates: dateArray,
      id: this.state.vacId,
      emp: this.props.paramsId,
      starting_date: this.state.startVac,
      ending_date: this.state.endVac,
      rest: true
    })).then(c => {
      if(c.json.success) {
        this.setState({
          modalVisible: false,
          selected_dates: [],
          startVac: '',
          endVac: '',
          vacId: ''
        })
      }
    })
  }
  render() {
    const {
      employee: { empSingle, gettingBreak, breaks, empVacation, submittingSelectedDays },
    } = this.props;
    function getStatus(stat, info) {
      let result = "";
      let color = "";
      if(info === 'break') {
        switch (stat) {
          case "pending":
            result =  locale("employee_att.status.pending");
            color = "default"
            break;
          case "approved":
            result = locale("employee_att.status.approved");
            color = "success"
            break;
          case "declined":
            result = locale("employee_att.status.declined");
            color = "error"
            break;
          default:
            result = "";
            color = "default"
        }
      } else{
        switch (stat) {
          case 'idle':
            result = locale("employee_att.status.pending")
            color = "default"
            break
          case 'pending':
            result = locale("employee_att.status.sent")
            color = "processing"
            break
          case "approved":
            result = locale("employee_att.status.approved");
            color = "success"
            break;
          case "declined":
            result = locale("employee_att.status.declined");
            color = "error"
            break;
          case "amrahgui":
            result = locale("employee_att.vac");
            color = 'error'
            break;
          default:
            result = ''
            color = "default"
        }
      }
      return (
        <Tag
          color={color}
        >
          {result}
        </Tag>
      );
    }
    const columns = [
      {
        title: "№",
        key: "index",
        width: "65px",
        render: (text, record, idx) =>
          (breaks || []).findIndex(elem => {
            return elem.created === record.created;
          }) + 1,
      },
      {
        title: locale("employee_att.reason"),
        key: "reason",
        dataIndex: "reason",
        width: "220px",
        ellipsis: true,
        render: record => (
          <Tooltip title={record} color={'#1A3452'}>
            {record}
          </Tooltip>
        ),
      },
      {
        title: locale("employee_att.startingDate"),
        key: "starting_date",
        width: "120px",
        render: record => record.type === 'hour' ? moment(record.starting_date).format("YYYY-MM-DD HH:mm:ss") : moment(record.starting_date).format("YYYY-MM-DD"),
      },
      {
        title: locale("employee_att.endingDate"),
        key: "ending_date",
        width: "120px",
        render: record => record.type === 'hour' ? moment(record.ending_date).format("YYYY-MM-DD HH:mm:ss") : moment(record.ending_date).format("YYYY-MM-DD"),
      },
      {
        title: locale("employee_att.payday"),
        key: "numberOfDaysPaid",
        dataIndex: "howManyDaysPaid",
      },
      {
        title: locale("employee_att.createdDay"),
        key: "created",
        width: "120px",
        dataIndex: "created",
        render: record => moment(record).format("YYYY-MM-DD"),
      },
      {
        title: locale("employee_att.answer"),
        key: "status",
        dataIndex: "status",
        render: record => getStatus(record, 'break'),
      },
      {
        key: "actions",
        width: "110px",
        render: record =>
          record.status !== "approved" ? (
            <div>
              <Button
                shape="circle"
                icon={<EditOutlined />}
                style={{ marginRight: "10px" }}
                onClick={() => {
                  let newState;
                  let starting_date = record.starting_date;
                  let ending_date = record.ending_date;
                  if(record.type === 'hour'){
                    newState = {
                      type: record.type || 'day',
                      visible: true,
                      reason: record.reason,
                      _id: record._id,
                      number: record.howManyDaysPaid,
                      selected_date: moment(starting_date),
                      selected_starting_hour: moment(starting_date),
                      selected_ending_hour: moment(ending_date),
                      deleting: false,
                    }
                  }else{
                    newState = {
                      type: record.type || 'day',
                      visible: true,
                      reason: record.reason,
                      _id: record._id,
                      number: record.howManyDaysPaid,
                      deleting: false,
                      maxDay: this.getMaxDate(record.ending_date, record.starting_date),
                      starting_date: moment(starting_date),
                      ending_date: moment(ending_date),
                    }
                  }
                  this.setState(newState)
                }}
              />
              <Popconfirm
                title={locale("employee_att.delete")}
                onConfirm={() => this.delete(record._id, record.status)}
                visible={
                  this.state._id === record._id && this.state.deleting === true
                }
                onCancel={() =>
                  this.setState({ ...this.state, _id: null, deleting: false })
                }
                okText={locale("yes")}
                cancelText={locale("no")}
              >
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() =>
                    this.setState({
                      ...this.state,
                      deleting: true,
                      _id: record._id,
                    })
                  }
                  shape="circle"
                  type="danger"
                />
              </Popconfirm>
            </div>
          ) : null,
      },
    ];
    return (
      <React.Fragment>
        <Row
          justify="center"
          align="center"
          style={{ width: "100%" }}
          className={"emp-anket"}
        >
          <Col span={20}>
            {/* Чөлөө */}
            <div style={{ margin: "50px auto 30px" }}>
              <Divider orientation="left" plain>
                <b style={{ fontSize: 16 }}>{locale("employee_att.vacation.base")}</b>
              </Divider>
            </div>
            <Card
              // title="Чөлөө авах хүсэлт"
              extra={
                hasAction(
                  [],
                  this.props.main.employee,
                  this.props.paramsId,
                  true
                ) ? (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() =>
                      this.setState({ ...this.state, visible: true })
                    }
                  >
                    {locale("employee_att.vacation.req")}
                  </Button>
                ) : null
              }
            >
              {
                (breaks || []).length > 0 ?
                  <Table
                    dataSource={breaks}
                    loading={gettingBreak}
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                  />
                  :
                  <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale("employee_att.vacation.empty")}</span>} />
              }
            </Card>
            {/* Ээлжийн амралт */}
            <div style={{ margin: "50px auto 30px" }}>
              <Divider orientation="left" plain>
                <b style={{ fontSize: 16 }}>{locale("employee_att.vacation.req")} </b>
              </Divider>
            </div>
            <Card>
              {
                (empVacation || []).length > 0 ?
                  <Table
                    pagination={{pageSize: 5}}
                    dataSource={empVacation}
                    columns={[
                      {
                        title: "№",
                        key: "№",
                        render: (record, text, idx) => idx + 1,
                      },
                      // {
                      //   title: "Он",
                      //   key: "Он",
                      //   render: (record) => moment(record.created).format("YYYY"),
                      // },
                      {
                        title: locale("employee_att.vacation.start"),
                        key: 'Амралт эхлэх огноо',
                        render: (record) => moment(record.starting_date).format('YYYY-MM-DD')
                      },
                      {
                        title: locale("employee_att.vacation.finish"),
                        key: 'Амралт дуусах огноо',
                        render: (record) => moment(record.ending_date).format('YYYY-MM-DD')
                      },
                      {
                        title: locale("employee_att.status.base"),
                        key: 'Төлөв',
                        render: (record) => getStatus(record.status, 'vacation')
                      },
                      hasAction(
                        [],
                        this.props.main.employee,
                        this.props.paramsId,
                        true
                      ) ? {
                        key: 'actions',
                        render: (record) => (
                          record.status === 'idle' ?
                            <div>
                              <Button
                                // shape="circle"
                                // icon={<CheckOutlined />}
                                style={{ marginRight: "10px" }}
                                onClick={this.openModal.bind(this, record.starting_date, record.ending_date, record._id)}
                              >
                                {locale("employee_att.vac")}
                              </Button>
                              <Popconfirm
                                title={locale("employee_att.wont")}
                                onConfirm={() => this.props.dispatch(submitSelectedDays({
                                  emp: this.props.paramsId,
                                  id: record._id,
                                  rest: false
                                })).then(c => {
                                  if(c.json.success){
                                    this.setState({
                                      modalVisible: false,
                                      selected_dates: [],
                                      startVac: '',
                                      endVac: '',
                                      vacId: ''
                                    })
                                  }
                                })}
                                okText={locale("yes")}
                                cancelText={locale("no")}
                              >
                                <Button
                                  type="danger"
                                >
                                  {locale("employee_att.vacNo")}
                                </Button>
                              </Popconfirm>
                            </div>
                            : record.status === 'pending' ?
                            <Button
                              // shape="circle"
                              // icon={<CheckOutlined />}
                              style={{ marginRight: "10px" }}
                              // onClick={this.openModal.bind(this, record.starting_date, record.ending_date, record._id)}
                              onClick={() => this.setState({
                                modalVisible: true,
                                startVac: moment(record.starting_date),
                                endVac: moment(record.ending_date),
                                vacId: record._id,
                                selected_dates: record.selected_dates,
                                calendarVisible: true
                                })}
                            >
                              {locale("employee_att.fix")}
                            </Button>
                            : null
                        )
                      }
                      : {}
                    ]}
                  />
                  :
                  <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>{locale("employee_att.vacation.vacEmpty")}</span>} />
              }
              <Modal
                visible={this.state.modalVisible}
                style={{top: 20}}
                onCancel={this.cancelVacation.bind(this)}
                width={'550px'}
                closable={false}
                footer={
                  this.state.calendarVisible ?
                    [
                      <Button
                        type='default'
                        onClick={this.cancelVacation.bind(this)}
                      >
                        {locale("employee_single.cancel")}
                      </Button>,
                      <Button
                        type='primary'
                        onClick={this.submitSelectedDays.bind(this, this.state.selected_dates, this.state.vacId)}
                      >
                        {locale("employee_att.sendReq")}
                      </Button>
                    ]
                    :
                    [
                    <Button
                      onClick={this.cancelVacation.bind(this)}
                    >
                     {locale("employee_single.cancel")}
                    </Button>,
                    <Button
                        type='primary'
                        onClick={this.submitAllDays.bind(this, this.state.startVac, this.state.endVac)}
                    >
                      {locale("employee_att.sendReqNot")}
                    </Button>
                  ]
                }
              >
                {
                  this.state.calendarVisible
                    ? <Calendar
                      // onSelect={(e) => this.onCalendarSelect(e)}
                      defaultValue={this.state.startVac}
                      // fullscreen={false}
                      // dateCellRender={(e) => this.dateCellRender(moment(this.state.startVac), moment(this.state.endVac), e)}
                      dateFullCellRender={(e) => this.dateFullCellRender(e, moment(this.state.startVac), moment(this.state.endVac))}
                      disabledDate={this.disabledCalendarDate.bind(this, this.state.startVac, this.state.endVac)}
                    />
                    : <Space direction='vertical'>
                      <Text>{locale("employee_att.possibleDays")}:</Text>
                      <span>
                        <Text>{moment(this.state.startVac).format('YYYY/MM/DD')} - {moment(this.state.endVac).format('YYYY/MM/DD')}</Text>
                        <Button
                          type='default'
                          onClick={() => {
                            this.setState({
                              calendarVisible: true
                            })
                          }}
                          style={{marginLeft: 20}}
                        >
                         {locale("employee_att.chooseDay")}
                        </Button>
                      </span>
                    </Space>
                }
              </Modal>
            </Card>
          </Col>
        </Row>
        <Drawer
          title={this.state._id === null ? "Чөлөө авах хүсэлт гаргах" : "Чөлөө авах хүсэлт өөрчлөх"}
          visible={this.state.visible}
          maskClosable={false}
          onClose={() => this.cancelBreak()}
          width={720}
          key={"drawer-break"}
          footer={
            <div style={{textAlign: 'right'}}>
              <Button
                  style={{ marginRight: 20 }}
                  onClick={this.cancelBreak.bind(this)}
                  htmlType="reset"
              >
                {locale("employee_single.cancel")}
              </Button>
              <Button
                  type="primary"
                  onClick={this.applyBreak.bind(this)}
                  // style={{ float: "left" }}
              >
                {
                  this.state._id === null ?
                    locale("employee_att.sendReq") : locale("employee_att.changeReq")
                }
              </Button>
            </div>
          }
        >
          <Row justify="center" align="center">
            <Col span={22}>
              <Form
                size="small"
                id='break'
                layout="vertical"
                fields={[
                  { name: "type", value: this.state.type },
                  { name: "reason", value: this.state.reason },
                  { name: "starting_date", value: this.state.starting_date },
                  { name: "ending_date", value: this.state.ending_date },
                  { name: "numberOfDaysPaid", value: this.state.number },
                  { name: "selected_date", value: this.state.selected_date },
                  { name: "selected_starting_hour", value: this.state.selected_starting_hour },
                  { name: "selected_ending_hour", value: this.state.selected_ending_hour },
                ]}
              >
                <Item
                  label={locale("employee_att.type")}
                  rules={[
                    {
                      required: true,
                      message: locale("employee_att.chooseType"),
                    }
                  ]}
                  name={'type'}
                >
                  <Select name={'type'} onSelect={(e) => this.setState({type: e})} value={this.state.type}>
                    <Option value={'day'} key={'day'}>{locale("employee_att.vacation.day")}</Option>
                    <Option value={'hour'} key={'hour'}>{locale("employee_att.vacation.hour")}</Option>
                  </Select>
                </Item>
                <Item
                  label={locale("employee_att.reason")}
                  rules={[
                    {
                      required: this.state.reason === "",
                      message: locale("employee_att.enterReas"),
                    },
                  ]}
                  name="reason"
                >
                  <Input.TextArea
                    name="reason"
                    rows={5}
                    value={this.state.reason}
                    onChange={e => this.setState({ reason: e.target.value })}
                  />
                </Item>
                {
                  this.state.type === 'hour' ?
                    <Row>
                      <Col span={6}>
                        <Item
                          name={'selected_date'}
                          label={locale("employee_att.day")}
                          rules={[
                            {
                              required: true,
                              message: locale("employee_att.day"),
                            },
                          ]}
                        >
                          <DatePicker
                              name={'selected_date'}
                              placeholder={locale("employee_att.emit.enterDay")}
                              onChange={(e) => this.setState({selected_date: e})}
                              // locale={{today: 'Өнөөдөр'}} 
                              value={this.state.selected_date}
                          />
                        </Item>
                      </Col>
                      <Col span={18}>
                        <Item
                          label="Цаг"
                          rules={[
                            {
                              required: true,
                              message: locale("employee_att.emit.enterHour"),
                            },
                          ]}
                        >
                          <TimePicker.RangePicker
                            value={this.state.selected_starting_hour && this.state.selected_ending_hour ?
                                [moment(this.state.selected_starting_hour), moment(this.state.selected_ending_hour)] : null}
                            placeholder={[locale("employee_att.startHour"), locale("employee_att.emit.finishHour")]} name={['selected_starting_hour', 'selected_ending_hour']}
                            onChange={(e) => this.setState({selected_starting_hour: e[0], selected_ending_hour: e[1]})}
                          />
                        </Item>
                      </Col>
                    </Row>
                    :
                    <Row>
                      <Col span={12}>
                        <Item
                          label={locale("employee_att.time")}
                          rules={[
                            {
                              required: true,
                              message: locale("employee_att.emit.enterTime"),
                            },
                          ]}
                        >
                          <RangePicker
                            allowClear={false}
                            value={
                              this.state.starting_date && this.state.ending_date
                                  ? [
                                    moment(this.state.starting_date),
                                    moment(this.state.ending_date),
                                  ]
                                  : null
                            }
                            placeholder={[locale("employee_att.startTime"), locale("employee_att.startTime")]}
                            onChange={(dateString, dateValue) =>
                                this.dateHandle(dateString, dateValue)
                            }
                          />
                        </Item>
                      </Col>
                      <Col span={12}>
                        <Item label={locale("employee_att.payday")}>
                          <InputNumber
                            min={0}
                            max={this.state.maxDay}
                            value={this.state.number}
                            onChange={this.handleNumberChange.bind(this)}
                          />
                        </Item>
                      </Col>
                    </Row>
                }
              </Form>
            </Col>
          </Row>
        </Drawer>
      </React.Fragment>
    );
  }
}

export default connect(reducer)(EmployeeAttendanceComponent);
