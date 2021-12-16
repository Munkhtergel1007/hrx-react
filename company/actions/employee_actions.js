import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function findUser(data = {}){
    let url = `/api/company/find/user`;
    return networkActions.requestPost(constants.findUser, url, data);
}
export function createEmpByUser(data = {}){
    let url = `/api/company/add/employee`;
    return networkActions.requestPost(constants.createEmpByUser, url, data);
}
export function getEmployee(employee){
    let url = `/api/company/get/employee/${employee}`;
    return networkActions.requestGet(constants.getEmployee, url);
}
export function getEmployeeCV(employee){
    let url = `/api/company/get/employee/some_cv/${employee}`;
    return networkActions.requestGet(constants.getEmployeeCV, url);
}
export function createUser(data = {}){
    let url = `/api/company/create/user`;
    return networkActions.requestPost(constants.createUser, url, data);
}
export function editEmpMain(data = {}){
    let url = `/api/company/edit/${data.emp}/info/main`;
    return networkActions.requestPost(constants.editEmpMain, url, data);
}
export function insertEmpFamily(data = {}){
    let url = `/api/company/edit/${data.emp}/info/family`;
    return networkActions.requestPost(constants.insertEmpFamily, url, data);
}
export function insertEmpProfession(data = {}){
    let url = `/api/company/edit/${data.emp}/info/profession`;
    return networkActions.requestPost(constants.insertEmpProfession, url, data);
}
export function insertEmpQtraining(data = {}){
    let url = `/api/company/edit/${data.emp}/info/qualification_training`;
    return networkActions.requestPost(constants.insertEmpQtraining, url, data);
}
export function insertEmpExperience(data = {}){
    let url = `/api/company/edit/${data.emp}/info/experience`;
    return networkActions.requestPost(constants.insertEmpExperience, url, data);
}
export function delDelDel(data = {}){
    let url = `/api/company/del/dele/delet/delete`;
    return networkActions.requestPost(constants.editEmpMain, url, data);
}
export function insertEmpSkill(data = {}){
    let url = `/api/company/edit/${data.emp}/info/skill`;
    return networkActions.requestPost(constants.insertEmpSkill, url, data);
}
export function insertEmpMilitary(data = {}){
    let url = `/api/company/edit/${data.emp}/info/military`;
    return networkActions.requestPost(constants.insertEmpMilitary, url, data);
}
export function handleCreateUser(data = {}){
    return {
        type: constants.handleCreateUser.REQUEST,
        data
    }
}
export function setPageConf(data = {}){
    return {
        type: constants.setPageConfEmp.REQUEST,
        data
    }
}
export function getAllEmployees(data) {
    let url = '/api/company/get/employees';
    return networkActions.requestPost(constants.getAllEmployees, url, data)
}
export function insertEmpViolation(data = {}) {
    let url = `/api/company/add/${data.emp}/info/violation`;
    return networkActions.requestPost(constants.insertEmpViolation, url, data)
}
export function deleteEmpViolation(data = {}){
    let url = `/api/company/delete/${data.user}/info/violation`
    return networkActions.requestPost(constants.deleteEmpViolation, url, data)
}
export function getViolationInfo(data) {
    let url = `/api/company/get/${data.emp}/info/violation`;
    return networkActions.requestPost(constants.getViolationInfo, url, data)
}
export function uploadViolation(data) {
    let url = `/api/pdf/upload/${data.uid}/${data.size}`
    return networkActions.uploadProgress(constants.uploadViolation, url, data)
}
export function editEmpViolation(data = {}) {
    let url = `/api/company/edit/info/violation/${data.id}`
    return networkActions.requestPost(constants.editEmpViolation, url, data)
}
export function unMountViolation(data = {}){
    return {
        type: constants.unMountViolation.REQUEST,
        data
    }
}
export function startEdit(data = {}){
    return {
        type: constants.startEdit.REQUEST,
        data
    }
}
export function stopEdit() {
    return {
        type: constants.stopEdit.REQUEST
    }
}
export function onChangeHandler(data = {}) {
    return {
        type: constants.onChangeHandlerSetViolation.REQUEST,
        data
    }
}
export function setEmpRole(data) {
    let url = `/api/company/edit/${data.emp}/info/role`;
    return networkActions.requestPost(constants.setEmpRole, url, data)
}
export function setEmpStaticRole(data) {
    let url = `/api/company/edit/${data.emp}/info/staticRole`;
    return networkActions.requestPost(constants.setEmpStaticRole, url, data)
}
export function startEditMain(data = {}){
    return {
        type: constants.startEditMain.REQUEST,
        data
    }
}
export function stopEditMain(data = {}) {
    return {
        type: constants.stopEditMain.REQUEST,
        data
    }
}
export function addNewInfoHandler(data = {}) {
    return {
        type: constants.addNewInfoHandler.REQUEST,
        data
    }
}
export function onMainChangeHandler(data = {}) {
    return {
        type: constants.onMainChangeHandler.REQUEST,
        data
    }
}
export function deleteEmployee(data = {}) {
    let url = `/api/company/delete/employee/${data.emp}`
    return networkActions.requestPost(constants.deleteEmployee, url, data)
}
export function insertEmpReward(data = {}) {
    let url = `/api/company/edit/${data.emp}/info/reward`;
    return networkActions.requestPost(constants.insertEmpReward, url, data);
}
export function getVacation(employee) {
    let url = `/api/company/get/vacation/${employee}`;
    return networkActions.requestGet(constants.getEmpVacation, url)
}
export function submitSelectedDays(data) {
    let url = `/api/company/edit/vacation/${data.emp}`
    return networkActions.requestPost(constants.submitSelectedDays, url, data)
}

