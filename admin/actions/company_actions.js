import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function getCompanies(data = {}){
    let url = '/api/admin/get/companies/';
    return networkActions.requestGet(constants.getCompanies, url, data);
}
export function createUser(data){
    let url = '/api/admin/create/user';
    return networkActions.requestPost(constants.createCompanyUser, url, data);
}
export function createCompany(data){
    let url = '/api/admin/create/company';
    return networkActions.requestPost(constants.createCompany, url, data);
}
export function searchUser(data){
    let url = '/api/admin/search/user';
    return networkActions.requestPost(constants.searchUser, url, data);
}
export function setEmployees(data){
    let url = '/api/admin/insert/employees';
    return networkActions.requestPost(constants.setEmployees, url, data);
}
export function changeCreateTabKey(key){
    return {
        type: constants.changeCreateTabKey.REQUEST,
        key
    }
}
export function setCMRole(data){
    return {
        type: constants.setCMRole.REQUEST,
        data
    }
}
export function employeeRemoveCM(data){
    return {
        type: constants.employeeRemoveCM.REQUEST,
        data
    }
}
export function employeeAddCM(data){
    return {
        type: constants.employeeAddCM.REQUEST,
        data
    }
}
export function changeCompanyBundle(data){
    return {
        type: constants.changeCompanyBundle.REQUEST,
        data
    }
}
export function setCompanyBundle(data){
    let url = '/api/admin/set/company/bundle';
    return networkActions.requestPost(constants.setCompanyBundle, url, data);
}
export function getCompanyRequests(data = {}){
    let url = '/api/admin/get/requests';
    return networkActions.requestPost(constants.getCompanyRequests, url, data);
}
export function editCompany(id) {
    let url = `/api/admin/get/editCompany/${id}`;
    return networkActions.requestGet(constants.editCompany, url)
}
export function saveCompanyForm(data) {
    let url = `/api/admin/set/editedCompany`;
    return networkActions.requestPost(constants.saveCompanyForm, url, data)
}
export function changeCompanyStatus(data) {
    let url = '/api/admin/set/changeCompanyStatus';
    return networkActions.requestPost(constants.changeCompanyStatus, url, data)
}
export function changeCompanyReqStatus(data) {
    let url = '/api/admin/set/companyReqStatus';
    return networkActions.requestPost(constants.changeCompanyReqStatus, url, data)
}
export function getLord(data) {
    let url = `/api/admin/get/company/lord/${data}`;
    return networkActions.requestGet(constants.getLord, url)
}
export function addAction(){
    let url = '/api/admin/post/company/addAction'
    return networkActions.requestPost(constants.addAction, url)
}
export function removeLord(data) {
    let url ='/api/admin/set/company/removeLord';
    return networkActions.requestPost(constants.removeLord, url, data)
}
export function createLord(data) {
    let url ='/api/admin/create/company/lord';
    return networkActions.requestPost(constants.createLord, url, data)

}
export function findUser(data = {}){
    let url = `/api/admin/find/user`;
    return networkActions.requestPost(constants.findUser, url, data);
}