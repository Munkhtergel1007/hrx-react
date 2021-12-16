import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getOrientation(data = {}){
    let url = `/api/company/get/orientation`
    return networkActions.requestPost(constants.getOrientation, url, data)
}
export function getEmployeeOrientation(data = {}){
    let url = `/api/company/get/orientation/employee`
    return networkActions.requestPost(constants.getEmployeeOrientation, url, data)
}
export function createOrientation(data = {}){
    let url = `/api/company/create/orientation`
    return networkActions.requestPost(constants.createOrientation, url, data)
}
export function deleteOrientation(data = {}){
    let url = `/api/company/delete/orientation`
    return networkActions.requestPost(constants.deleteOrientation, url, data)
}
export function changeEmployeeOrientation(data = {}){
    let url = `/api/company/change/orientation/employee`
    return networkActions.requestPost(constants.changeEmployeeOrientation, url, data)
}
export function finishEmployeeOrientation(data = {}){
    let url = `/api/company/finish/orientation/employee`
    return networkActions.requestPost(constants.finishEmployeeOrientation, url, data)
}