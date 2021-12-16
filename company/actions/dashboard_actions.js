import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getAllEmployeeUsers(data) {
    let url = '/api/company/get/employeeUsers';
    return networkActions.requestGet(constants.getAllEmployeesUsers, url, data)
}
export function getEmployeeWorkplans(data) {
    let url = '/api/company/get/workplans/employee';
    return networkActions.requestGet(constants.getEmployeeWorkplans, url, data);
}