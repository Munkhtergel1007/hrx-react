import * as networkActions from "./networkActions";
import * as constants from "../actionTypes";

export function submitJob(data) {
    let url = `/api/company/edit/job`
    return networkActions.requestPost(constants.submitJob, url, data)
}
export function deleteJob(data) {
    let url = `/api/company/delete/job`
    return networkActions.requestPost(constants.deleteJob, url, data)
}
export function submitJobWorker(data){
    let url = `/api/company/edit/jobworker`
    return networkActions.requestPost(constants.submitJobWorker, url, data)
}