import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getCompanyTransactions(data = {}){
    let url = '/api/admin/get/company/transactions';
    return networkActions.requestGet(constants.getCompanyTransactions, url, data);
}

export function insertNewTrans(data){
    let url = '/api/admin/insert/new/transaction';
    return networkActions.requestPost(constants.insertNewTrans, url, data)
}
export function getChargeRequests(data){
    let url = '/api/admin/get/charge/requests';
    return networkActions.requestGet(constants.getChargeRequests, url, data)
}