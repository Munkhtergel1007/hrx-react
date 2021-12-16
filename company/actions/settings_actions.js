import * as constants from "../actionTypes";
import * as networkActions from './networkActions';
import config from '../config';


export function setPageConf(data = {}){
    return {
        type: constants.setPageConfSet.REQUEST,
        json: data
    }
}
export function changeCompanyMain(data){
    let url = '/api/company/change/main';
    return networkActions.requestPost(constants.changeCompanyMain, url, data);
}
export function changeCompanyUploads(data) {
    let url = `/api/company/changeCompanyUploads`;
    return networkActions.requestPost(constants.changeCompanyUploads,url, data);
}
export function createRole(data){
    let url = '/api/company/create/role';
    return networkActions.requestPost(constants.createRole, url, data);
}
export function deleteRole(data){
    let url = '/api/company/delete/role';
    return networkActions.requestPost(constants.deleteRole, url, data);
}
export function getAllRoles(){
    let url = '/api/company/get/roles';
    return networkActions.requestGet(constants.getAllRoles, url);
}
export function getBundles(data){
    let url = '/api/company/get/bundles/';
    return networkActions.requestGet(constants.getBundles, url, data);
}
export function getCharges(data){
    let url = '/api/company/get/charges/';
    return networkActions.requestGet(constants.getCharges, url, data);
}
export function createCharge(data){
    let url = '/api/company/create/charge';
    return networkActions.requestPost(constants.createCharge, url, data);
}

export function uploadLogo(data){
    let url = `/api/logo/upload/${data.uid}/${data.size}`;
    data.fake_image = window.URL.createObjectURL(data);
    return networkActions.uploadProgress(constants.uploadLogo, url, data);
}

export function uploadCover(data){
    let url = `/api/cover/upload/${data.uid}/${data.size}`;
    data.fake_image = window.URL.createObjectURL(data);
    return networkActions.uploadProgress(constants.uploadCover, url, data);
}

export function uploadSlider(data){
    let url = `/api/slider/upload/${data.uid}/${data.size}`;
    data.fake_image = window.URL.createObjectURL(data);
    return networkActions.uploadProgress(constants.uploadSlider, url, data);
}

export function getSliders(data = null){
    let url = `/api/company/get/sliders/${data || ''}`;
    return networkActions.requestGet(constants.getSliders, url);
}

export function removeSlider(data = {}){
    let url = `/api/company/remove/slider`;
    return networkActions.requestPost(constants.removeSlider, url, data);
}

export function getAllTags() {
    let url = `/api/company/get/tags`;
    return networkActions.requestGet(constants.getAllTags, url)
}

export function addTag(data = {}) {
    let url = `/api/company/create/tag`;
    return networkActions.requestPost(constants.addTag, url, data)
}

export function deleteTag(data = {}) {
    let url = `/api/company/delete/tag`;
    return networkActions.requestPost(constants.deleteTag, url, data)
}

export function addSubTag(data = {}) {
    let url = `/api/company/create/subtag`;
    return networkActions.requestPost(constants.addSubTag, url, data)
}

export function deleteSubTag(data = {}) {
    let url = `/api/company/delete/subtag`;
    return networkActions.requestPost(constants.deleteSubTag, url, data)
}

export function getTimetables(data = {}) {
    let url = `/api/company/get/timetable`;
    return networkActions.requestGet(constants.getTimetables, url, data)
}
export function createTimetable(data = {}) {
    let url = `/api/company/create/timetable`;
    return networkActions.requestPost(constants.createTimetable, url, data)
}
export function deleteTimetable(data = {}) {
    let url = `/api/company/delete/timetable`;
    return networkActions.requestPost(constants.deleteTimetable, url, data)
}
export function deleteEmpTimetable(data = {}){
    let url = `/api/company/delete/timetable/employee`;
    return networkActions.requestPost(constants.deleteEmpTimetable, url, data)
}
export function getAllAdmins(){
    let url = `/api/company/get/admins`;
    return networkActions.requestGet(constants.getAllAdmins, url)
}
export function createHrManager(data = {}) {
    let url = `/api/company/create/hrManager`;
    return networkActions.requestPost(constants.createHrManager, url, data)
}
export function derankEmployee(data = {}) {
    let url = `/api/company/derank/employee`;
    return networkActions.requestPost(constants.derankEmployee, url, data)
}
export function createAttendanceCollector(data = {}) {
    let url = `/api/company/create/attendanceCollector`;
    return networkActions.requestPost(constants.createAttendanceCollector, url, data)
}
export function getSubsidiaryCompany(){
    let url = `/api/company/get/subsidiary/company`;
    return networkActions.requestGet(constants.getSubsidiaryCompany, url);
}
export function createSubsidiaryCompany(data = {}){
    let url = `/api/company/create/subsidiary/company`;
    return networkActions.requestPost(constants.createSubsidiaryCompany, url, data);
}
export function deleteSubsidiaryCompany(data = {}){
    let url = `/api/company/delete/subsidiary/company`;
    return networkActions.requestPost(constants.deleteSubsidiaryCompany, url, data);
}
export function getUsers(data = {}){
    let url = `/api/company/get/users`;
    return networkActions.requestPost(constants.getUsers, url, data);
}
export function cancelSubsidiaryCompanyDeletion(data = {}){
    let url = `/api/company/cancel/delete/subsidiary/company`;
    return networkActions.requestPost(constants.cancelSubsidiaryCompanyDeletion, url, data);
}
export function getOrientation(data = {}){
    let url = `/api/company/get/roles/orientation`;
    return networkActions.requestPost(constants.getOrientation, url, data);
}
export function getJobDescriptions(data = {}){
    let url = `/api/company/get/roles/job-descriptions`;
    return networkActions.requestPost(constants.getJobDescriptions, url, data);
}
export function changeActions(data = {}){
    return {
        type: constants.changeActions.REQUEST,
        json: data
    }
}
export function clearActions(data = {}){
    return {
        type: constants.clearActions.REQUEST,
        json: data
    }
}
export function addActions(data = {}){
    return {
        type: constants.addActions.REQUEST,
        json: data
    }
}