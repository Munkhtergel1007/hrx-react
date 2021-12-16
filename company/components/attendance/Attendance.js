import React, {Component} from "react";
import { connect } from 'react-redux';
import config, {hasAction, isValidDate, printMnDay, companyAdministrator, checkIfDayInGap, dayToNumber, getDatesBetweenDates} from "../../config";
import {locale} from '../../lang';
import moment from "moment";
import * as actions from "../../actions/attendance_actions";
import { Link } from 'react-router-dom';
import AttendanceModal from "./AttendanceModal";
const reducer = ({ main, attendance }) => ({ main, attendance });
import {
    Card,
    DatePicker,
    Button,
    Table,
    Popconfirm,
    Tag,
    Input,
    Badge,
    Select,
    List,
    Tooltip,
    Empty,
    Modal,
    Space,
    Typography, Pagination,
    Calendar, Form, TimePicker
} from 'antd';
import { SearchOutlined} from '@ant-design/icons'
const {Title, Text} = Typography
const monthFormat = 'YYYY/MM';

import ExportExcel from "../utils/modalExportEx";
const xls = require('xlsx');
const utils = xls.utils;

class Attendance extends Component {
    constructor(props) {
        super(props);
        let date = new Date()
        this.handleCancel = this.handleCancel.bind(this)
        this.state = {
            start_date: '',
            end_date: '',
            selected_month: moment(date).format('YYYY/MM'),
            pageSize: 10,
            pageNum: 0,
            search: '',
            visible: false,
            name: '',
            paidDays: 0,
            reason: '',
            type: '',
            breakType: '',
            dates: [],
            localTime: null,
            id: null,
            editting: '',
            employee: null,
            user: null,
            timetable: null,

            exportChecked : {
                splitCompany: false, // company-aar salgah
                first_name: true,
                last_name: true,
                register: true, // Регистр
                company: false, // Компани
                workedHour: true,
                workingDay: true,
                vacation: true,
                break: true,
                came: true,
                late: true,
                wentEarly: true,
                wentWithoutChecking: true,
            },
            exportModal : false,
            exportType: '',
        };
    }
    componentDidMount() {
        let {main: {employee}} = this.props;
        // if(!hasAction(['see_attendance'], employee)){
        //     this.props.history.replace('/not-found');
        // }else{
            let cc = {
                selected_month: this.state.selected_month,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            };
            this.props.dispatch(actions.getAttendance(cc))
        // }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // // console.log((document.querySelector('.ant-table-header') || {}).scrollLeft, (document.querySelector('.ant-table-body') || {}).scrollLeft)
        // if(document.querySelector('.ant-table-header')){
        //     let scroll = document.querySelector('.ant-table-body').scrollLeft;
        //     console.log(scroll)
        //     document.querySelector('.ant-table-header').scrollLeft = 1000;
        // }
        // (document.querySelector('.ant-table-body') || {}).scrollLeft
        // let aa = document.querySelector('.ant-table-header') || {};
        // aa.scrollLeft = 1000
        // console.log(aa.scrollLeft)
        // console.log((document.querySelector('.ant-table-header') || {}).scrollLeft, (document.querySelector('.ant-table-body') || {}).scrollLeft)
    }

