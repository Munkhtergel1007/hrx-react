import * as networkActions from "./networkActions";
import * as constants from "../actionTypes";

export function changeCompanyVacation(data = {}){
    let url = `/api/company/change/vacation/${data.employee}`
    return networkActions.requestPost(constants.changeCompanyVacation, url, data)
}

export function getAllVacations(data) {
    let url = `/api/company/get/vacations`;
    return networkActions.requestPost(constants.getAllVacations, url, data)
}

export function respondToVacationRequest(data) {
    let url = `/api/company/vacation/response`;
    return networkActions.requestPost(constants.respondToVacationRequest, url, data)
}