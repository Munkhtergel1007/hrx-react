import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getSalaries(data = {}){
    let url = `/api/company/get/salaries`;
    return networkActions.requestGet(constants.getSalaries, url, data);
}
export function changeSalaryInfo(data){
    let url = `/api/company/save/salary/employee`;
    return networkActions.requestPost(constants.changeSalaryInfo, url, data);
}
export function submitAndCancelSalary(data = {}){
    let url = `/api/company/change/salary/status`;
    return networkActions.requestPost(constants.submitAndCancelSalary, url, data);
}
export function approveAndDeclineSalary(data = {}){
    let url = `/api/company/complete/salary`;
    return networkActions.requestPost(constants.approveAndDeclineSalary, url, data);
}
export function deleteSalary(data = {}){
    let url = `/api/company/delete/salary/employee`;
    return networkActions.requestPost(constants.deleteSalary, url, data);
}
export function getSalaryLogs(data = {}){
    let url = `/api/company/get/salary/logs`;
    return networkActions.requestGet(constants.getSalaryLogs, url, data);
}