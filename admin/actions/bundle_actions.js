import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function getBundles(data){
    let url = '/api/admin/get/bundles';
    return networkActions.requestGet(constants.getBundles, url, data);
}
export function insertBundle(data){
    let url = '/api/admin/insert/bundle';
    return networkActions.requestPost(constants.insertBundle, url, data);
}
export function handleSingleChange(data){
    return {
        type: constants.handleSingleChange.REQUEST,
        data
    }
}
export function setSingleBundle(data){
    return {
        type: constants.setSingleBundle.REQUEST,
        data
    }
}
export function changeBundleStatus(data){
    let url = '/api/admin/set/bundleStatus';
    return networkActions.requestPost(constants.changeBundleStatus, url, data)
}