    getMassAttendance(){
        const {dispatch} = this.props;
        if(!this.state.selected_month){
            return config.get('emitter').emit('warning', ("Сар сонгоно уу!"));
        }
        // let search = document.querySelector('.attendance-search').value;
        let search = document.querySelector('.ant-input').value;
        let cc = {
            selected_month: this.state.selected_month,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            search: search
        };
        if(search !== ''){
            this.setState({pageNum: 0}, () => {
                dispatch(actions.getAttendance(cc));
            });
        }else{
            dispatch(actions.getAttendance(cc));
        }
    }
    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(actions.unmountAttendance());
    }
    handleCancel(){
        this.setState({
            ...this.state,
            name: '',
            reason: '',
            visible: false,
            type: '',
            breakType: '',
            dates: [],
            paidDays: 0,
            localTime: null,
            id: null,
            editting: '',
            employee: null,
            user: null,
            timetable: null
        })
    }

    export(type){
        let checkeds = {
            splitCompany: false, // company-aar salgah
            first_name: true,
            last_name: true,
            register: true, // Регистр
            company: false, // Компани
            workedHour: true,
            workingDay: true,
            vacation: true,
            break: true,
            came: true,
            late: true,
            wentEarly: true,
            wentWithoutChecking: true,
        }
        this.setState({exportType : type , exportModal : true , exportChecked : checkeds});
    }
    hideExportM(){
        this.setState({exportType : '' , exportModal : false});
        // this.props.dispatch(actions.eeStudentsAction.allExported());
    }
    setExport(e){
        let ch = this.state.exportChecked;
        ch[e.target.name] = !ch[e.target.name];
        this.setState({exportChecked : ch});
    }
    exportDisp(){
        this.exportSalary();
    }
    exportAll(){
        // const {params , dispatch} = this.props;
        // const {numEXport} = this.state;
        // let num = numEXport + 1;
        // this.setState({numEXport : num} , () => {
        //     dispatch(actions.eeStudentsAction.exportStudent(params.schoolslug , "teacher" , numEXport * 50 , 'all'));
        // });
    }
    async exportSalary(){
        function getDayOfWeek(year, month, day){
            let date = new Date(year+ '/' + month+ '/' +day);
            return date.getDay() === 0? 7 : date.getDay();
        }
        this.props.dispatch(actions.getAttendanceAll({selected_month: this.state.selected_month, pageSize: (this.props.attendance.all || 1000)})).then(c => {
            console.log(c);
            const {exportChecked} = this.state;

            let returnItem = [];
            let results0 = c.json.results0 || [];
            let results1 = c.json.results1 || [];
            let results2 = c.json.results2 || [];
            let results3 = c.json.results3 || [];
            results0.map(function (r){
                r.defaultAtt = ((r.defaultAtt || []).filter(m => m) || [])[0];
                r.activeAtt = (r.activeAtt || []).filter(m => m);
                r.irsen = r.activeAtt.length>0 ? r.activeAtt[0] : null
                if(r.irsen && r.irsen.timetable){
                    r.tsagiinHuvaari = r.irsen.timetable;
                } else if(r.defaultAtt && r.defaultAtt.timetable){
                    r.tsagiinHuvaari = r.defaultAtt.timetable;
                } else {
                    r.tsagiinHuvaari = null;
                }
                if(0 < (r.activeAtt || []).length-1){
                    r.yvsan = (r.activeAtt || [])[(r.activeAtt || []).length-1];
                } else {
                    r.yvsan = null;
                }
                delete r.activeAtt;
                delete r.defaultAtt;
            });
            results1.map(function (r) {
                let irts = [];
                (c.json.days || []).map(function (d) {
                    let dayOfWeek = getDayOfWeek(c.json.year, c.json.month, d);
                    let workingDay = 'none';
                    if(dayOfWeek === 6  || dayOfWeek === 7){
                        workingDay = 'notWorkingDef';
                    } else {
                        workingDay = 'workingDef';
                    }
                    irts.push({day: d, dayOfWeek: dayOfWeek, timeline:null, arrived:false, workingDay:workingDay, late:0, early:null,  irsen:null, yvsan:null, type:null, reason: null, reasonBreakInfo:{}, reasonVacationInfo:{}});
                });
                returnItem.push({employee:r, irts:irts});
            });
            // -*- Vacation START
            results3.map(function (b) {
                let days= [];
                if(b.selected_dates && b.selected_dates.length>0){
                    days = b.selected_dates;
                } else {
                    days = getDatesBetweenDates(b.starting_date, b.ending_date);
                }
                (returnItem || []).map(function (ret) {
                    if((b.employee.emp || 'aa').toString() === (ret.employee._id || 'bb').toString()){
                        ret.irts.map(function (irts) {
                            if(checkIfDayInGap(c.json.selected_month+'/'+irts.day, days)){
                                irts.reasonVacationInfo = b;
                                irts.reason = 'vacation';
                                // irts.workingDay = 'vacation';
                            }
                        });
                    }
                });
            });
            // -*- Vacation END
            // -*- Break START
            results2.map(function (b) {
                let days = getDatesBetweenDates(b.starting_date, b.ending_date);
                (returnItem || []).map(function (ret) {
                    if((b.employee.emp || 'aa').toString() === (ret.employee._id || 'bb').toString()){
                        ret.irts.map(function (irts) {
                            if(
                                irts.reason !== 'vacation' &&
                                checkIfDayInGap(c.json.selected_month+'/'+irts.day, days)){
                                irts.reasonBreakInfo = b;
                                irts.reason = 'break'
                                // irts.workingDay = 'break';
                            }
                        });
                    }
                });
            });
            // -*- Break END
            (results0 || []).map(function (att) {
                (returnItem || []).map(function (ret) {
                    if(att._id.employee.toString() === ret.employee._id.toString()){
                        ret.irts.map(function (irts) {
                            if(
                                // (irts.reason !=='vacation' && irts.reason !=='break') &&
                                att._id.day === irts.day
                            ){
                                if(att.tsagiinHuvaari && att.tsagiinHuvaari.days && att.tsagiinHuvaari.days.length>0){
                                    irts.workingDay = 'notWorking';
                                    irts.tsagiinHuvaari = att.tsagiinHuvaari;
                                    att.tsagiinHuvaari.days.map(function (r) {
                                        if(irts.dayOfWeek === dayToNumber(r.title)){
                                            irts.workingDay = 'working';
                                            let workingHour = (r.startingHour || '').split(':');
                                            let workingHourEnd = (r.endingHour || '').split(':');
                                            // let totalWorkHour = calTotalWorkHour(r.startingHour, r.endingHour)
                                            if(att.irsen){
                                                // if(att.irsen.hour < parseInt(workingHour[0])){
                                                //     irts.late = false;
                                                // } else if(att.irsen.hour === parseInt(workingHour[0]) && att.irsen.minute <= parseInt(workingHour[1])){
                                                //     irts.late = false;
                                                // } else {
                                                //     irts.late = true;
                                                // }
                                                if(att.irsen.hour < parseInt(workingHour[0])){
                                                    irts.late = 0;
                                                } else if(att.irsen.hour === parseInt(workingHour[0]) && att.irsen.minute <= parseInt(workingHour[1])){
                                                    irts.late = 0;
                                                } else {
                                                    irts.late = (att.irsen.hour-parseInt(workingHour[0]))*60+(att.irsen.minute-parseInt(workingHour[1]));
                                                }
                                            }
                                            if(att.yvsan && att.yvsan != null && typeof att.yvsan != 'unidentified'&& typeof att.yvsan === 'object'){
                                                if(att.yvsan.hour > parseInt(workingHourEnd[0])){
                                                    irts.early = false;
                                                } else if(att.yvsan.hour === parseInt(workingHourEnd[0]) && att.yvsan.minute >= parseInt(workingHourEnd[1])){
                                                    irts.early = false;
                                                } else {
                                                    irts.early = true;
                                                }
                                            } else {
                                                irts.early = false;
                                            }
                                        }
                                    });
                                } else {
                                    // if(irts.workingDay !== 'working'){
                                    //     irts.workingDay = 'notWorking';
                                    // }
                                    if(att.irsen){
                                        if(att.irsen.hour < 10){
                                            irts.late = 0;
                                        } else if(att.irsen.hour === 10 && att.irsen.minute <= 0){
                                            irts.late = 0;
                                        } else {
                                            irts.late = (att.irsen.hour-10)*60+(att.irsen.minute-0);
                                        }
                                    }
                                    if(att.yvsan){
                                        if(att.yvsan.hour > 18){
                                            irts.early = false;
                                        } else if(att.yvsan.hour === 18 && att.yvsan.minute >= 0){
                                            irts.early = false;
                                        } else {
                                            irts.early = true;
                                        }
                                    } else {
                                        irts.early = false;
                                    }
                                }
                                irts.arrived = !!att.irsen;
                                irts.irsen = att.irsen;
                                irts.yvsan = att.yvsan;
                                // irts.activeAtt = att.activeAtt;
                                // irts.defaultAtt = att.defaultAtt;
                                irts.timeline = att.timeline;
                                if(att.irsen && att.yvsan && (att.irsen._id || 'i').toString() !== (att.yvsan._id || 'y').toString()){
                                    irts.yvsan = att.yvsan;
                                }

                                let hours = 0;
                                    let mins = 0;
                                    let secs = 0;
                                    let breakDuration = 0;
                                    if(irts.irsen && irts.irsen.localTime && irts.yvsan && irts.yvsan.localTime){
                                        let dayA = new Date(irts.irsen.localTime);
                                        let dayB = new Date(irts.yvsan.localTime);
                                        let diff =( dayB.getTime() - dayA.getTime() ) / 1000;
                                        hours = Math.floor(diff / 60 / 60);
                                        mins = Math.floor((diff - (hours * 60 * 60)) / 60);
                                        secs = Math.floor((diff - ((hours * 60 * 60) + (mins * 60) )));
                                        if(
                                            irts.reasonBreakInfo?.type && 
                                            irts.reasonBreakInfo?.starting_date && 
                                            irts.reasonBreakInfo?.ending_date
                                        ){
                                            if(irts.reasonBreakInfo.type === 'hour'){
                                                let start = dayA, end = dayB;
                                                let breakStart = new Date(irts.reasonBreakInfo.starting_date),
                                                    breakEnd = new Date(irts.reasonBreakInfo.ending_date);
                                                if(
                                                    dayA.getHours() > breakStart.getHours() ||
                                                    (dayA.getHours() === breakStart.getHours() &&
                                                    dayA.getMinutes() > breakStart.getMinutes())
                                                ){
                                                    breakDuration += start.getTime() - breakStart.getTime();
                                                    start = breakEnd;
                                                }   
                                                if(
                                                    dayB.getHours() < breakEnd.getHours() ||
                                                    (dayB.getHours() === breakEnd.getHours() &&
                                                    dayB.getMinutes() < breakEnd.getMinutes())
                                                ){
                                                    breakDuration += end.getTime() - breakEnd.getTime();
                                                    end = breakStart;
                                                }
                                                if(start === dayA && end === dayB){
                                                    //get second difference of break and substract this from worked duration
                                                    //hour difference
                                                    hours -= breakStart.getHours();
                                                    hours < 0 ? hours = 0 : null;
                                                    //min difference
                                                    mins -= breakStart.getMinutes();
                                                    mins < 0 ? mins = 0 : null;
                                                    //sec difference
                                                    secs -= breakStart.getSeconds();
                                                    secs < 0 ? secs = 0 : null;
                                                    breakDuration = breakEnd.getTime() - breakStart.getTime(); // in seconds
                                                }else{
                                                    //this means break overextended over either the start of the working hour or the end of the working hour
                                                    diff =( end.getTime() - start.getTime() ) / 1000;
                                                    hours = Math.floor(diff / 60 / 60);
                                                    mins = Math.floor((diff - (hours * 60 * 60)) / 60);
                                                    secs = Math.floor((diff - ((hours * 60 * 60) + (mins * 60) )));
                                                }
                                            }else{
                                                hours = 0;
                                                mins = 0;
                                                secs = 0;
                                                if(irts.tsagiinHuvaari){
                                                    (irts.tsagiinHuvaari.days || []).map(day => {
                                                        if(
                                                            irts.dayOfWeek === dayToNumber(day.title) &&
                                                            day.startingHour && day.endingHour 
                                                        ){
                                                            let [startTime, startMinute] = day.startingHour.split(":");
                                                            let [endTime, endMinute] = day.endingHour.split(":");
                                                            breakDuration = ((parseInt(endMinute)*60+parseInt(endTime)*3600) - (parseInt(startMinute)*60+parseInt(startTime)*3600))*1000;
                                                        }
                                                    });
                                                }else{
                                                    breakDuration = (3600*6*1000);
                                                }
                                            }
                                        }
                                    }
                                    if(!irts.yvsan){
                                        irts.noYvsanHour = 1;
                                    }
                                    if(breakDuration){
                                        irts.breakDuration = breakDuration;
                                    }
                                    irts.hours = hours;
                                    irts.mins = mins;
                                    irts.secs = secs;
                            }
                        });
                    }
                });
            });
            (returnItem || []).map(function (ret) {
                let totalWorkedHour = 0;
                let totalWorkedMin = 0;
                let totalWorkedSec = 0;
                let noYvsanHour = 0;
                let totalWorkDay = 0;
                let totalArrivedDay = 0;
                let totalBreakDay = 0;
                let totalVacationDay = 0;
                let totalBreakDayTypeDay = 0;
                let totalBreakDayPaid = 0;
                let totalBreakDuration = 0;
                let totalHours = 0;
                let totalLate = 0;
                let totalEarly = 0;

                (ret.irts || []).map(function (irts) {
                    totalWorkedHour += (irts.hours || 0);
                    totalWorkedMin += (irts.mins || 0);
                    totalWorkedSec += (irts.secs || 0);
                    noYvsanHour += (irts.noYvsanHour || 0);
                    totalArrivedDay += irts.arrived ? 1 : 0;

                    if(irts.workingDay === 'working' || irts.workingDay === 'workingDef'){
                        totalWorkDay += 1;
                        totalLate += irts.late ? irts.late : 0;
                        totalEarly += irts.early === true ? 1 : 0;
                        totalBreakDay += irts.reason === 'break' ? 1 : 0;
                        totalBreakDayTypeDay += irts.reason === 'break' && irts.reasonBreakInfo?.type && irts.reasonBreakInfo?.type === 'day' ? 1 : 0;
                        totalBreakDayPaid += irts.reason === 'break' && irts.reasonBreakInfo?.type && irts.reasonBreakInfo?.type === 'day' ? irts.reasonBreakInfo.howManyDaysPaid || 0 : 0;
                        totalBreakDuration += irts.breakDuration || 0;
                        totalVacationDay += irts.reason === 'vacation' ? 1 : 0;
                    }
                });
                let retTotalWorkedHour = 0;
                let retTotalWorkedMin = 0;
                let retTotalWorkedSec = 0;
                totalBreakDuration /= 1000;
                retTotalWorkedSec = totalWorkedSec % 60;
                retTotalWorkedMin = totalWorkedMin + Math.floor(totalWorkedSec / 60);
                retTotalWorkedHour = totalWorkedHour + Math.floor(retTotalWorkedMin / 60);
                retTotalWorkedMin = retTotalWorkedMin % 60;
                ret.totalBreakDayTypeDay = totalBreakDayTypeDay;
                ret.totalBreakDayPaid = totalBreakDayPaid;
                ret.totalBreakDurationHours = Math.floor(totalBreakDuration / 60 / 60);
                ret.totalBreakDurationMinutes = Math.floor((totalBreakDuration - (ret.totalBreakDurationHours * 60 * 60)) / 60);
                // ret.totalBreakDurationSeconds = Math.floor((totalBreakDuration - ((ret.totalBreakDurationHours * 60 * 60) + (ret.totalBreakDurationMinutes * 60) )));
                ret.workedHour = retTotalWorkedHour;
                ret.workedMin = retTotalWorkedMin;
                ret.workedSec = retTotalWorkedSec;
                ret.noYvsanHour = noYvsanHour;
                ret.totalWorkDay = totalWorkDay;
                ret.totalArrivedDay = totalArrivedDay;
                ret.totalBreakDay = totalBreakDay;
                ret.totalVacationDay = totalVacationDay;
                ret.totalLate = totalLate;
                ret.totalEarly = totalEarly;
            });
            // console.log(returnItem);
            let data = (returnItem || []).map((att) => {
                let sheet = {};
                
                if(exportChecked.register){sheet['Регистр'] = ((att.employee.user || {}).register_id || '').toString().trim();}
                if(exportChecked.last_name){sheet['Овог'] = ((att.employee.user || {}).last_name || '').toString().trim();}
                if(exportChecked.first_name){sheet['Нэр'] = ((att.employee.user || {}).first_name || '').toString().trim();}
                if(exportChecked.company){sheet['Компани'] = att.employee.company && att.employee.company.name ? att.employee.company.name.toString().trim() : '';}
                sheet['companyName'] = att.employee.company && att.employee.company.name ? att.employee.company.name.toString().trim() : '';
                sheet['companyId'] = att.employee.company && att.employee.company._id ? att.employee.company._id.toString().trim() : '';
                (att.irts || []).map(attt => {
                    if(attt.irsen){
                        sheet[`${attt.day}-Ирсэн`] = moment(attt.irsen.localTime).format("HH:mm");
                    }else{
                        sheet[`${attt.day}-Ирсэн`] = '';
                    }
                    if(attt.yvsan){
                        sheet[`${attt.day}-Явсан`] = moment(attt.yvsan.localTime).format("HH:mm");
                    }else{
                        sheet[`${attt.day}-Явсан`] = '';
                    }
                });
                if(exportChecked.workedHour){sheet['Ажилласан цаг'] = `${att.workedHour} цаг ${att.workedMin} минут`};
                if(exportChecked.workingDay){sheet['Ажиллах өдрүүд'] = att.totalWorkDay};
                if(exportChecked.vacation){sheet['Амарсан өдрүүд'] = att.totalVacationDay};
                if(exportChecked.break){
                    sheet['Чөлөөтэй'] = `${(att.totalBreakDurationHours || 0)}цаг ${(att.totalBreakDurationMinutes || 0)}мин`;
                    sheet['Чөлөөтэй өдрүүд'] = `${(att.totalBreakDayPaid || 0)} цалинтай /${(att.totalBreakDayTypeDay || 0)} өдөр`;
                };
                if(exportChecked.came){sheet['Ирсэн'] = att.totalArrivedDay};
                if(exportChecked.late){sheet['Хоцорсон'] = `${parseInt(att.totalLate/60)} цаг ${att.totalLate-parseInt(att.totalLate/60)*60} минут`};
                if(exportChecked.wentEarly){sheet['Эрт явсан'] = att.totalEarly};
                if(exportChecked.wentWithoutChecking){sheet['Явсан цаг бүртгүүлээгүй'] = att.noYvsanHour};
                return sheet;
            });
            let companyIds = [];
            let sheets = [];
            if(exportChecked.splitCompany){
                (data || []).map(function (r) {
                    if(!companyIds.some(s => s === r.companyId)){
                        // if(companyIds && companyIds.length>0){
                        companyIds.push(r.companyId);
                        // } else {
                        //     companyIds = [r.companyId];
                        // }
                    }
                });
                (companyIds || []).map(function (r, idx) {
                    let com = {name: `Ирц ${idx+1}`, data: []};
                    (data || []).map(function (d) {
                        if(d.companyId === r){
                            // com.data.push(function (r) {
                            //     delete r.companyId;
                            //     return r;
                            // })
                            com.data.push(d)
                            com.name = (d.companyName || '').slice(0, 30)
                        }
                    });
                    sheets.push(com);
                });
            } else {
                sheets = [{name: 'Ирц', data: data}];
            }
    
            if(exportChecked.last_name || exportChecked.first_name || exportChecked.register){
                // exportEx(data , 'Цалин');
                this.exEx(sheets);
                this.hideExportM();
            }
        });
    }
    exEx(sheets){
        let workbook = utils.book_new();
        (sheets || []).map(function (r) {
            let data = r.data;
            data.map(function (da) {
                delete da.companyId;
                delete da.companyName;
            });
            let sheet = utils.json_to_sheet(data);
            utils.book_append_sheet(workbook , sheet , (r.name || 'Ирц'));
        });
        let result = xls.writeFile(workbook , `Ирц.xls`);
        return result;
    }
    render() {
        const {main:{employee}, attendance:{attendance, gettingAttendance, days, selectedMonth, allWorkingHour, all, search, loadingAll}} = this.props;
        function reasonPrint(reason) {
            let result;
            switch(reason) {
                case 'break': result = <Tag color='geekblue'>{locale('common_attendance.chuluutei_table')}</Tag>; break;
                case 'irsen': result = <Tag color='green'>{locale('common_attendance.irsen_table')}</Tag>; break;
                case 'vacation': result = <Tag color='purple'>{locale('common_attendance.amarsan_table')}</Tag>; break;
                case 'ireegui': result = <Tag color='red'>{locale('common_attendance.ireegui_table')}</Tag>; break;
            }
            return result;
        }
        let date = new Date();
        const dayColumn = days.map((r, index) => {
            return {
                key: (r || '').toString() + "Ofmonth",
                title: <span style={{textAlign: 'center'}}>{r} /{selectedMonth ? printMnDay(moment(`${selectedMonth}/${r}`).format("dddd")) : ''}/</span>,
                width: 150,
                children: [
                    {
                        title: <div style={{textAlign: 'center'}}>{locale('common_attendance.irsen')}</div>,
                        key: (r || '').toString() + (Math.random() || '').toString() + "arrivedOfmonth",
                        width: 75,
                        render: (ele, row, index) => {
                            let style = {textAlign: 'center'};
                            if((((row.irts || [])[r-1] || {}).workingDay || '') === 'workingDef' || (((row.irts || [])[r-1] || {}).workingDay || '') === 'working'){
                                switch ((((row.irts || [])[r-1] || {}).reason || '')) {
                                    case "break":
                                        // style.cursor = "pointer";
                                        ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).type || '') === 'hour' ?
                                            style.backgroundColor = '#FF5733' : style.backgroundColor = '#adc6ff';
                                        break;
                                    case "vacation":
                                        // style.cursor = "pointer";
                                        style.backgroundColor = '#d3adf7';
                                        break;
                                    default:
                                        style.backgroundColor = '#fff';
                                }
                            }else{
                                style.backgroundColor = '#ccc';
                            }
                            if(((row.irts || [])[r-1] || {}).arrived){
                                return (
                                    <div
                                        key={Math.random()}
                                        style={style}
                                        onClick={() => companyAdministrator(employee) && this.setState({
                                            type: 'edit',
                                            name: `${((row.employee || {}).user || {}).last_name} ${((row.employee || {}).user || {}).first_name}`,
                                            reason: (((row.irts || [])[r-1] || {}).irsen || {}).reason,
                                            time: ((row.irts || [])[r-1] || {}).irsen && (((row.irts || [])[r-1] || {}).irsen || {}).localTime ? moment((((row.irts || [])[r-1] || {}).irsen || {}).localTime) : null,
                                            localTime: ((row.irts || [])[r-1] || {}).irsen && (((row.irts || [])[r-1] || {}).irsen || {}).localTime ? moment((((row.irts || [])[r-1] || {}).irsen || {}).localTime).format('YYYY-MM-DD') : null,
                                            visible: true,
                                            id: ((row.irts || [])[r-1] || {}).irsen && (((row.irts || [])[r-1] || {}).irsen || {})._id,
                                            editting: 'irsen',
                                        })}
                                    >
                                        <span style={(((row.irts || [])[r-1] || {}).late || false) ? {borderBottom: '1px solid red'} : {}}>
                                            {((row.irts || [])[r-1] || {}).irsen && (((row.irts || [])[r-1] || {}).irsen || {}).localTime ? moment((((row.irts || [])[r-1] || {}).irsen || {}).localTime).format("H:mm") : '-'}
                                        </span>
                                    </div>
                                )
                            }else{
                                return {
                                    children:
                                        <div key={Math.random()}
                                             onClick={() =>
                                                style.backgroundColor === '#d3adf7' ?
                                                    this.setState({
                                                        type: 'vacation',
                                                        visible: true,
                                                        name: `${((row.employee || {}).user || {}).last_name} ${((row.employee || {}).user || {}).first_name}`,
                                                        dates: ((((row.irts || [])[r-1] || {}).reasonVacationInfo || {}).selected_dates || []),
                                                        start_date: ((((row.irts || [])[r-1] || {}).reasonVacationInfo || {}).starting_date || {}),
                                                        end_date: ((((row.irts || [])[r-1] || {}).reasonVacationInfo || {}).ending_date || {})
                                                    })
                                                    : style.backgroundColor === '#adc6ff' ?
                                                         this.setState({
                                                             type: 'break',
                                                             breakType: 'day',
                                                             visible: true,
                                                             reason: ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).reason || ''),
                                                             paidDays: ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).howManyDaysPaid || 0),
                                                             name: `${((row.employee || {}).user || {}).last_name} ${((row.employee || {}).user || {}).first_name}`,
                                                             dates: [((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).starting_date || ''), ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).ending_date || '')]
                                                     })
                                                    :style.backgroundColor === '#ff5733' ?
                                                        this.setState({
                                                            type: 'break',
                                                            breakType: 'hour',
                                                            visible: true,
                                                            reason: ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).reason || ''),
                                                            paidDays: ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).howManyDaysPaid || 0),
                                                            name: `${((row.employee || {}).user || {}).last_name} ${((row.employee || {}).user || {}).first_name}`,
                                                            dates: [((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).starting_date || ''), ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).ending_date || '')]
                                                        })
                                                    : companyAdministrator(employee) && style.backgroundColor === '#fff' ?
                                                        this.setState({
                                                            type: 'new',
                                                            name: `${((row.employee || {}).user || {}).last_name} ${((row.employee || {}).user || {}).first_name}`,
                                                            visible: true,
                                                            localTime: moment(`${moment(selectedMonth).format('YYYY-MM')}-${((row.irts || [])[r-1] || {}).day}`).format('YYYY-MM-DD'),
                                                            employee: (row.employee || {})._id,
                                                            user: ((row.employee || {}).user || {})._id,
                                                            timetable: (row.employee || {}).timetable
                                                        })
                                                    : null
                                            }
                                             style={style}>{
                                                // ((row.irts || [])[r-1] || {}).workingDay === 'working' || ((row.irts || [])[r-1] || {}).workingDay === 'workingDef' ?
                                                //     'Ирээгүй'
                                                //     :
                                                //     '-'
                                            ((row.irts || [])[r-1] || {}).workingDay === 'notWorking' || ((row.irts || [])[r-1] || {}).workingDay === 'notWorkingDef' ?
                                                '-'
                                                :
                                                ((row.irts || [])[r-1] || {}).reason === 'break' || ((row.irts || [])[r-1] || {}).reason === 'vacation' ?
                                                    '-'
                                                    :
                                                    locale('common_attendance.ireegui_table')
                                        }</div>,
                                    props: {
                                        colSpan: 2
                                    }
                                }
                            }
                        },
                    },
                    {
                        title: <div key={Math.random()} style={{textAlign: 'center'}}>{locale('common_attendance.ywsan')}</div>,
                        key: (r || '').toString() + (Math.random() || '').toString() + "leftOfmonth",
                        width: 75,
                        render: (ele, row, index) => {
                            let style = {textAlign: 'center'};
                            if((((row.irts || [])[r-1] || {}).workingDay || '') === 'workingDef' || (((row.irts || [])[r-1] || {}).workingDay || '') === 'working'){
                                switch ((((row.irts || [])[r-1] || {}).reason || '')) {
                                    case "break":
                                        // style.cursor = "pointer";
                                        ((((row.irts || [])[r-1] || {}).reasonBreakInfo || {}).type || '') === 'hour' ?
                                            style.backgroundColor = '#FF5733' : style.backgroundColor = '#adc6ff';
                                        break;
                                    case "vacation":
                                        // style.cursor = "pointer";
                                        style.backgroundColor = '#d3adf7';
                                        break;
                                    default:
                                        style.backgroundColor = '#fff';
                                }
                            }else{
                                style.backgroundColor = '#ccc';
                            }
                            if(((row.irts || [])[r-1] || {}).arrived){
                                return (
                                    <div
                                        key={Math.random()}
                                        style={style}
                                        onClick={() => companyAdministrator(employee) && this.setState({
                                            type: 'edit',
                                            name: `${((row.employee || {}).user || {}).last_name} ${((row.employee || {}).user || {}).first_name}`,
                                            visible: true,
                                            reason: (((row.irts || [])[r-1] || {}).yvsan || {}).reason,
                                            time: ((row.irts || [])[r-1] || {}).yvsan && (((row.irts || [])[r-1] || {}).yvsan || {}).localTime ? moment((((row.irts || [])[r-1] || {}).yvsan || {}).localTime) : null,
                                            localTime: ((row.irts || [])[r-1] || {}).yvsan && (((row.irts || [])[r-1] || {}).yvsan || {}).localTime
                                                ? moment((((row.irts || [])[r-1] || {}).yvsan || {}).localTime).format('YYYY-MM-DD')
                                                : moment(`${moment(selectedMonth).format('YYYY-MM')}-${((row.irts || [])[r-1] || {}).day}`).format('YYYY-MM-DD'),
                                            id: ((row.irts || [])[r-1] || {}).yvsan && (((row.irts || [])[r-1] || {}).yvsan || {})._id,
                                            editting: 'yvsan',
                                            employee: (row.employee || {})._id,
                                            user: ((row.employee || {}).user || {})._id,
                                            timetable: (row.employee || {}).timetable
                                        })}
                                    >
                                        {((row.irts || [])[r-1] || {}).yvsan && (((row.irts || [])[r-1] || {}).yvsan || {}).localTime ? moment((((row.irts || [])[r-1] || {}).yvsan || {}).localTime).format("H:mm") : '-'}
                                    </div>
                                )
                            }else{
                                return {
                                    children: <div key={Math.random()}/>,
                                    props: {
                                        colSpan: 0
                                    }
                                }
                            }
                        },
                    }
                ],
            }
        });
        let worthy = false;
        if(hasAction(['see_attendance'], employee)){
            worthy = true;
        }
        const columns = [
            {
                title: <div style={{textAlign: 'center'}}>№</div>,
                key: 'index',
                align: 'center',
                render: (record) => (attendance || []).indexOf(record)+1+(this.state.pageNum)*this.state.pageSize,
                fixed: 'left',
                width: 40
            },
            {
                title: <div style={{textAlign: 'center'}}>{locale('common_attendance.owog_ner')}</div>,
                key: 'nameOfEmployee',
                render: (record) => <Tooltip title={
                    <span>
                        {(((record.employee || {}).user || {}).last_name || '').charAt(0).toUpperCase()}{(((record.employee || {}).user || {}).last_name || '').slice(1).toLowerCase()}&nbsp;
                        {(((record.employee || {}).user || {}).first_name || '').charAt(0).toUpperCase()}{(((record.employee || {}).user || {}).first_name || '').slice(1).toLowerCase()}
                    </span>
                }>
                    <div className='emp_name'>
                        {
                            (((record.employee || {}).user || {}).last_name || '').length + (((record.employee || {}).user || {}).first_name || '').length > 25 ?
                                `${(((record.employee || {}).user || {}).last_name || '').charAt(0).toUpperCase()}.${(((record.employee || {}).user || {}).first_name || '').charAt(0).toUpperCase()}${(((record.employee || {}).user || {}).first_name || '').slice(1).toLowerCase()}`
                                :
                                `${(((record.employee || {}).user || {}).last_name || '').charAt(0).toUpperCase()}${(((record.employee || {}).user || {}).last_name || '').slice(1).toLowerCase()} `
                                + `${(((record.employee || {}).user || {}).first_name || '').charAt(0).toUpperCase()}${(((record.employee || {}).user || {}).first_name || '').slice(1).toLowerCase()}`
                        }
                    </div>
                </Tooltip>,
                fixed: 'left',
                width: 250,
                textWrap: 'word-break',
                ellipsis: true,
            },
            ...dayColumn,
            {
                title: <div style={{textAlign: 'center'}}>{locale('common_attendance.ajillasan_tsag')}</div>,
                key: 'workedHour',
                width: 100,
                render: (record) => <span>{(record.workedHour || 0)}  {locale('common_attendance.tsag')} {(record.workedMin || 0)}{locale('common_attendance.minut')}</span>
            },
            {
                title: <div style={{textAlign: 'center'}}>Ажиллах өдрүүд</div>,
                key: 'totalWorkDay',
                width: 100,
                render: (record) => <div style={{textAlign: 'center'}}>{(record.totalWorkDay || 0)}</div>
            },
            {
                title: <div style={{textAlign: 'center'}}>Амарсан<br/>өдрүүд</div>,
                key: 'vacation',
                width: 100,
                render: (record) => <div style={{textAlign: 'center'}}>{(record.totalVacationDay || 0)}</div>
            },
            {
                title: <div style={{textAlign: 'center'}}>Чөлөөтэй</div>,
                key: 'breaks_minutes',
                width: 100,
                render: (record) => <div style={{textAlign: 'center'}}><span>{(record.totalBreakDurationHours || 0)}цаг {(record.totalBreakDurationMinutes || 0)}мин</span></div>
            },
            {
                title: <div style={{textAlign: 'center'}}>Чөлөөтэй<br/>өдрүүд</div>,
                key: 'breaks_day',
                width: 230,
                render: (record) => <div style={{textAlign: 'center'}}>{(record.totalBreakDayPaid || 0)} цалинтай /{(record.totalBreakDayTypeDay || 0)} өдөр</div>
            },
            {
                title: <div style={{textAlign: 'center'}}>{locale('common_attendance.irsen_table1')}</div>,
                key: 'arrivedInTime',
                width: 100,
                render: (record) => <div style={{textAlign: 'center'}}>{(record.totalArrivedDay || 0)}</div>
            },
            {
                title: <div style={{textAlign: 'center'}}>Хоцорсон</div>,
                key: 'arrivedLate',
                width: 150,
                render: (record) => <div style={{textAlign: 'center'}}>{`${parseInt((record.totalLate || 0)/60)} цаг ${(record.totalLate || 0)-(parseInt((record.totalLate || 0)/60))*60} минут`}</div>
            },
            {
                title: <div style={{textAlign: 'center'}}>Эрт явсан</div>,
                key: 'LeftEarly',
                width: 100,
                render: (record) => <div style={{textAlign: 'center'}}>{(record.totalEarly || 0)}</div>
            },
            {
                key: 'LeftWithoutChecking',
                width: 250,
                render: (record) => <div style={{textAlign: 'center'}}>Явсан цаг бүртгүүлээгүй {(record.noYvsanHour || 0)}</div>
            }
        ];
        return (
            <>
                <Card
                    title={locale('common_attendance.burtgel')}
                    bordered={true}
                    loading={false}
                    // style={{margin:30}}
                >
                    <div key={Math.random()} style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <div key={Math.random()}>
                            <Space style={{marginBottom: 20}}>
                                <DatePicker placeholder='Огноо'
                                            value={this.state.selected_month ? moment(this.state.selected_month, monthFormat) : null}
                                        // defaultValue={date ? moment(date, monthFormat) : null}
                                            format={monthFormat} picker="month"
                                            onChange={(value, dateString)=>this.setState({selected_month: dateString})}
                                />
                                {worthy?
                                    <Input style={{width: 300}} defaultValue={search} placeholder={locale('common_attendance.ner_owog_bolon_utsaar_haih')} className='attendance-search' allowClear={true}/>
                                    :
                                    null
                                }
                                <Button loading={gettingAttendance} icon={<SearchOutlined/>} type="default" onClick={this.getMassAttendance.bind(this)}>{locale('common_attendance.haih')}</Button>
                                {this.props.location.search === '?secret=%27export%27'?
                                    worthy ?
                                        <Button
                                            loading={loadingAll}
                                            style={{marginLeft: 100}}
                                            onClick={this.export.bind(this , 'disp')}
                                        >Export</Button>
                                        :
                                        null
                                    :
                                    null
                                }
                            </Space>
                            {selectedMonth && selectedMonth!==''?
                                <div key={Math.random()} style={{fontSize:16, fontWeight:600, marginBottom: 10}}>
                                    {moment(selectedMonth).format('YYYY-MM')} {locale('common_attendance.burtgel_jij')}
                                </div>
                                :
                                null
                            }
                        </div>
                        <div key={Math.random()}>
                            <div>
                                <div style={{backgroundColor: '#d3adf7', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                - {locale('common_attendance.amarsan')}
                            </div>
                            <div>
                                <div style={{backgroundColor: '#adc6ff', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                - {locale('common_attendance.chuluutei')}
                            </div>
                            <div>
                                <div style={{backgroundColor: '#FF5733', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                - {locale('common_attendance.tsagiin_chuluutei')}
                            </div>
                            <div>
                                <div style={{backgroundColor: '#ccc', height: '1em', width: '1em', display: 'inline-block', marginRight: '5px'}}/>
                                - {locale('common_attendance.ajillahgui')}
                            </div>
                        </div>
                    </div>

                    <div className='attendance_burtgel'>
                        {days && days.length>0 && attendance && attendance.length>0?
                            <React.Fragment>
                                <Table
                                    loading={gettingAttendance}
                                    rowKey={(record) => {return (record.employee || {})._id || `${Math.random()}`}}
                                    columns={columns}
                                    dataSource={attendance}
                                    pagination={{
                                        pageSize: this.state.pageSize,
                                        current: this.state.pageNum+1,
                                        total: all,
                                        showSizeChanger: true
                                    }}
                                    onChange={(e) => this.setState({pageNum: e.current-1, pageSize: e.pageSize}, () => this.getMassAttendance())}
                                    scroll={{ x: (980 + (days.length || 0)*150)}}
                                    sticky
                                />
                            </React.Fragment>
                            :
                            <Empty description={<span style={{color: '#495057', userSelect: 'none'}}>Ирц байхгүй байна.</span>} />
                        }
                    </div>

                    {
                        this.state.visible === true ?
                            <AttendanceModal
                                {...this.state}
                                dispatch={this.props.dispatch}
                                handleCancel={this.handleCancel}
                            />
                        : null
                    }
                </Card>
                <ExportExcel
                    exportChecked={this.state.exportChecked}
                    setExport={this.setExport.bind(this)}
                    hideExportM={this.hideExportM.bind(this)}
                    exportType={this.state.exportType}
                    exportDisp={this.exportDisp.bind(this)}
                    exportAll={this.exportAll.bind(this)}
                    exportModal={this.state.exportModal}
                    loading={loadingAll}
                    type="attendance"
                />
            </>
        );
    }
}

export default  connect(reducer)(Attendance);