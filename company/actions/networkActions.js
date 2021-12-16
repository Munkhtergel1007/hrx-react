import fetch from 'fetch-everywhere';
import querystring from 'querystring';
import config from '../config';
import Cookies from "js-cookie";
import axios from 'axios';

export function requestGet(requestActions,url, requestParams = null,header={}) {
    return dispatch => {
        dispatch(requestStart(requestParams,requestActions));
        if(Cookies.get('token') != null){
            header = {
                ...header,
                token: Cookies.get('token')
            }
        }
        header = {
            ...header,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let currentUrl = `${url}`;
        if(requestParams){
            currentUrl +='?'+querystring.stringify(requestParams)
        }
        return fetch(currentUrl, {
            method: 'get',
            headers: header,
            credentials: 'include'
        })
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    if(response.status == 404) {
                        if(config.get('emitter'))
                            config.get('emitter').emit('not-found');
                    }
                    if(response.status == 401){
                        if(config.get('emitter'))
                            config.get('emitter').emit('auth-error');
                    }
                    return {
                        success:false,
                        status:response.status,
                        sucmod:false,
                        alemod:false,
                        redirect:false,
                    }
                }
            })
            .then(json => {
                if(!json.success){
                    config.get('emitter').emit('error',json.msg);
                }
                if(json.sucmod) {
                    config.get('emitter').emit('success',json.msg);
                }
                if(json.alemod) {
                    config.get('emitter').emit('warning',json.msg);
                }
                if(json.redirect){
                    window.location.assign('/'+json.redirect);
                }
                if(json.redirectUrl){
                    window.location.replace(json.redirectUrl);
                }
                return dispatch(requestEnd(json,requestActions))
            })
            .catch(error => {
                return dispatch(requestEnd({success:false,error:error,data:requestParams},requestActions))
            });

    }

}
function requestStart(json,requestActions) {
    return {
        type: requestActions.REQUEST,
        json
    }
}
function requestEnd(json,requestActions) {
    return {
        type: requestActions.RESPONSE,
        json
    }
}

export function requestPost(requestActions,url,data,requestParams = null,header={}) {
    return dispatch => {
        dispatch(requestStart(data,requestActions));
        if(Cookies.get('token') != null){
            header = {
                ...header,
                token: Cookies.get('token')
            }
        }
        header = {
            ...header,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        let option = {
            method: 'post',
            headers: header,
            credentials: 'include'
        };
        if(typeof data == 'object'){
            option = {
                ...option,
                body: JSON.stringify(data)
            }
        }
        let currentUrl = `${url}`;
        if(requestParams){
            currentUrl +='?'+querystring.stringify(requestParams)
        }
        return fetch(currentUrl, option)
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    if(response.status == 404) {
                        if(config.get('emitter'))
                            config.get('emitter').emit('not-found');
                    }
                    if(response.status == 401){
                        if(config.get('emitter'))
                            config.get('emitter').emit('auth-error');
                    }
                    return {
                        success:false,
                        status:response.status,
                        sucmod:false,
                        alemod:false,
                        redirect:false,
                    }
                }
            })
            .then(json => {
                if(!json.success){
                    config.get('emitter').emit('error',json.msg);
                }
                if(json.sucmod) {
                    config.get('emitter').emit('success',json.msg);
                }
                if(json.alemod) {
                    config.get('emitter').emit('warning',json.msg);
                }
                if(json.redirect){
                    window.location.assign('/'+json.redirect);
                }
                if(json.redirectUrl){
                    window.location.replace(json.redirectUrl);
                }
                return dispatch(requestEnd(json,requestActions));
            })
            .catch(error => {
                return dispatch(requestEnd({success:false,error:error,data:data},requestActions));
            });

    }

}


export function uploadProgress(requestActions, urll, data,neededData = {},requestParams = null, header={}) {
    let url = `/${(window.__INITIAL_STATE__.main.company || {}).domain || ''}${urll}`;
    let fd = new FormData();
    fd.append('image', data);
    return dispatch => {
        dispatch(requestMediaUploadStart({uid: data.uid}, requestActions, neededData));
        if (Cookies.get('token') != null) {
            header = {
                ...header,
                token: Cookies.get('token')
            }
        }
        let currentUrl = `${config.get('hostMedia')}${url}`;
        axios.post(currentUrl, fd, {
            onUploadProgress: progressEvent => {
                let percent;
                percent = Math.round(progressEvent.loaded / progressEvent.total * 100);
                dispatch(requestMediaProgress({uid: data.uid, percent: percent}, requestActions, neededData));
            },
            method: 'post',
            headers: {
                ...header,
                'Accept': 'application/json'
            },
            responseType: 'json'
        })
            .then(function (response) {
                if (response.status == 200) {
                    return response.data;
                } else {
                    if (response.status == 401) {
                        if (config.get('emitter'))
                            config.get('emitter').emit('auth-error');
                    }
                    return {
                        success: false,
                        status: response.status
                    }
                }
            })
            .then(json => {
                if (!json.success) {
                    config.get('emitter').emit('error', json.msg);
                } else if(json.success && json.sucmod){
                    config.get('emitter').emit('success', json.msg);
                }
                return dispatch(requestMediaUploadEnd(json, requestActions, neededData));
            })
            .catch(error => {
                return dispatch(requestMediaUploadEnd({success:false, uid: data.uid}, requestActions, neededData));
            });
    }
}
export function requestMediaUploadStart(json,requestParams, data) {
    return {
        type: requestParams.REQUEST,
        json,
        data
    }
}
export function requestMediaProgress(json,requestParams, data) {
    return {
        type: requestParams.PROGRESS,
        json,
        data
    }
}
export function requestMediaUploadEnd(json,requestParams, data) {
    return {
        type: requestParams.RESPONSE,
        json,
        data
    }
}




