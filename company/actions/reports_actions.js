import * as constants from '../actionTypes';
import * as networkActions from './networkActions';

export function changeReport(data = {}){
    let url = `/api/company/change/report`;
    return networkActions.requestPost(constants.changeReport, url, data);
}


export function getCreated(data = {}){
    let url = `/api/company/get/report`;
    return networkActions.requestPost(constants.getCreated, url, data);
}
export function getReceived(data = {}){
    let url = `/api/company/get/report`;
    return networkActions.requestPost(constants.getReceived, url, data);
}

export function getReport(data = {}){
    let url = `/api/company/get/report`;
    return networkActions.requestPost(constants.getReport, url, data);
}

export function deleteReport(data = {}){
    let url = `/api/company/delete/report`;
    return networkActions.requestPost(constants.deleteReport, url, data)
}