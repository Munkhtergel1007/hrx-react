import * as constants from '../actionTypes';
import * as networkActions from "./networkActions";
export function getStudentsGuard(data = {}) {
    let url = '/api/company/getStudentsGuard/';
    return networkActions.requestGet(constants.getStudentsGuard,url, data);
}
export function insertMassAttendance(data = {}) {
    let url = '/api/company/insertMassAttendance/';
    return networkActions.requestPost(constants.insertMassAttendance,url, data);
}
export function insertMassAttendanceOneByOne(data = {}) {
    let url = '/api/company/insertMassAttendanceOneByOne/';
    return networkActions.requestPost(constants.insertMassAttendanceOneByOne,url, data);
}
export function registerStudentGuardOneByOne(data = {}) {
    let url = '/api/company/registerStudentGuardOneByOne/';
    return networkActions.requestPost(constants.registerStudentGuardOneByOne,url, data);
}
export function clearSuccessAndFailed(data){
    return {
        type : constants.clearSuccessAndFailed.REQUEST,
        json : data
    }
}
export function clearRecentAttendances(data){
    return {
        type : constants.clearRecentAttendances.REQUEST,
        json : data
    }
}
