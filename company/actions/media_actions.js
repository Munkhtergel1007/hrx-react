import * as networkActions from './networkActions';
import * as constants from '../actionTypes';

// export function fetchMedia(type,num = 0,data = {}){
//     let url = `/merchant/api/get/media/${type}/${num}`;
//     return networkActions.requestPost(constants.fetchMedia,url,data);
// }
export function fetchMedia(type,num = 0,data = {}){
    let url = `/api/get/media/${type}/${num}`;
    return networkActions.requestPost(constants.fetchMedia,url,data);
}
export function fetchMediaInfo(type,data = {}){
    let url = `/api/get/info/media/${type}`;
    return networkActions.requestPost(constants.fetchMediaInfo,url,data);
}
export function uploadMedia(files ,data = {type: 'image'}){
    return networkActions.uploadProgressMediaLib(constants.uploadMedia,files, data.type, data)
}
export function selectMedia(id,  multi = true){
    return {
        type: constants.selectMedia.REQUEST,
        data: {id, multi}
    }
}
export function closeMediaModal(){
    return {
        type: constants.closeMediaModal.REQUEST
    }
}
