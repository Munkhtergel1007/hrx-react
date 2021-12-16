import * as networkActions from "./networkActions";
import * as constants from "../actionTypes";

export function createWorkPlan(data = {}){
    let url = `/api/company/edit/workplan`
    return networkActions.requestPost(constants.createWorkPlan, url, data)
}
export function getEmpWorkPlans(){
    let url = `/api/company/get/own/workplans`
    return networkActions.requestGet(constants.getEmpWorkPlans, url)
}
export function createWorkPlanJob(data){
    let url = `/api/company/edit/workplan/job`
    return networkActions.requestPost(constants.createWorkPlanJob, url, data)
}
export function deleteWorkPlanJob(data){
    let url =`/api/company/delete/workplan/job`
    return networkActions.requestPost(constants.deleteWorkPlanJob, url, data)
}
export function deleteWorkPlan(id){
    let url = `/api/company/delete/workplan`
    return networkActions.requestPost(constants.deleteWorkPlan, url, id)
}
export function submitWorkPlan(data = {}){
    let url = `/api/company/submit/workplan`
    return networkActions.requestPost(constants.submitWorkPlan, url, data)
}
export function getAllWorkPlans(data){
    let url = `/api/company/get/workplans`
    return networkActions.requestPost(constants.getAllWorkPlans, url, data)
}
export function respondToWorkPlan(data){
    let url = `/api/company/respond/workplan`
    return networkActions.requestPost(constants.respondToWorkPlan, url, data)
}
export function submitWorkplanJob(data){
    let url = `/api/company/submit/workplan/job`
    return networkActions.requestPost(constants.submitWorkplanJob, url, data)
}
export function appraiseJob(data){
    let url = `/api/company/appraise/workplan/job`
    return networkActions.requestPost(constants.appraiseJob, url, data)
}
export function declineJob(data){
    let url = `/api/company/decline/workplan/job`
    return networkActions.requestPost(constants.declineJob, url, data)
}