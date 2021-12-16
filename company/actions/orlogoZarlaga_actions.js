import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getOrlogoZarlaga(data = {}){
    let url = `/api/company/getOrlogoZarlaga`;
    return networkActions.requestPost(constants.getOrlogoZarlaga, url, data);
}

export function submitOrlogoZarlaga(data = {}){
    let url = `/api/company/submit/orlogoZarlaga`;
    return networkActions.requestPost(constants.submitOrlogoZarlaga, url, data);
}
export function publishOrlogoZarlaga(data = {}){
    let url = `/api/company/publish/orlogoZarlaga`;
    return networkActions.requestPost(constants.publishOrlogoZarlaga, url, data);
}
export function deleteOrlogoZarlaga(data = {}){
    let url = `/api/company/delete/orlogoZarlaga`;
    return networkActions.requestPost(constants.deleteOrlogoZarlaga, url, data);
}

export function unMountOrlogoZarlaga(){
    return {
        type: constants.unMountOrlogoZarlaga.REQUEST,
    }
}