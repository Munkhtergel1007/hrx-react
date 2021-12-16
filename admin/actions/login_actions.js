import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function login(data){
    let url = '/api/admin/login';
    return networkActions.requestPost(constants.login, url, data)
}