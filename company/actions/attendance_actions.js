import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getAttendance(data){
    let url = '/api/company/getAttendance';
    return networkActions.requestGet(constants.getAttendance, url, data);
}
export function getAttendanceAll(data){
    let url = '/api/company/getAttendanceAll';
    return networkActions.requestGet(constants.getAttendanceAll, url, data);
}
export function unmountAttendance(){
    return {
        type: constants.unmountAttendance.REQUEST,
    }
}
export function editAttendance(data){
    let url = '/api/company/editAttendance'
    return networkActions.requestPost(constants.editAttendance, url, data)
}

