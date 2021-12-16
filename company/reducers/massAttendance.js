import {
    getStudentsGuard,
    insertMassAttendance,
    clearSuccessAndFailed,
    registerStudentGuardOneByOne,
    insertMassAttendanceOneByOne,
    clearRecentAttendances,
} from '../actionTypes';
import config from "../config";
import moment from "moment";
const initialState = {
    status: 1,
    members: [],
    successInserted: [],
    failedInserted: [],
    massAttendance: [],
    all: 0,
    recentStud: [
        {id:1, student:null, registered: true},
        {id:2, student:null, registered: true},
        {id:3, student:null, registered: true},
    ],
    currentRecent: 1,
    allTeacher: 0,
    allStudent: 0,
    allStudentAtt: [],
    allTeacherAtt: [],

    localStorage: [],
    memberUpdated: {bool: false, date: null}
};
export default (state = initialState, action)  => {
    switch (action.type) {
        case clearRecentAttendances.REQUEST:
            return {
                ...state,
                recentStud: [
                    {id:1, student:null, registered: true},
                    {id:2, student:null, registered: true},
                    {id:3, student:null, registered: true},
                ],
                currentRecent: 1,
            };
        case insertMassAttendanceOneByOne.REQUEST:
            let hold =  (action.json.records || []);
            let holdLocalStorage = [...state.localStorage, ...hold];
            return {
                ...state,
                localStorage: holdLocalStorage
            };
        case insertMassAttendanceOneByOne.RESPONSE:
            if(action.json.success){
                let holdLocalStorage = (state.localStorage || []);
                let hold = (action.json.records || []);
                holdLocalStorage = holdLocalStorage.filter(function (r) {
                    if(hold.some(s =>
                        !(
                            r.employee._id === s.employee._id
                            &&
                            moment(r.localTime).toString() === moment(s.localTime).toString()
                        )
                    )){
                        return false;
                    } else {
                        return true;
                    }
                });
                let allStudentAtt = (state.allStudentAtt || []);
                let allTeacherAtt = (state.allTeacherAtt || []);
                let all = (state.all || 0);
                // (action.json.records || []).map(function (r) {
                //     if(r.employee && r.employee.role && r.employee.role.includes('student')){
                //         if(allStudentAtt && allStudentAtt.length>0){
                //             if(!(allStudentAtt || []).some(s => (s._id || '').toString() === r.employee._id.toString())){
                //                 allStudentAtt.push({_id: r.employee._id});
                //             }
                //         } else {
                //             allStudentAtt = [{_id: r.employee._id}];
                //         }
                //         all = all + 1;
                //     }
                //     if(r.employee && r.employee.role && r.employee.role.includes('teacher')){
                //         if(allTeacherAtt && allTeacherAtt.length>0){
                //             if(!(allTeacherAtt || []).some(s => (s._id || '').toString() === r.employee._id.toString())){
                //                 allTeacherAtt.push({_id: r.employee._id});
                //             }
                //         } else {
                //             allTeacherAtt = [{_id: r.employee._id}];
                //         }
                //         all = all + 1;
                //     }
                // });
                localStorage.setItem('pushedIds', JSON.stringify(holdLocalStorage));
                return {
                    ...state,
                    localStorage: holdLocalStorage,
                    all : all,
                    allStudentAtt: allStudentAtt,
                    allTeacherAtt: allTeacherAtt,
                    massAttendance: [ ...(action.json.records || []),...state.massAttendance ]
                };
            } else {
                return {
                    ...state,
                };
            }
        case clearSuccessAndFailed.REQUEST:
            let successI = (state.successInserted || []);
            let removeId = (action.json.removeIds || []);
            successI = successI.map(function (r) {
                if(removeId.includes(r.employee._id)){
                    return null
                }
                return r;
            }).filter(r => r);
            return {
                ...state,
                successInserted:successI,
                failedInserted:[]
            };
        case registerStudentGuardOneByOne.REQUEST:
            if(state.members && state.members.length>0){
                let holdPushingItems = {};
                let check = false;
                state.members.map(function(r){
                    if(r.cardId && r.cardId !=='' && r.cardId.toString() === (action.json.id || '').toString() && r.user){
                        holdPushingItems = {employee:r, localTime: action.json.localTime, company: r.company, user:r.user, timetable: r.timetable};
                        check = true;
                    }
                });
                if(check){
                    if(holdPushingItems && holdPushingItems.timetable && holdPushingItems.timetable._id  && holdPushingItems.timetable._id !== ''){
                        action.json.newRecord = holdPushingItems;
                        let holdLocalStorage = [...state.localStorage, holdPushingItems];
                        localStorage.setItem('pushedIds', JSON.stringify(holdLocalStorage));

                        ////// ***************** //////
                        ////// ***************** //////
                        let allStudentAtt = (state.allStudentAtt || []);
                        let allTeacherAtt = (state.allTeacherAtt || []);
                        // if(action.json.newRecord.employee && action.json.newRecord.employee.role && action.json.newRecord.employee.role.includes('student')){
                        //     if(allStudentAtt && allStudentAtt.length>0){
                        //         if(!(allStudentAtt || []).some(s => (s._id || '').toString() === action.json.newRecord.employee._id.toString())){
                        //             allStudentAtt.push({_id: action.json.newRecord.employee._id});
                        //         }
                        //     } else {
                        //         allStudentAtt = [{_id: action.json.newRecord.employee._id}];
                        //     }
                        // }
                        // if(action.json.newRecord.employee && action.json.newRecord.employee.role && action.json.newRecord.employee.role.includes('teacher')){
                        //     if(allTeacherAtt && allTeacherAtt.length>0){
                        //         if(!(allTeacherAtt || []).some(s => (s._id || '').toString() === action.json.newRecord.employee._id.toString())){
                        //             allTeacherAtt.push({_id: action.json.newRecord.employee._id});
                        //         }
                        //     } else {
                        //         allTeacherAtt = [{_id: action.json.newRecord.employee._id}];
                        //     }
                        // }
                        ////// ***************** //////
                        ////// ***************** //////

                        return {
                            ...state,
                            localStorage: holdLocalStorage,
                            ////// ***************** //////
                            ////// ***************** //////
                            massAttendance : [ action.json.newRecord, ...(state.massAttendance || []) ].slice(0, 50),
                            recentStud : (state.recentStud || []).map(function (r) {
                                if(r.id === state.currentRecent){
                                    r.student = action.json.newRecord;
                                    r.registered = true;
                                    r.current = true;
                                    r.msg = ''
                                } else {
                                    r.current = false;
                                }
                                return r;
                            }),
                            currentRecent: state.currentRecent === 3 ? 1 : state.currentRecent + 1,
                            all : state.all + 1,
                            allStudentAtt: allStudentAtt,
                            allTeacherAtt: allTeacherAtt,
                            ////// ***************** //////
                            ////// ***************** //////
                        };
                    } else {
                        config.get('emitter').emit('warning', 'Хэрэглэгч дээр цагийн хуваарь үүсээгүй байна!');
                        return {
                            ...state,
                            recentStud : (state.recentStud || []).map(function (r) {
                                if(r.id === state.currentRecent){
                                    r.student = null;
                                    r.registered = false;
                                    r.msg = 'Хэрэглэгч дээр цагийн хуваарь үүсээгүй байна!';
                                    r.current = true;
                                } else {
                                    r.current = false;
                                }
                                return r;
                            }),
                            currentRecent: state.currentRecent === 3 ? 1 : state.currentRecent + 1,
                        };
                    }
                } else {
                    config.get('emitter').emit('warning', 'Бүртгэлгүй хэрэглэгч байна!');
                    return {
                        ...state,
                        recentStud : (state.recentStud || []).map(function (r) {
                            if(r.id === state.currentRecent){
                                r.student = null;
                                r.registered = false;
                                r.msg = 'Бүртгэлгүй хэрэглэгч байна!';
                                r.current = true;
                            } else {
                                r.current = false;
                            }
                            return r;
                        }),
                        currentRecent: state.currentRecent === 3 ? 1 : state.currentRecent + 1,
                    };
                }
            } else {
                config.get('emitter').emit('error', ("Бүртгэлтэй хэрэглэгч алга байна!"));
                return {
                    ...state,
                };
            }
        case registerStudentGuardOneByOne.RESPONSE:
            if(action.json.success){
                // let allStudentAtt = (state.allStudentAtt || []);
                // let allTeacherAtt = (state.allTeacherAtt || []);
                // if(action.json.newRecord.employee && action.json.newRecord.employee.role && action.json.newRecord.employee.role.includes('student')){
                //     if(allStudentAtt && allStudentAtt.length>0){
                //         if(!(allStudentAtt || []).some(s => (s._id || '').toString() === action.json.newRecord.employee._id.toString())){
                //             allStudentAtt.push({_id: action.json.newRecord.employee._id});
                //         }
                //     } else {
                //         allStudentAtt = [{_id: action.json.newRecord.employee._id}];
                //     }
                // }
                // if(action.json.newRecord.employee && action.json.newRecord.employee.role && action.json.newRecord.employee.role.includes('teacher')){
                //     if(allTeacherAtt && allTeacherAtt.length>0){
                //         if(!(allTeacherAtt || []).some(s => (s._id || '').toString() === action.json.newRecord.employee._id.toString())){
                //             allTeacherAtt.push({_id: action.json.newRecord.employee._id});
                //         }
                //     } else {
                //         allTeacherAtt = [{_id: action.json.newRecord.employee._id}];
                //     }
                // }

                let holdLocalStorage = state.localStorage;
                holdLocalStorage = holdLocalStorage.filter(r =>
                    !(
                    r.employee._id === action.json.newRecord.employee._id
                    &&
                    moment(r.localTime).toString() === moment(action.json.newRecord.localTime).toString()
                    )
                );
                localStorage.setItem('pushedIds', JSON.stringify(holdLocalStorage));
                return {
                    ...state,
                    localStorage: holdLocalStorage,
                    // massAttendance : [ action.json.newRecord, ...(state.massAttendance || []) ].slice(0, 50),
                    // recentStud : (state.recentStud || []).map(function (r) {
                    //     if(r.id === state.currentRecent){
                    //         r.student = action.json.newRecord;
                    //         r.registered = true;
                    //         r.current = true;
                    //         r.msg = ''
                    //     } else {
                    //         r.current = false;
                    //     }
                    //     return r;
                    // }),
                    // currentRecent: state.currentRecent === 3 ? 1 : state.currentRecent + 1,
                    // all : state.all + 1,
                    // allStudentAtt: allStudentAtt,
                    // allTeacherAtt: allTeacherAtt,
                }
            } else {
                return {
                    ...state,
                }
            }
        case insertMassAttendance.REQUEST:
            let successInserted = (state.successInserted || []);
            let removeIds = (action.json.removeIds || []);
            successInserted = successInserted.map(function (r) {
                if(removeIds.includes(r.employee._id)){
                    return null
                }
                return r;
            }).filter(r => r);
            return {
                ...state,
                successInserted:successInserted,
                failedInserted:[]
            };
        case insertMassAttendance.RESPONSE:
            if(action.json.success){
                let rev = (action.json.records || []).reverse();
                let track = state.all + rev.length;
                return {
                    ...state,
                    successInserted : [...(state.successInserted || []), ...(action.json.records || [])],
                    massAttendance : [ ...rev, ...(state.massAttendance || []) ].slice(0, 50),
                    all : track,
                }
            } else {
                return {
                    ...state,
                    failedInserted : [...(state.failedInserted || []), ...(action.json.records || [])]
                }
            }
        case getStudentsGuard.REQUEST:
            let pushedIds = (action.json.pushedIds || []);
            // action.json.pushedIds = [];
            return {
                ...state,
                status: 1,
                localStorage: pushedIds,
            };
        case getStudentsGuard.RESPONSE:
            if(action.json.success){
                let memberUpdated = {bool: true, date: new Date()};
                localStorage.setItem('members', JSON.stringify((action.json.members || [])));
                localStorage.setItem('allTeacher', JSON.stringify((action.json.allTeacher || 0)));
                localStorage.setItem('allStudent', JSON.stringify((action.json.allStudent || 0)));
                localStorage.setItem('memberUpdated', JSON.stringify(memberUpdated));
                return {
                    ...state,
                    recentStud: [
                        {id:1, student:null, registered: true},
                        {id:2, student:null, registered: true},
                        {id:3, student:null, registered: true},
                    ],
                    currentRecent: 1,
                    status: 0,
                    all : (action.json.all || 0),
                    members : (action.json.members || []),
                    massAttendance : (action.json.att || []),
                    allTeacher:    (action.json.allTeacher || 0),
                    allStudent:    (action.json.allStudent || 0),
                    allStudentAtt: (action.json.allStudentAtt || []),
                    allTeacherAtt: (action.json.allTeacherAtt || []),
                    memberUpdated: memberUpdated
                };
            } else {
                let members = localStorage.getItem('members');
                if(members){
                    members = JSON.parse(members);
                } else {
                    members = [];
                }
                let allTeacher = localStorage.getItem('allTeacher');
                if(allTeacher){
                    allTeacher = JSON.parse(allTeacher);
                } else {
                    allTeacher = [];
                }
                let allStudent = localStorage.getItem('allStudent');
                if(allStudent){
                    allStudent = JSON.parse(allStudent);
                } else {
                    allStudent = [];
                }
                let memberUpdated = localStorage.getItem('memberUpdated');
                if(memberUpdated){
                    memberUpdated = JSON.parse(memberUpdated);
                } else {
                    memberUpdated = {bool: false, date: null};
                }
                memberUpdated.bool = false;
                return {
                    ...state,
                    status: 0,
                    members : (members || []),
                    massAttendance : [],
                    allTeacher:    allTeacher,
                    allStudent:    allStudent,
                    allStudentAtt: [],
                    allTeacherAtt: [],
                    all : 0,
                    memberUpdated: memberUpdated
                };
            }
        default:
            return state;
    }
};