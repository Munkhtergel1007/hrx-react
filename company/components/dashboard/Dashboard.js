import React, {Component} from "react";
import { connect } from 'react-redux';
import config from "../../config";
import {locale} from "../../lang";
import moment from "moment";
import * as actions from "../../actions/dashboard_actions";
import { Link } from 'react-router-dom';

const reducer = ({ main, dashboard }) => ({ main, dashboard });
import {Card, Button, Table, Popconfirm, Tag, Input, Badge, Select, List, Row, Col, Typography, Slider, Progress, Tooltip, Modal, Collapse, Space, Empty, Calendar} from 'antd';
const { Title, Text } = Typography;
import { ExpandOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, CheckOutlined, CloseOutlined, CompressOutlined, DownCircleOutlined, QuestionOutlined } from '@ant-design/icons'
import { PieChart } from 'react-minimal-pie-chart';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            searchText: '',
            searchedColumn: null,
            filteredInfo: {},
            expandedRowKeys: [],
            work_dates: [],
            commentModal: false,
            workplan: {}
        };
    }
    componentDidMount() {
        const {main: {employee, company}} = this.props;
        if(employee.staticRole !== 'employee'){
            this.props.dispatch(actions.getAllEmployeeUsers({companyId: company._id}));
            this.props.dispatch(actions.getEmployeeWorkplans({companyId: company._id}));
        }else{
            this.props.dispatch(actions.getEmployeeWorkplans({employeeId: employee._id}));
        }
    }
    // handleExpand(e, record){
    //     if(e){
    //         this.setState({...this.state, expandedRowKeys})
    //     }
    // }
    handleSearch(selectedKeys, confirm, dataIndex){
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    };
    handleSearchReset(clearFilters){
        clearFilters();
        this.setState({searchText: ''})
    };
    handleChange(pagination, filters){
        this.setState({...this.state, filteredInfo: filters})
    }
    getListData(value) {
        let listData
        const {
            work_dates
        } = this.state
        work_dates.some(c => moment(c).format('YYYY-MM-DD') === moment(value).format('YYYY-MM-DD')) ?
            listData = [
                {type: 'yes'}
            ]
            : listData = [
                {type: 'no'}
            ]
        return listData || []
    }
    dateCellRender(value) {
        const listData = this.getListData(value)
        let style = {
            backgroundColor: '#1A3452',
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            display: 'inline-flex',
            color: '#fff',
            paddingInline: '13px',
            margin: '5px',
            position: 'relative',
            cursor: 'default'
        }
        let style1 = {
            minWidth: '24px',
            height: 'auto',
            fontWeight: 400,
            borderRadius: 4,
            display: 'inline-flex',
            paddingInline: '13px',
            margin: '5px',
            position: 'relative',
            cursor: 'default'
        }
        return (
            listData.map(item => (
                <div style={item.type === 'yes' ? style : style1} >
                    {moment(value).format('DD')}
                </div>
            ))
        )
    }
    disabledWorkDates(current){
        return moment(current).format('YYYY-MM') !== moment(this.state.year_month).format('YYYY-MM')
    }
    render() {
        let {  main:{user, employee}, dashboard:{status, data, all, attendance, gettingWorkplan, workplans }  } = this.props;
        let format = 'YYYY/MM/DD HH:mm:ss', formatHourless = 'YYYY/MM/DD';
        function getAges(){
            if(data.age){
                return { avg: Math.round(((data.age || {}).avgAge) || 0), data: [
                        {title: `18-25 ${locale('common_dashboard.nas')}`, value: Math.round(data.age.young), color: '#3B1F2B'},
                        {title: `25-40 ${locale('common_dashboard.nas')}`, value: Math.round(data.age.avg), color: '#DB162F'},
                        {title: `40-55 ${locale('common_dashboard.nas')}`, value: Math.round(data.age.older), color: '#DBDFAC'},
                        {title: `55 ${locale('common_dashboard.nas')}`, value: Math.round(data.age.old), color: '#5F758E'}
                    ]}
            }
            return { avg: 0, data: [
                    {title: '18-25 нас', value: 0, color: '#3B1F2B'},
                    {title: '25-40 нас', value: 0, color: '#DB162F'},
                    {title: '40-55 нас', value: 0, color: '#DBDFAC'},
                    {title: '55-аас дээш', value: 0, color: '#5F758E'}
                ]}

        }
        function getGenders() {
            if(data.gender){
                return [
                    {title: `${locale('common_dashboard.Eregtei')}`,value: Math.round(data.gender.male), color: '#E03616'},
                    {title: `${locale('common_dashboard.Emegtei')}`, value: Math.round(data.gender.female), color: '#FFF689'}
                ]
            }
            return [
                {title: 'Эрэгтэй', value: 0, color: '#E03616'},
                {title: 'Эмэгтэй', value: 0, color: '#FFF689'}
            ]
        }
        function getEducation() {
            if(data.degree){
                return [
                    {title: `${locale('common_dashboard.Diplom')}`, value: Math.round(data.degree.diplom), color: '#C4A69D'},
                    {title: `${locale('common_dashboard.Baklavar')}`, value: Math.round(data.degree.bachelor), color: '#98A886'},
                    {title: `${locale('common_dashboard.Magistr')}`, value: Math.round(data.degree.magistr), color: '#465C69'},
                    {title: `${locale('common_dashboard.Doktor')}`, value: Math.round(data.degree.dr), color: '#363457'},
                    {title: `${locale('common_dashboard.Busad')}`, value: Math.round(data.degree.other), color: '#735290'},
                    {title: `${locale('common_dashboard.Hooson')}`, value: Math.round(data.degree.empty), color: '#2D1E2F'},
                ]
            }
            return [
                {title: 'Диплом', value: 0, color: '#C4A69D'},
                {title: 'Бакалавр', value: 0, color: '#98A886'},
                {title: 'Магистр', value: 0, color: '#465C69'},
                {title: 'Доктор', value: 0, color: '#363457'},
                {title: 'Бусад', value: 0, color: '#735290'},
                {title: 'Хоосон', value: 0, color: '#2D1E2F'},
            ]
        }
        function getMarried(){
            return {title: 'Гэрлэсэн', value: Math.round(((data.married ? data.married : 0)/(all || 1))*100), color: '#712F79'}
        }
        function getTraining(){
            return {title: 'Сургалтанд хамрагдсан', value: Math.round(((data.training ? data.training: 0)/(all || 1))*100), color: '#FDCA40'}
        }
        function getExperience(){
            return {title: 'Туршлагатай', value: Math.round(((data.experience ? data.experience: 0)/(all || 1))*100), color: '#33A1FD'}
        }
        function getMilitary(){
            return {title: 'Цэрэгт явсан', value: Math.round(((data.military ? data.military: 0)/(all || 1))*100), color: '#1E1014'}
        }
        function getAttendance(){
            let temp = {came: 0, takingBreak: 0, takingVacation: 0, didntCome: 0, late: 0, shouldNotWork: 0, noTimetable: 0};
            attendance.map(att => {
                switch (att.att) {
                    case 1: temp.late++; break;
                    case 2: temp.came++; break;
                    case 0: temp.shouldNotWork++; break;
                    case 4: temp.takingVacation++; break;
                    case 5: temp.takingBreak++; break;
                    default: temp.didntCome++;
                }
                att.hasTimetable === false ? temp.noTimetable++ : null;
            });
            return temp;
        }
        let countCome= 0, countShouldNot = 0, trainingData, educationData, experienceData, age, gender, family, military, attendances;
        if(data){
            trainingData = getTraining();
            educationData = getEducation();
            experienceData = getExperience();
            age = getAges();
            gender = getGenders();
            family = getMarried();
            military = getMilitary();
        }
        if(attendance){
            // attendance.map(att => {
            //     if(att.att === 4 || att.att === 5 || att.att === 0 || att.att === 6){
            //         countShouldNot++;
            //     }else if (att.att === 1 || att.att === 2 || att.att === 3){
            //         countCome++;
            //     }
            // });
            attendances = getAttendance();
        }
        let filteredInfo = this.state.filteredInfo;
        return (
            employee.staticRole !== 'employee' ?
                <React.Fragment>
                    <Row>
                        <Col span={16}>
                            <Card
                                title={locale('common_dashboard.bolovsrol')}
                                bordered={true}
                                loading={status}
                                style={{margin:30}}
                            >
                                <Row gutter={[20,0]}>
                                    <Col span={12}>
                                        <Row>
                                            <Col span={16}>
                                                <PieChart
                                                    data={educationData}
                                                    animate
                                                />
                                            </Col>
                                            <Col span={8} style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                <div>
                                                    {educationData ? (educationData || {}).map( educationData => (
                                                        <div key={Math.random()}>
                                                            <div style={{backgroundColor: educationData.color, height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                            {educationData.title} - {educationData.value}
                                                        </div>
                                                    )) : null}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={12} style={{marginTop: '4%'}}>
                                        <Title level={4}>
                                            {locale("common_dashboard.turshlagtai")}
                                        </Title>
                                        <Slider
                                            trackStyle={{ backgroundColor: experienceData ? experienceData.color : 'black' }}
                                            marks={
                                                { 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }
                                            }
                                            dotStyle={{display: 'none'}}
                                            handleStyle={{ height: '0px', width: '0px', bottom: '4px', backgroundColor: experienceData ? experienceData.color : 'black' }}
                                            value={experienceData ? experienceData.value : 0}
                                            min={0}
                                            max={100}
                                        />
                                        <Title level={4}>
                                            {locale("common_dashboard.Surguulid hamragdsan")}
                                        </Title>
                                        <Slider
                                            trackStyle={{ backgroundColor: trainingData ? trainingData.color : 'black' }}
                                            marks={
                                                { 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }
                                            }
                                            dotStyle={{display: 'none'}}
                                            handleStyle={{ height: '0px', width: '0px', bottom: '4px', backgroundColor: trainingData ? trainingData.color : 'black' }}
                                            value={trainingData ? trainingData.value : 0}
                                            min={0}
                                            max={100}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                            <Row gutter={[30,0]} style={{margin: '0px 15px'}}>
                                <Col span={8}>
                                    {/*<Card*/}
                                    {/*    title='Эрүүл мэнд'*/}
                                    {/*    bordered={true}*/}
                                    {/*    loading={status}*/}
                                    {/*    style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}*/}
                                    {/*>*/}
                                    {/*    <Progress type="circle" percent={100} status='active' strokeColor='green' />*/}
                                    {/*</Card>*/}
                                    <Card
                                        title= {locale('common_dashboard.Irts')}
                                        bordered={true}
                                        loading={status}
                                        extra={<Button style={{marginLeft: '20px', position: 'absolute', top: 10, right: 10}} icon={<ExpandOutlined />} onClick={()=>this.setState({...this.state, visible: true})}/>}
                                        style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative'}}
                                        bodyStyle={{width: '100%'}}
                                    >
                                        <Row>
                                            <Col span={13} style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>
                                                <PieChart
                                                    data={[
                                                        {title: `${locale('common_dashboard.Irsen')}`, value: (attendances.came || 0), color: 'green'},
                                                        {title: `${locale('common_dashboard.Cholootei')}`, value: (attendances.takingBreak || 0), color: '#1d39c4'},
                                                        {title: `${locale('common_dashboard.Amarsan')}`, value: (attendances.takingVacation || 0), color: '#531DAB'},
                                                        {title: `${locale('common_dashboard.Ireegui')}`, value: (attendances.didntCome || 0), color: 'brown'},
                                                        {title: `${locale('common_dashboard.Hotsorson')}`, value: (attendances.late || 0), color: '#FF7F11'},
                                                        {title: `${locale('common_dashboard.Ajllahgui')}`, value: (attendances.shouldNotWork || 0), color: '#75C9C8'}
                                                    ]}
                                                    animate
                                                    lineWidth={20}
                                                    style={{width: '120px'}}
                                                />
                                                <div style={{fontSize: 30, position: 'absolute', top: '50%', left: '50%', transform: 'translateX(-50%) translateY(-50%)'}}>
                                                    {attendance.length || 0}
                                                </div>
                                                {/*<Progress type="circle" percent={Math.floor(((countCome || 0)/(attendance.length-countShouldNot))*100)} status='active' strokeColor='green' />*/}
                                            </Col>
                                            <Col span={11}>
                                                <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                                    <div>
                                                        <div style={{backgroundColor: 'green', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        Ирсэн - {(attendances.came || 0) + (attendances.late || 0)}
                                                    </div>
                                                    <div style={{marginLeft: 10}}>
                                                        <div style={{backgroundColor: '#FF7F11', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        Хоцорсон - {attendances.late || 0}
                                                    </div>
                                                    <div>
                                                        <div style={{backgroundColor: '#1D39C4', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        Чөлөөтэй - {attendances.takingBreak || 0}
                                                    </div>
                                                    <div>
                                                        <div style={{backgroundColor: '#531DAB', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        Амарсан - {attendances.takingVacation || 0}
                                                    </div>
                                                    <div>
                                                        <div style={{backgroundColor: 'brown', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        Ирээгүй - {attendances.didntCome || 0}
                                                    </div>
                                                    <div>
                                                        <div style={{backgroundColor: '#75C9C8', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        Ажиллахгүй - {attendances.shouldNotWork || 0}
                                                    </div>
                                                    <hr width={"100%"} />
                                                    <div>
                                                        <div style={{backgroundColor: '#727D71', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                        {locale('')} - {attendances.noTimetable || 0}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={8}>
                                    <Card
                                        title= {locale('common_dashboard.TS_A_Haasan')}
                                        bordered={true}
                                        loading={status}
                                        style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                                    >
                                        <Progress type="circle" percent={military ? military.value : 0} format={(percent) => `${percent}%`} />
                                    </Card>
                                </Col>
                                {/*<Col span={6}>*/}
                                {/*    <Card*/}
                                {/*        title='Зөрчил'*/}
                                {/*        bordered={true}*/}
                                {/*        loading={status}*/}
                                {/*        style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}*/}
                                {/*    >*/}
                                {/*        <Progress type="circle" percent={100} status='active' strokeColor='green' />*/}
                                {/*    </Card>*/}
                                {/*</Col>*/}
                                <Col span={8}>
                                    <Card
                                        title= {locale('common_dashboard.Ger bultei')}
                                        bordered={true}
                                        loading={status}
                                        style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
                                    >
                                        <Progress type="circle" percent={family ? family.value : 0} format={(percent) => `${percent}%`} />
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <Card
                                title= {locale('ommon_dashboard.nas')}
                                bordered={true}
                                loading={status}
                                style={{margin: '30px 30px 30px 0'}}
                            >
                                <Row>
                                    <Col span={16}>
                                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', position: 'relative'}}>
                                            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', textAlign: 'center'}}>
                                                <p style={{marginBottom: '0', fontSize: '24px'}}>Дундаж <br/> нас</p>
                                                {age ? age.avg : 0}
                                            </div>
                                            <PieChart
                                                data={age ? age.data : []}
                                                animate
                                                lineWidth={20}
                                                style={{width: '250px'}}
                                            />

                                        </div>
                                    </Col>
                                    <Col span={8} style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <div>
                                            {age ? (age || {}).data.map( ages => (
                                                <div key={Math.random()}>
                                                    <div style={{backgroundColor: ages.color, height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}} />
                                                    {ages.title} - {ages.value}
                                                </div>
                                            )) : null}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                            <Card
                                title= {locale('common_dashboard.Hvis')}
                                bordered={true}
                                loading={status}
                                style={{margin: '30px 30px 30px 0'}}
                            >
                                <Row>
                                    <Col span={16}>
                                        <div style={{width: '100%', display: 'flex', justifyContent: 'center', position: 'relative'}}>
                                            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '30px', textAlign: 'center'}}>
                                                <p style={{marginBottom: '0'}}>Нийт</p>
                                                {all}
                                            </div>
                                            <PieChart
                                                data={gender}
                                                animate
                                                lineWidth={20}
                                                style={{width: '250px'}}
                                            />
                                        </div>
                                    </Col>
                                    <Col span={8} style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <div>
                                            {gender ? (gender || {}).map( genders => (
                                                <div key={Math.random()}>
                                                    <div style={{backgroundColor: genders.color, height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                                    {genders.title} - {genders.value}
                                                </div>
                                            )) : null}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                    <Card
                        title= {locale('common_dashboard.Guigtsetgesen unelgee')}
                        bordered={true}
                        loading={gettingWorkplan}
                        style={{margin: '30px 30px 30px 30px', width: 'max-content', minWidth: 500}}
                        extra={
                            <Tooltip title={
                                <React.Fragment>
                                    <div style={{color: 'black'}}>
                                        <div style={{backgroundColor: 'green', height: '1em', width: '1em', display: 'inline-block'}}/> -
                                        {locale('common_dashboard.Batlagdsan')}
                                    </div>
                                    <div style={{color: 'black'}}>
                                        <div style={{backgroundColor: '#2f3647', height: '1em', width: '1em', display: 'inline-block'}}/> -
                                        {locale('common_dashboard.BHBui')}
                                    </div>
                                    <div style={{color: 'black'}}>
                                        <div style={{backgroundColor: 'red', height: '1em', width: '1em', display: 'inline-block'}}/> -
                                        {locale('common_dashboard.Butsaagdsan')}
                                    </div>
                                    <div style={{color: 'black'}}>
                                        <div style={{backgroundColor: '#999', height: '1em', width: '1em', display: 'inline-block'}}/> -
                                        {locale('common_dashboard.Hiigdej bui')}
                                    </div>
                                    <div style={{color: 'black'}}>
                                        <div style={{backgroundColor: 'black', height: '1em', width: '1em', display: 'inline-block'}}/> -
                                        {locale('common_dashboard.Niit')}
                                    </div>
                                </React.Fragment>
                            }
                                 color='#fff'
                            >
                                <QuestionOutlined/>
                            </Tooltip>
                        }
                    >
                        {
                            (workplans || []).length > 0 ?
                                <table>
                                    <tbody>
                                        {
                                            (workplans || []).map((workplan, ind) =>
                                                <tr>
                                                    <td style={{paddingRight: 20}}>
                                                        <b>{moment((workplan || {}).date).format("YYYY оны MM сарын төлөвлөгөө")}</b>
                                                    </td>
                                                    <td style={{color: 'green', fontWeight: 600, padding: '0 10px'}}>
                                                        {workplan.approved || 0}
                                                    </td>
                                                    <td style={{color: '#2f3647', fontWeight: 500, padding: '0 10px'}}>
                                                        {workplan.checking || 0}
                                                    </td>
                                                    <td style={{color: 'red', fontWeight: 600, padding: '0 10px'}}>
                                                        {workplan.decline || 0}
                                                    </td>
                                                    <td style={{color: '#999999', fontWeight: 600, padding: '0 10px'}}>
                                                        {workplan.idle || 0}
                                                    </td>
                                                    <td style={{fontWeight: 900, borderLeft: '1px solid black', padding: '0 10px'}}>
                                                        {workplan.allWorkplans || 0}
                                                    </td>
                                                    <td style={{paddingLeft: 20}}>
                                                        Гүйцэтгэл:&nbsp;
                                                        {Math.round(((workplan.approved || 0)/(workplan.allWorkplans || 1))*((workplan.approvedJobs || 0)/(workplan.allJobs || 1))*100)}%
                                                    </td>
                                                </tr>
                                            )
                                        }
                                    </tbody>
                                </table>
                                :
                                <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Ажил гүйцэтгэл хоосон байна.</span>} />
                        }
                    </Card>
                    {/*<Calendar*/}
                    {/*    value={moment(workplan.year_month)}*/}
                    {/*    headerRender={() => (*/}
                    {/*        <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}} >*/}
                    {/*            <Text style={{fontSize: 16, marginRight: 7}}>{moment(workplan.year_month).format('YYYY')} оны {moment(workplan.year_month).format('M')} сар</Text>*/}
                    {/*        </div>*/}
                    {/*    )}*/}
                    {/*    dateFullCellRender={(e) => this.dateCellRender(e)}*/}
                    {/*    disabledDate={this.disabledWorkDates.bind(this)}*/}
                    {/*/>*/}
                    <Modal
                        centered
                        visible={this.state.visible}
                        style={{minWidth: 800}}
                        title="Өнөөдрийн ирц"
                        onCancel={()=>this.setState({...this.state, visible: false, filteredInfo: {}})}
                        footer={null}
                    >
                        <Table
                            rowKey={(record) => {return record._id}}
                            locale={{filterConfirm: 'Шүүх', filterReset: 'Хайлтыг цэвэрлэх'}}
                            columns={[
                                {
                                    dataIndex: 'first_name', key: 'first_name', title: 'Нэр',
                                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                                        <div style={{ padding: 10 }}>
                                            <Input
                                                placeholder={`Хайх нэр`}
                                                value={selectedKeys[0]}
                                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                                onPressEnter={() => this.handleSearch(selectedKeys, confirm, 'first_name')}
                                                style={{ marginBottom: 8, display: 'block' }}
                                            />
                                            <Space>
                                                <Button onClick={() => this.handleSearchReset(clearFilters)}>
                                                    Хайлтыг цэвэрлэх
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={() => this.handleSearch(selectedKeys, confirm, 'first_name')}
                                                    icon={<SearchOutlined />}
                                                >
                                                    Хайх
                                                </Button>
                                            </Space>
                                        </div>
                                    ),
                                    textWrap: 'word-break',
                                    ellipsis: true,
                                    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1A3452' : '#81b29a' }} />,
                                    filteredValue : (filteredInfo.first_name || null),
                                    onFilter: (value, record) =>
                                        record['first_name']
                                            ? record['first_name'].toString().toLowerCase().includes(value.toLowerCase())
                                            : ''
                                },
                                {
                                    dataIndex: 'last_name', key: 'last_name', title: 'Овог',
                                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                                        <div style={{ padding: 10 }}>
                                            <Input
                                                placeholder={`Хайх овог`}
                                                value={selectedKeys[0]}
                                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                                onPressEnter={() => this.handleSearch(selectedKeys, confirm, 'last_name')}
                                                style={{ marginBottom: 8, display: 'block' }}
                                            />
                                            <Space>
                                                <Button onClick={() => this.handleSearchReset(clearFilters)}>
                                                    Хайлтыг цэвэрлэх
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={() => this.handleSearch(selectedKeys, confirm, 'last_name')}
                                                    icon={<SearchOutlined />}
                                                >
                                                    Хайх
                                                </Button>
                                            </Space>
                                        </div>
                                    ),
                                    textWrap: 'word-break',
                                    ellipsis: true,
                                    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1A3452' : '#81b29a' }} />,
                                    filteredValue : (filteredInfo.last_name || null),
                                    onFilter: (value, record) =>
                                        record['last_name']
                                            ? record['last_name'].toString().toLowerCase().includes(value.toLowerCase())
                                            : ''
                                },
                                {
                                    dataIndex: 'att', key: 'attendance', title: 'Ирц',
                                    onFilter: (value, record) => record.att === value,
                                    filters: [
                                            {text: 'Ирсэн', value: 2},
                                            {text: 'Чөлөөтэй', value: 5},
                                            {text: 'Амарсан', value: 4},
                                            {text: 'Ажиллахгүй', value: 0},
                                            {text: 'Хоцорсон', value: 1},
                                            {text: 'Ирээгүй', value: 3}
                                        ],
                                    textWrap: 'word-break',
                                    // width: 300,
                                    ellipsis: true,
                                    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1A3452' : '#81b29a' }} />,
                                    filteredValue : (filteredInfo.attendance || null),
                                    render: (record) =>
                                        record === 2 ?  <Tag color='green'>Ирсэн</Tag>
                                        :
                                            record === 1 ? <Tag color='#FF7F11'>Хоцорсон</Tag>
                                            :
                                                record === 4 ? <Tag color='purple'>Амарсан</Tag>
                                                :
                                                    record === 5 ? <Tag color='geekblue'>Чөлөөтэй</Tag>
                                                        :
                                                            record === 0 ? <Tag color='#75C9C8'>Ажиллахгүй</Tag>
                                                                :
                                                                <Tag color='red'>Ирээгүй</Tag>
                                }]}
                            expandable={{
                                rowExpandable: record => record.att === 4 || record.att === 5 || record.att === 1,
                                expandedRowRender: record =>
                                    record.att === 5 ?
                                        <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
                                            {
                                                record.reason ?
                                                    <p style={{marginBottom: 0}}>
                                                        <b>Шалтгаан:</b>
                                                        <i> {record.reason}</i>
                                                    </p>
                                                    : null
                                            }
                                            {
                                                record.starting_date && record.ending_date ?
                                                    <p style={{marginBottom: 0}}>
                                                        <b>Чөлөө авсан өдрүүд:</b> {moment(record.starting_date).format(formatHourless)} - {moment(record.ending_date).format(formatHourless)}
                                                    </p>
                                                    : null
                                            }
                                        </div>
                                        :
                                        record.att === 4 ?
                                            <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
                                                {
                                                    record.starting_date && record.ending_date ?
                                                        <p style={{marginBottom: 0}}>
                                                            <b>Амрах өдрүүд: </b>
                                                            {moment(record.starting_date).format(formatHourless)} - {moment(record.ending_date).format(formatHourless)}
                                                        </p>
                                                        : null
                                                }
                                            </div>
                                            :
                                            <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
                                                {
                                                    record.cameTime ?
                                                        <p style={{marginBottom: 0}}><b>Ирсэн цаг:</b> {moment(record.cameTime).format(format)}</p>
                                                        : null
                                                }
                                            </div>

                            }}
                            dataSource={attendance}
                            onChange={this.handleChange.bind(this)}
                        />
                        {/*{*/}
                        {/*    attendances.noTimetable > 0 ?*/}
                        {/*        <div>*/}
                        {/*            <hr/>*/}
                        {/*            <b>Цагийн хуваарьгүй ажилчид: </b>*/}
                        {/*            {*/}
                        {/*                attendance.map(att =>*/}
                        {/*                    !att.hasTimetable ? <p style={{display: 'inline'}}>{att.last_name} {att.first_name}</p> : null*/}
                        {/*                )*/}
                        {/*            }*/}
                        {/*        </div>*/}
                        {/*        :*/}
                        {/*        null*/}
                        {/*}*/}
                    </Modal>
                </React.Fragment>
                :
                <React.Fragment>
                    <div>
                        <Row>
                            <Col span={12}>
                                <Card
                                    title="Ажил гүйцэтгэл"
                                    bordered={true}
                                    loading={gettingWorkplan}
                                    style={{margin:10}}
                                >
                                    {
                                        (workplans || []).length > 0 ?
                                            <Collapse
                                                defaultActiveKey={1}
                                                expandIcon={({ isActive }) => <DownCircleOutlined rotate={isActive ? 180 : 0}/>}
                                            >
                                                {
                                                    (workplans || []).map((workplan, ind) =>
                                                        <Collapse.Panel
                                                            key={`${ind+1}`}
                                                            style={{transition: '.3s'}}
                                                            collapsible={(workplan || {}).status !== 'idle' && ((workplan || {}).jobs || []).length > 0 ? null : 'disabled'}
                                                            header={
                                                                <b>{moment((workplan || {}).year_month).format("YYYY оны MM сарын төлөвлөгөө")}</b>
                                                            }
                                                            extra={
                                                                <div>
                                                                    {
                                                                        workplan.status === 'approved' ? <Tag color="green">Үнэлэгдсэн</Tag>
                                                                        :
                                                                        workplan.status === 'decline' ? <Tag color="red">Татгалзсан</Tag>
                                                                        :
                                                                        workplan.status === 'checking' ? <Tag color='geekblue'>Шалгаж байгаа</Tag>
                                                                        :
                                                                        <Tag>Шинэ</Tag>
                                                                    }
                                                                    {
                                                                        (workplan || {}).comment ?
                                                                            <Button icon={<QuestionOutlined />} shape="circle" size="small" onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                this.setState({...this.state, commentModal: true, workplan: workplan});
                                                                            }}/>
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                            }
                                                        >
                                                            {/*<List*/}
                                                            {/*    renderItem={(item, ind) =>*/}
                                                            {/*        <div>*/}
                                                            {/*            <Row style={ind !== ((workplan || []).jobs || []).length-1 ? {marginBottom: 10} : { }}>*/}
                                                            {/*                <Col span={16}>*/}
                                                            {/*                    <Tooltip*/}
                                                            {/*                        title={item.title}*/}
                                                            {/*                    >*/}
                                                            {/*                        <b style={{fontWeigth: 800, display: 'block', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{ind+1}. {item.title}</b>*/}
                                                            {/*                    </Tooltip>*/}
                                                            {/*                </Col>*/}
                                                            {/*                <Col span={4}>*/}
                                                            {/*                    {*/}
                                                            {/*                        item.status !== 'approved' ?*/}
                                                            {/*                            item.check_lists && (item.check_lists || []).length > 0 ?*/}
                                                            {/*                                <div style={{marginRight: '20px'}}>*/}
                                                            {/*                                    Жагсаалт:&nbsp;*/}
                                                            {/*                                    {((((item.check_lists || []).filter(listItem => (listItem.bool || false)) || []).length)+"/"+((item.check_lists || []).length))}*/}
                                                            {/*                                </div>*/}
                                                            {/*                                :*/}
                                                            {/*                                null*/}
                                                            {/*                            :*/}
                                                            {/*                            `Гүйцэтгэл: ${(item.completion || 0)}%`*/}
                                                            {/*                    }*/}
                                                            {/*                </Col>*/}
                                                            {/*                <Col span={4}>*/}
                                                            {/*                    {*/}
                                                            {/*                        item.status === 'approved' ? <Tag style={{margin: 0}} color="green">Үнэлэгдсэн</Tag>*/}
                                                            {/*                            :*/}
                                                            {/*                            item.status === 'decline' ? <Tag style={{margin: 0}} color="red">Татгалзсан</Tag>*/}
                                                            {/*                                :*/}
                                                            {/*                                item.status === 'checking' ? <Tag style={{margin: 0}} color='geekblue'>Шалгаж байгаа</Tag>*/}
                                                            {/*                                    :*/}
                                                            {/*                                    <Tag style={{margin: 0}}>Шинэ</Tag>*/}
                                                            {/*                    }*/}
                                                            {/*                </Col>*/}
                                                            {/*                {*/}
                                                            {/*                    item.comment ?*/}
                                                            {/*                        item.comment*/}
                                                            {/*                        :*/}
                                                            {/*                        null*/}
                                                            {/*                }*/}
                                                            {/*            </Row>*/}
                                                            {/*        </div>*/}
                                                            {/*    }*/}
                                                            {/*    dataSource={(workplan || {}).jobs}*/}
                                                            {/*/>*/}
                                                            <List
                                                                dataSource={(workplan || {}).jobs}
                                                                renderItem={(item) => (
                                                                    <List.Item
                                                                        extra={
                                                                            <div style={{display: 'flex', flexDirection: 'row'}}>
                                                                                {
                                                                                    item.status !== 'approved' ?
                                                                                        item.check_lists && (item.check_lists || []).length > 0 ?
                                                                                            <div style={{marginRight: '20px'}}>
                                                                                                Жагсаалт:&nbsp;
                                                                                                {((((item.check_lists || []).filter(listItem => (listItem.bool || false)) || []).length)+"/"+((item.check_lists || []).length))}
                                                                                            </div>
                                                                                            :
                                                                                            null
                                                                                        :
                                                                                        <span>Гүйцэтгэл: {(item.completion || 0)}%</span>
                                                                                }
                                                                                {
                                                                                    item.status === 'approved' ? <Tag style={{margin: 0}} color="green">Үнэлэгдсэн</Tag>
                                                                                        :
                                                                                        item.status === 'decline' ? <Tag style={{margin: 0}} color="red">Татгалзсан</Tag>
                                                                                            :
                                                                                            item.status === 'checking' ? <Tag style={{margin: 0}} color='geekblue'>Шалгаж байгаа</Tag>
                                                                                                :
                                                                                                <Tag style={{margin: 0}}>Шинэ</Tag>
                                                                                }
                                                                            </div>
                                                                        }
                                                                    >
                                                                        <List.Item.Meta
                                                                            title={<b style={{fontWeigth: 800, display: 'block', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden'}}>{((workplan || {}).jobs || []).indexOf(item)+1}. {item.title}</b>}
                                                                            description={item.comment ? item.comment : null}
                                                                        />
                                                                    </List.Item>
                                                                )}
                                                            />
                                                        </Collapse.Panel>
                                                    )
                                                }
                                            </Collapse>
                                            :
                                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Ажил гүйцэтгэл хоосон байна.</span>} />
                                    }

                                </Card>
                            </Col>
                        </Row>
                        <Modal
                            centered
                            visible={this.state.commentModal}
                            title={`${moment((this.state.workplan || {}).year_month).format("YYYY оны MM сарын төлөвлөгөө")}`}
                            onCancel={()=>this.setState({...this.state, commentModal: false, workplan: {}})}
                            footer={null}
                        >
                            {(this.state.workplan || {}).comment}
                        </Modal>
                    </div>
                </React.Fragment>
        );
    }
}

export default  connect(reducer)(Dashboard);