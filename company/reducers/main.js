import {
    companyLogin,
    changeCompanyMain,
    uploadLogo,
    uploadCover,
    uploadSlider,
    getSliders,
    removeSlider,
    changeCompanyUploads,
    changeAvatar,
    deleteEmployee,
    submitReference
} from "../actionTypes";

const initialState = {
    avatarLoading: false,
    fieldLoading:false,
    gettingSlider:false,
    user: {},
    company: {},
    employee: {},
    references: [],
    companyUploadSelectLoading: true,
    referenceLoading: false
};

export default(state = initialState, action) => {
    switch (action.type) {
        case changeCompanyUploads.REQUEST:
            return {
                ...state,
                companyUploadSelectLoading: true,
            };
        case changeCompanyUploads.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    company: {
                        ...state.company,
                        [action.json.forWhat]: (action.json.image || null),
                    },
                    companyUploadSelectLoading: false,
                };
            } else {
                return {
                    ...state,
                    companyUploadSelectLoading: false,
                };
            }
        case changeAvatar.REQUEST:
            return {
                ...state,
                avatarLoading: true,
            };
        case changeAvatar.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    user: {
                        ...state.user,
                        avatar: (action.json.avatar || null),
                    },
                    avatarLoading: false,
                };
            } else {
                return {
                    ...state,
                    avatarLoading: false,
                };
            }
        case removeSlider.RESPONSE:
            return {
                ...state,
                company: {
                    ...state.company,
                    slider: state.company.slider.filter((c) => action.json.success ? c._id !== action.json._id : true)
                }
            };
        case uploadSlider.REQUEST:
            return {
                ...state,
                company: {
                    ...state.company,
                    slider: [...(state.company.slider || []), {
                        ...action.json,
                        url: action.json.fake_image
                    }]
                }
            };
        case uploadSlider.PROGRESS:
            return {
                ...state,
                company: {
                    ...state.company,
                    slider: (state.company.slider || []).map((c) => {
                        if(c.uid === action.json.uid){
                            c.percent = action.json.percent;
                        }
                        return c;
                    })
                }
            };
        case uploadSlider.RESPONSE:
            return {
                ...state,
                company: {
                    ...state.company,
                    slider: (state.company.slider || []).map((c) => {
                        if(c.uid === action.json.uid){
                            c = action.json.slider;
                            c.uri = c.url;
                            c.url += c.path;
                            c.status = 'done';
                        }
                        return c;
                    })
                }
            };
        case getSliders.REQUEST:
            return {
                ...state,
                gettingSlider: true
            };
        case getSliders.RESPONSE:
            return {
                ...state,
                gettingSlider: false,
                company: {
                    ...state.company,
                    slider: (action.json.slider || []).map((c) => {
                        c.uri = c.url;
                        c.url += c.path;
                        c.status = 'done';
                        c.uid = Date.now() + c.name;
                        return c;
                    })
                }
            };
        case uploadCover.REQUEST:
            return {
                ...state,
                company: {
                    ...state.company,
                    cover: {
                        percent: 0,
                        fake_image: action.json.fake_image
                    }
                }
            };
        case uploadCover.PROGRESS:
            return {
                ...state,
                company: {
                    ...state.company,
                    cover: {
                        ...state.company.cover,
                        percent: action.json.percent
                    }
                }
            };
        case uploadCover.RESPONSE:
            return {
                ...state,
                company: {
                    ...state.company,
                    cover: action.json.cover
                }
            };
        case uploadLogo.REQUEST:
            return {
                ...state,
                company: {
                    ...state.company,
                    logo: {
                        percent: 0,
                        fake_image: action.json.fake_image
                    }
                }
            };
        case uploadLogo.PROGRESS:
            return {
                ...state,
                company: {
                    ...state.company,
                    logo: {
                        ...state.company.logo,
                        percent: action.json.percent
                    }
                }
            };
        case uploadLogo.RESPONSE:
            return {
                ...state,
                company: {
                    ...state.company,
                    logo: action.json.logo
                }
            };
        case changeCompanyMain.RESPONSE:
            return {
                ...state,
                company: {
                    ...state.company,
                    name: action.json.name || state.company.name,
                    description: action.json.description || state.company.description,
                    mission: action.json.mission || state.company.mission,
                    vision: action.json.vision || state.company.vision,
                    slogan: action.json.slogan || state.company.slogan,
                    email: action.json.email || state.company.email,
                    phone: action.json.phone || state.company.phone,
                    address: action.json.address || state.company.address,
                    website: action.json.website || state.company.website,
                }
            };
        case companyLogin.RESPONSE:
            return {
                ...state,
                user: (action.json.user || state.user),
                employee: (action.json.employee || state.employee),
            };
        case deleteEmployee.RESPONSE:
            return {
                ...state,
                employee: {
                    ...(state.employee || {}),
                    references: (action.json.reference) && Object.keys((action.json.reference) || {}).length > 0 ? [
                        (action.json.reference),
                        ...(state.employee.references || [])
                    ] : (state.employee.references || [])
                }
            }
        case submitReference.REQUEST:
            return {
                ...state,
                referenceLoading: true
            }
        case submitReference.RESPONSE:
            if((action.json || {}).success){
                if((action.json || {}).final){
                    return {
                        ...state,
                        referenceLoading: false,
                        references: (state.references || []).filter(ref => (ref._id || 'as').toString() !== ((action.json || {})._id || '').toString())
                    }
                }else{
                    return {
                        ...state,
                        referenceLoading: false,
                        references: (state.references || []).map(ref => {
                            if((ref._id || 'as').toString() !== ((action.json || {})._id || '').toString()){
                                return ref;
                            }
                            return {
                                ...ref,
                                text: ((action.json || {}).text)
                            }
                        })
                    }
                }
            }else {
                return {
                    ...state,
                    referenceLoading: false
                }
            }
        default:
            return state;
    }
};
