import * as networkActions from './networkActions';
import * as constants from '../actionTypes';

export function registerCompanyAndUser(data) {
    let url = `/api/registerCompanyAndUser`;
    return networkActions.requestPost(constants.registerCompanyAndUser,url, data);
}
export function loginFrontToCompany(data) {
    let url = `/api/loginFrontToCompany`;
    return networkActions.requestPost(constants.loginFrontToCompany,url, data);
}
export function resetPassword(data) {
    let url = `/api/password/reset`;
    return networkActions.requestPost(constants.resetPassword, url, data)
}
export function savePassword(data){
    let url = `/api/reset/passwordSave/${data.id}`
    return networkActions.requestPost(constants.savePassword, url, data)
}
export function submitInformation(data) {
    let url = `/api/submitInformation`;
    return networkActions.requestPost(constants.submitInformation, url, data)
}
export function passwordChange(data) {
    let url = `/api/passwordChange`;
    return networkActions.requestPost(constants.passwordChange, url, data)
}