export function uploadProgressMediaLib(requestActions, data,type, neededData = {},requestParams = null, header=null) {
    let id = Date.now();
    let url = `/api/${type}/upload/${id}/${(neededData.size || 0)}`;
    if(type === 'image'){
        if(neededData.forWhat === 'avatar'){
            url = `/${neededData.domain}/api/${neededData.forWhat}/${type}/upload/${id}/${(neededData.size || 0)}`;
        } else { // company-d haryaalaltai upload-uud
            url = `/${neededData.domain}/api/${neededData.forWhat}/${type}/upload/${id}/${(neededData.size || 0)}`;
        }
    }
    let fd = new FormData();
    fd.append('image', data[0]);
    fd.append('body', neededData);
    fd.append('id', id);
    fd.append('free', true);
    fd.append('multi', neededData.multi);
    if(type == 'image'){
        neededData.fake_image = window.URL.createObjectURL(data[0]);
        fd.append('forWhat', neededData.forWhat)
    }
    return dispatch => {
        dispatch(requestMediaLibUploadStart({id: id}, requestActions, type, neededData));
        if (Cookies.get('token') != null) {
            header = {
                ...header,
                token: Cookies.get('token')
            }
        }
        let currentUrl = `${config.get('hostMedia')}${url}`;
        axios.post(currentUrl, fd, {
            onUploadProgress: progressEvent => {
                let percent;
                percent = Math.round(progressEvent.loaded / progressEvent.total * 100);
                dispatch(requestMediaLibProgress({id: id, percent: percent}, requestActions, type, neededData));
            },
            method: 'post',
            headers: {
                ...header,
                'Accept': 'application/json'
            },
            responseType: 'json',
            credentials:'same-origin'
        })
            .then(function (response) {
                if (response.status == 200) {
                    return response.data;
                } else {
                    if (response.status == 401) {
                        if (config.get('emitter'))
                            config.get('emitter').emit('auth-error');
                    }
                    return {
                        success: false,
                        status: response.status
                    }
                }
            })
            .then(json => {
                if (!json.success) {
                    config.get('emitter').emit('error', json.msg);
                } else if(json.success && json.sucmod){
                    config.get('emitter').emit('success', json.msg);
                }
                return dispatch(requestMediaLibUploadEnd(json, requestActions, type, neededData));
            })
            .catch(error => {
                return dispatch(requestMediaLibUploadEnd({success:false}, requestActions, type, neededData));
            });
    }
}
export function requestMediaLibUploadStart(json,requestParams,type, data) {
    return {
        type: requestParams.REQUEST,
        mediaType: type,
        json,
        data
    }
}
export function requestMediaLibProgress(json,requestParams,type, data) {
    return {
        type: requestParams.PROGRESS,
        mediaType: type,
        json,
        data
    }
}
export function requestMediaLibUploadEnd(json,requestParams,type, data) {
    return {
        type: requestParams.RESPONSE,
        mediaType: type,
        json,
        data
    }
}



export function requestUploadPostDirect(requestActions,url,header, requestParams = null,files,type=null,threadID = 'main') {
    var data = new FormData();
    var id = Date.now();
    data.append('image', files[0]);
    data.append('id',id);
    return dispatch => {
        dispatch(requestUploadDirectStart({id:id, file:files[0]},threadID,requestActions,type));
        if (Cookies.get('token') != null) {
            header = {
                ...header,
                token: Cookies.get('token')
            }
        }
        header = {
            ...header,
            'Accept': 'application/json'
        };
        let currentUrl = `${config.get('host')}${url}`;
        if(requestParams){
            currentUrl +='?'+querystring.stringify(requestParams)
        }
        return fetch(currentUrl, {
            method: 'post',
            credentials: 'same-origin',
            headers: header,
            body: data
        })
            .then(function (response) {
                if (response.status == 200) {
                    return response.json();
                } else {
                    if(response.status == 401){
                        if(reduxConf.get('emitter'))
                            reduxConf.get('emitter').emit('auth-error');
                    }
                    return {
                        success:false,
                        status:response.status
                    }
                }
            })
            .then(json => {
                if(!json.success){
                    reduxConf.get('emitter').emit('error',json.msg);
                }
                return dispatch(requestUploadDirectEnd(json,threadID,requestActions,type));
            })
            .catch(error => {
                return dispatch(requestUploadDirectEnd({
                    success:false
                },threadID,requestActions,type))

            });

    }
}
function requestUploadDirectStart(json,threadID,requestParams,type){
    return {
        type: requestParams.REQUEST,
        threadID,
        mediaType: type,
        json
    }
}
function requestUploadDirectEnd(json,threadID,requestParams,type){
    return {
        type: requestParams.RESPONSE,
        threadID,
        mediaType: type,
        json
    }
}