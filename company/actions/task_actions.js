import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getTasks(data){
    let url = `/api/company/task/get`;
    return networkActions.requestGet(constants.getTasks, url, data);
};
export function createTask(data){
    let url = `/api/company/task/create`;
    return networkActions.requestPost(constants.createTask, url, data);
};
export function changeTask(data){
    let url = `/api/company/task/change`;
    return networkActions.requestPost(constants.changeTask, url, data);
};
export function getEmployeeStandardInner(data = {pageNum: 0, pageSize: 0, staticRole: []}) {
    let url = `/api/company/get/standard/employee`;
    return networkActions.requestGet(constants.getEmployeeStandardInner, url, data);
};
export function getDoneTasks(data){
    let url = `/api/company/task/get/done`;
    return networkActions.requestGet(constants.getDoneTasks, url, data);
};
export function getIdleTasks(data){
    let url = `/api/company/task/get/idle`;
    return networkActions.requestGet(constants.getIdleTasks, url, data);
};
export function finishTask(data){
    let url = `/api/company/task/finish`;
    return networkActions.requestPost(constants.finishTask, url, data);
}