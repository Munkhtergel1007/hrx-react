import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getAllBreak(data){
    let url = '/api/company/break/all';
    return networkActions.requestGet(constants.getAllBreak, url, data)
}
export function editEmpBreak(data) {
    let url = '/api/company/break/response';
    return networkActions.requestPost(constants.editEmpBreak, url, data)
}