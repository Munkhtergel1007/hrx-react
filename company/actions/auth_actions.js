import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function login(data = {}){
    let url = '/api/company/login';
    return networkActions.requestPost(constants.companyLogin, url, data);
}