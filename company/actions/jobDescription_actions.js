import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getJobDescriptions(data = {}){
    let url = `/api/company/get/jobDescriptions`
    return networkActions.requestGet(constants.getJobDescriptions, url, data)
}
export function createJobDescriptions(data = {}){
    let url = `/api/company/create/jobDescriptions`
    return networkActions.requestPost(constants.createJobDescriptions, url, data)
}
export function deleteJobDescriptions(data = {}){
    let url = `/api/company/delete/jobDescriptions`
    return networkActions.requestPost(constants.deleteJobDescriptions, url, data)
}