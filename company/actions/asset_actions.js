import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function getAsset(data) {
    let url = `/api/company/getAsset`;
    return networkActions.requestGet(constants.getAsset,url, data);
}
// ** asset
export function submitAsset(data) {
    let url = `/api/company/submitAsset`;
    return networkActions.requestPost(constants.submitAsset,url, data);
}
export function openAssetModal(data){
    return {
        type: constants.openAssetModal.REQUEST,
        json: data
    }
}
export function closeAssetModal(){
    return {
        type: constants.closeAssetModal.REQUEST,
    }
}
export function assetChangeHandler(data){
    return {
        type: constants.assetChangeHandler.REQUEST,
        json: data
    }
}
export function deleteAsset(data) {
    let url = `/api/company/deleteAsset`;
    return networkActions.requestPost(constants.deleteAsset,url, data);
}

// ** sub asset
export function submitSubAsset(data) {
    let url = `/api/company/submitSubAsset`;
    return networkActions.requestPost(constants.submitSubAsset,url, data);
}
export function openSubAssetModal(data){
    return {
        type: constants.openSubAssetModal.REQUEST,
        json: data
    }
}
export function closeSubAssetModal(){
    return {
        type: constants.closeSubAssetModal.REQUEST,
    }
}
export function assetChangeHandlerSub(data){
    return {
        type: constants.assetChangeHandlerSub.REQUEST,
        json: data
    }
}
export function deleteSubAsset(data) {
    let url = `/api/company/deleteSubAsset`;
    return networkActions.requestPost(constants.deleteSubAsset,url, data);
}

// ** unmount
export function unmountShopAssets(){
    return {
        type: constants.unmountShopAssets.REQUEST,
    }
}