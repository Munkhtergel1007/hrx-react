import {
    getAttendance,
    unmountAttendance,
    editAttendance,
    getAttendanceAll
} from "../actionTypes";
import config from "../config";
import moment from "moment";
import {checkIfDayInGap, dayToNumber, getDatesBetweenDates} from "../config";
const initialState = {
    gettingAttendance: false,
    attendance:[],
    days:[],
    selectedMonth:null,
    all: 0,
    search: '',

    loadingAll: false
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getAttendanceAll.REQUEST:
            return {
                ...state,
                loadingAll: true
            }
        case getAttendanceAll.RESPONSE:
            return {
                ...state,
                loadingAll: false
            }
        case unmountAttendance.REQUEST:
            return {
                ...state,
                gettingAttendance: false,
                attendance:[],
                days:[],
                selectedMonth:null,
            };
        case getAttendance.REQUEST:
            return {
                ...state,
                gettingAttendance: true
            };
        case getAttendance.RESPONSE:
            if(action.json.success){
                let returnItem = [];
                let results0 = action.json.results0 || [];
                let results1 = action.json.results1 || [];
                let results2 = action.json.results2 || [];
                let results3 = action.json.results3 || [];
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
                    (action.json.days || []).map(function (d) {
                        let dayOfWeek = getDayOfWeek(action.json.year, action.json.month, d);
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
                                if(checkIfDayInGap(action.json.selected_month+'/'+irts.day, days)){
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
                                    checkIfDayInGap(action.json.selected_month+'/'+irts.day, days)
                                ){
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
                    let totalBreakDayTypeDay = 0;
                    let totalBreakDayPaid = 0;
                    let totalBreakDuration = 0;
                    let totalVacationDay = 0;
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
                    ret.workedHour = retTotalWorkedHour;
                    ret.workedMin = retTotalWorkedMin;
                    ret.workedSec = retTotalWorkedSec;
                    ret.noYvsanHour = noYvsanHour;
                    ret.totalWorkDay = totalWorkDay;
                    ret.totalArrivedDay = totalArrivedDay;
                    ret.totalBreakDay = totalBreakDay;
                    ret.totalBreakDayTypeDay = totalBreakDayTypeDay;
                    ret.totalBreakDayPaid = totalBreakDayPaid;
                    ret.totalBreakDurationHours = Math.floor(totalBreakDuration / 60 / 60);
                    ret.totalBreakDurationMinutes = Math.floor((totalBreakDuration - (ret.totalBreakDurationHours * 60 * 60)) / 60);
                    // ret.totalBreakDurationSeconds = Math.floor((totalBreakDuration - ((ret.totalBreakDurationHours * 60 * 60) + (ret.totalBreakDurationMinutes * 60) )));
                    ret.totalVacationDay = totalVacationDay;
                    ret.totalLate = totalLate;
                    ret.totalEarly = totalEarly;
                });
                return {
                    ...state,
                    gettingAttendance: false,
                    attendance: (returnItem || []),
                    days: (action.json.days || []),
                    selectedMonth: (action.json.selectedMonth || null),
                    allWorkingHour: (action.json.allWorkingHour || 0),
                    all: (action.json.all || 0),
                    search: (action.json.search || '')
                };
            } else {
                return {
                    ...state,
                    gettingAttendance: false,
                };
            }
        case editAttendance.REQUEST:
            return {
                ...state
            }
        case editAttendance.RESPONSE:
            if(action.json.editting === 'irsen') {
                return {
                    ...state,
                    attendance: action.json.success ?
                        state.attendance.map(c => {
                            if((c.employee || {})._id !== action.json.attendance.employee) {
                                return c
                            } else {
                                c.irts.map(aa => {
                                    if((aa.irsen || {})._id !== action.json.attendance._id){
                                        return aa
                                    } else {
                                        aa.irsen.localTime = action.json.attendance.localTime
                                        aa.irsen.reason = action.json.attendance.reason
                                        aa.irsen.byManager = action.json.attendance.byManager
                                        aa.irsen.manager = action.json.attendance.manager
                                        aa.irsen.hour = parseInt(moment(action.json.attendance.localTime).format('H'))
                                        aa.irsen.minute = parseInt(moment(action.json.attendance.localTime).format('m'))
                                        return aa
                                    }
                                })
                                return c
                            }
                        })
                    : state.attendance
                }
            } else if(action.json.editting === 'yvsan') {
                return {
                    ...state,
                    attendance: action.json.success ?
                        state.attendance.map(c => {
                            if((c.employee || {})._id !== action.json.attendance.employee) {
                                return c
                            } else {
                                c.irts.map(aa => {
                                    if((aa.yvsan || {})._id !== action.json.attendance._id){
                                        return aa
                                    } else {
                                        aa.yvsan.localTime = action.json.attendance.localTime
                                        aa.yvsan.reason = action.json.attendance.reason
                                        aa.yvsan.byManager = action.json.attendance.byManager
                                        aa.yvsan.manager = action.json.attendance.manager
                                        aa.yvsan.hour = parseInt(moment(action.json.attendance.localTime).format('H'))
                                        aa.yvsan.minute = parseInt(moment(action.json.attendance.localTime).format('m'))
                                        return aa
                                    }
                                })
                                return c
                            }
                        })
                    : state.attendance
                }
            } else {
                let day = action.json.success ? (parseInt(moment(action.json.attendance.localTime).format('D'))) : 0
                return {
                    ...state,
                    attendance: action.json.success ?
                        state.attendance.map(c => {
                            if((c.employee || {})._id !== action.json.attendance.employee) {
                                return c
                            } else {
                                c.irts.map(aa => {
                                    if(aa.day !== day){
                                        return aa
                                    } else {
                                        if(action.json.editting === 'newYvsan') {
                                            aa.arrived = true
                                            aa.yvsan = action.json.attendance
                                            return aa
                                        } else {
                                            aa.arrived = true
                                            aa.irsen = action.json.attendance
                                            return aa
                                        }
                                    }
                                })
                                return c
                            }
                        })
                    : state.attendance
                }
            }
        default:
            return state;
    }
};


function getDayOfWeek(year, month, day){
    let date = new Date(year+ '/' + month+ '/' +day);
    return date.getDay() === 0? 7 : date.getDay();
}