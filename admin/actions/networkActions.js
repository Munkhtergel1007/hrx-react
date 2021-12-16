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
                return dispatch(requestEnd(json,requestActions));
            })
            .catch(error => {
                return dispatch(requestEnd({success:false,error:error,data:data},requestActions));
            });

    }

}


export function uploadProgress(requestActions, data,type, neededData = {},requestParams = null, header=null) {
    let url = `/api/${type}/upload`;
    let fd = new FormData();
    let id = Date.now();
    fd.append('image', data[0]);
    fd.append('id', id);
    fd.append('free', true);
    if(type == 'image'){
        neededData.fake_image = window.URL.createObjectURL(data[0]);
    }
    return dispatch => {
        dispatch(requestMediaUploadStart({id: id}, requestActions, type, neededData));
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
                dispatch(requestMediaProgress({id: id, percent: percent}, requestActions, type, neededData));
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
                        id: id,
                        status: response.status
                    }
                }
            })
            .then(json => {
                if (json.success) {
                    let currentUrl1 = `${config.get('host')}${url}`;
                    return fetch(currentUrl1, {
                        method: 'post',
                        credentials: 'same-origin',
                        headers: {
                            ...header,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(json)
                    })
                        .then(function (response) {
                            if (response.status == 200) {
                                return response.json();
                            } else {
                                if (response.status == 401) {
                                    if (config.get('emitter'))
                                        config.get('emitter').emit('auth-error');
                                }
                                return {
                                    success: false,
                                    id: id,
                                    status: response.status
                                }
                            }
                        })
                        .then(json => {
                            if (!json.success) {
                                config.get('emitter').emit('error', json.msg);
                            }
                            return dispatch(requestMediaUploadEnd(json, requestActions, type, neededData));
                        })
                        .catch(error => {
                            return dispatch(requestMediaUploadEnd({success:false}, requestActions, type, neededData));

                        });
                } else {
                    config.get('emitter').emit('error', json.msg || 'Алдаа гарлаа');
                    return dispatch(requestMediaUploadEnd(json, requestActions, type, neededData));
                }
            })
            .catch(error => {
                return dispatch(requestMediaUploadEnd({success:false,id: id}, requestActions, type, neededData));
            });
    }
}
export function requestMediaUploadStart(json,requestParams,type, data) {
    return {
        type: requestParams.REQUEST,
        mediaType: type,
        json,
        data
    }
}
export function requestMediaProgress(json,requestParams,type, data) {
    return {
        type: requestParams.PROGRESS,
        mediaType: type,
        json,
        data
    }
}
export function requestMediaUploadEnd(json,requestParams,type, data) {
    return {
        type: requestParams.RESPONSE,
        mediaType: type,
        json,
        data
    }
}