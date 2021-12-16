import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getDepartment(data){
    let url = '/api/company/getDepartment';
    return networkActions.requestGet(constants.getDepartment, url, data);
}
export function openModal(data){
    return {
        type: constants.openModalDep.REQUEST,
        json: data
    }
}
export function closeModal(){
    return {
        type: constants.closeModalDep.REQUEST
    }
}
export function departmentUnmount(data){
    return {
        type: constants.departmentUnmount.REQUEST,
        json: data
    }
}
export function onChangeHandler(data){
    return {
        type: constants.onChangeHandlerSetDep.REQUEST,
        json: data
    }
}
export function submitDepartment(data) {
    let url = `/api/company/submitDepartment`;
    return networkActions.requestPost(constants.submitDepartment,url, data);
}