//upload avatar start
export function changeAvatar(data) {
    let url = `/api/changeAvatar`;
    return networkActions.requestPost(constants.changeAvatar,url, data);
}
//upload avatar end

// export function getEmpJobs(employee, data) {
//     let url = `/api/company/get/job/${employee}`
//     return networkActions.requestPost(constants.getEmpJobs, url, data)
// }
export function getUserRewards(user){
    let url = `/api/company/get/${user}/info/reward`
    return networkActions.requestGet(constants.getUserRewards, url)
}
export function editUserRewards(data = {}){
    let url = `/api/company/edit/user/${data.user}/info/reward`
    return networkActions.requestPost(constants.editUserRewards, url, data)
}
export function deleteUserRewards(data = {}){
    let url = `/api/company/delete/${data.user}/info/reward`
    return networkActions.requestPost(constants.deleteUserRewards, url, data)
}
/* Togtuun */
export function getSingleEmpBreak(employee){
    let url = `/api/company/get/break/${employee}`;
    return networkActions.requestGet(constants.getSingleEmpBreak, url);
}
export function createBreak(data = {}){
    let url = `/api/company/create/break/${data.emp}`;
    return networkActions.requestPost(constants.createBreak, url, data);
}
export function deleteBreak(data = {}){
    let url = `/api/company/delete/break/${data.emp}`;
    return networkActions.requestPost(constants.deleteEmpBreak, url, data);
}
export function getEmployeeStandard(data = {pageNum: 0, pageSize: 0, staticRole: []}) {
    let url = `/api/company/get/standard/employee`;
    return networkActions.requestGet(constants.getEmployeeStandard, url, data);
}
export function getRoles() {
    let url = `/api/company/get/roles`;
    return networkActions.requestGet(constants.getAllRoles, url);
}
export function getEmployeeTimetable(data = {}){
    let url = `/api/company/get/timetable/employee`;
    return networkActions.requestGet(constants.getEmployeeTimetable, url, data);
}
export function changeEmployeeTimetable(data = {}){
    let url = `/api/company/change/timetable/employee`;
    return networkActions.requestPost(constants.changeEmployeeTimetable, url, data);
}
export function getSalaryEmp(data = {}){
    let url = `/api/company/get/salary/employee/${data._id}`;
    return networkActions.requestGet(constants.getSalaryEmp, url, data);
}
export function getSubsidiaryCompanies(){
    let url = `/api/company/get/subsidiary/companies`;
    return networkActions.requestGet(constants.getSubsidiaryCompanies, url);
}
export function getLord(){
    let url = `/api/company/get/lord`;
    return networkActions.requestGet(constants.getLord, url);
}
export function getEmployeeFromRole(data = {}){
    let url = `/api/company/get/employee/from/role`;
    return networkActions.requestPost(constants.getEmployeeFromRole, url, data);
}

//IMPORT 
export function uploadExcel(file) {
    let url = `/api/company/import/excel/employee`;
    return networkActions.requestUploadPostDirect(constants.uploadExcel, url, {} , null , file);
};
export function insertEmployees(data){
    let url = `/api/company/import/employees`;
    return networkActions.requestPost(constants.insertEmployees,url, data);
};
export function clearExcel() {
    return {
        type: constants.clearExcel.REQUEST
    }
};