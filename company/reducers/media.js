import {
    fetchMedia,
    fetchMediaInfo,
    closeMediaModal,
    selectMedia,
    uploadMedia
} from '../actionTypes';

const iniState = {
    mediaLoading: 1,
    medias: {},
    mediaMore: false,
    mediaType: '',
    mediaLength: 0,
    mediaDates: [],
    mediaYears: [],
    mediaUploading: false
}

export default function media(state = iniState, action){
    switch(action.type){
        case fetchMedia.REQUEST:
            let oldMedias = state.medias;
            if(action.json.oldMedias){
                if(!oldMedias[action.json.type]){
                    oldMedias[action.json.type] = [];
                }
                let stateIds = (oldMedias[action.json.type] || []).map(c => c._id);
                (action.json.oldMedias || []).map((c) => {
                    if(stateIds.indexOf(c._id) == -1){
                        c.selected = true;
                        oldMedias[action.json.type].push(c)
                    }
                })
            }
            return {
                ...state,
                mediaLoading: 1,
                mediaMore: false,
                mediaType: '',
                medias: oldMedias
            }
        case fetchMedia.RESPONSE:
            if(action.json.success){
                let medias = state.medias;
                medias[action.json.type] = action.json.search ? action.json.media : [...(medias[action.json.type] || []), ...action.json.media]
                return {
                    ...state,
                    mediaMore: (action.json.media || []).length >= 50,
                    mediaLoading: 0,
                    mediaType: action.json.type,
                    medias
                }
            } else {
                return {
                    ...state,
                    mediaMore: false,
                    mediaLoading: 2
                }
            }
        case fetchMediaInfo.RESPONSE:
            return {
                ...state,
                mediaLength: action.json.count,
                mediaDates: action.json.date,
                mediaYears: action.json.date.sort((a,b)=>{return b._id - a._id})
            }
        case closeMediaModal.REQUEST:
            return {
                mediaLoading: 1,
                medias: {},
                mediaMore: false,
                mediaType: '',
                mediaLength: 0,
                mediaDates: [],
                mediaYears: []
            }
        case selectMedia.REQUEST:
            if(action.data.id){
                let medias = state.medias;
                medias[state.mediaType] = (medias[state.mediaType] || []).map((c) => {
                    let i = c;
                    if(i._id == action.data.id && action.data.multi){
                        i.selected = i.selected ? !i.selected : true;
                        return i;
                    } else if(!action.data.multi){
                        if(i._id == action.data.id){
                            i.selected = i.selected ? !i.selected : true;
                        } else {
                            delete i.selected;
                        }
                        return i;
                    }
                    return i;
                })
                return {
                    ...state,
                    medias
                }
            } else {
                return {
                    ...state,
                }
            }
        case uploadMedia.REQUEST:
            let medias = state.medias;
            medias[action.data.type] = [
                {
                    ...action.data,
                    _id: action.json.id,
                    path: action.data.fake_image,
                    videoThumbnail: '/imagesSchool/404.jpg',
                    fake: true,
                    uploading: 1
                },
                ...medias[action.data.type]
            ]
            return {
                ...state,
                mediaUploading:true,
                medias
            }
        case uploadMedia.PROGRESS:
            let mediasProgress = state.medias;
            mediasProgress[action.data.type] = mediasProgress[action.data.type].map((c) => {
                if(c._id == action.json.id){
                    c.uploading = action.json.percent
                }
                return c;
            })
            return {
                ...state,
                medias: mediasProgress
            }
        case uploadMedia.RESPONSE:
            let mediasRes = state.medias;
            if(action.json.success){
                mediasRes[action.data.type] = mediasRes[action.data.type].map((c) => {
                    if(c._id == (action.json.id || action.json.uid)){
                        c._id = (action.json.result || action.json.image)._id;
                        c.original_name = (action.json.result || action.json.image).original_name;
                        c.thumbnail = (action.json.result || action.json.image).thumbnail;
                        c.created = (action.json.result || action.json.image).created;
                        c.selected = true;
                        c.free = (action.json.result || action.json.image).free;
                        delete c.uploading;
                        delete c.fake;
                        if(action.data.type == 'image'){
                            c.path = (action.json.result || action.json.image).path;
                        } else {
                            delete c.path;
                        }
                    } else {
                        // if(action.json.multi === false){
                            c.selected = false;
                        // }
                    }
                    return c;
                })
            } else {
                mediasRes[action.data.type] = mediasRes[action.data.type].filter( c => c._id != (action.json.id || action.json.uid))
            }
            return {
                ...state,
                medias: mediasRes,
                mediaUploading: false,
            }
        default:
            return state;
    }
}