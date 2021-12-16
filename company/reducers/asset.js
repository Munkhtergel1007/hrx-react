import {
    getAsset,
    closeAssetModal,
    openAssetModal,
    assetChangeHandler,
    submitAsset,
    submitSubAsset,
    assetChangeHandlerSub,
    openSubAssetModal,
    closeSubAssetModal,
    unmountShopAssets,
    deleteAsset,
    deleteSubAsset,
} from "../actionTypes";
const initialState = {
    status: 1,
    assets:[],
    all:0,

    openModal: false,
    asset:{},
    submitAssetLoader: false,

    openSubModal: false,
    subAsset:{},
    submitSubAssetLoader: false,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case deleteSubAsset.REQUEST:
            if(action.json._id){
                return {
                    ...state,
                    assets: (state.assets || []).map(function (run) {
                        if(run._id === (action.json.catId || '')){
                            (run.child || []).map(function (c){
                                if(c._id === action.json._id){
                                    c.loading = true
                                }
                            });
                        }
                        return run;
                    })
                };
            } else {
                return {
                    ...state
                };
            }
        case deleteSubAsset.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    assets: state.assets.map(function(run) {
                        if(run._id === action.json.catId) {
                            run.child = (run.child || []).filter(c => c._id !== action.json._id);
                        }
                        return run;
                    })
                };
            } else {
                return {
                    ...state,
                    assets: (state.assets || []).map(function (run) {
                        if(run._id.toString() === (action.json.catId || '').toString()){
                            (run.child || []).map(function (c){
                                if(c._id.toString() === action.json._id.toString()){
                                    c.loading = false;
                                }
                            });
                        }
                        return run;
                    })
                };
            }
        case deleteAsset.REQUEST:
            if(action.json._id){
                return {
                    ...state,
                    assets: state.assets.map( function (run) {
                        if(run._id.toString() === action.json._id.toString()){
                            run.loading = true;
                        }
                        return run;
                    } ),
                };
            } else {
                return {
                    ...state
                };
            }
        case deleteAsset.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    // assets: (action.json.assets || []),
                    assets: state.assets.filter(run => run._id.toString() !== action.json._id.toString()),
                    all: state.all - 1
                };
            } else {
                if(action.json._id){
                    return {
                        ...state,
                        assets: state.assets.map( function (run) {
                            if(run._id.toString() === action.json._id.toString()){
                                run.loading = false;
                            }
                            return run;
                        }),
                    };
                } else {
                    return {
                        ...state
                    };
                }
            }
        case unmountShopAssets.REQUEST:
            return {
                ...state,
                status: 1,
                assets:[],
                all:0,
                openModal: false,
                asset:{},
                submitAssetLoader: false,
                openSubModal: false,
                subAsset:{},
                submitSubAssetLoader: false,
            };
        case submitSubAsset.REQUEST:
            return {
                ...state,
                submitSubAssetLoader: true,
            };
        case submitSubAsset.RESPONSE:
            if(action.json.success){
                if(action.json._id){
                    return {
                        ...state,
                        submitSubAssetLoader: false,
                        openSubModal: false,
                        assets: (state.assets || []).map(function (run) {
                            if(run._id.toString() === (action.json.data || {}).asset.toString()){
                                (run.child || []).map(function (c){
                                    if(c._id.toString() === action.json._id.toString()){
                                        c.title = action.json.data.title
                                    }
                                });
                            }
                            return run;
                        })
                    };
                } else {
                    return {
                        ...state,
                        submitSubAssetLoader: false,
                        openSubModal: false,
                        assets: state.assets.map(function (run) {
                            if(run._id === action.json.data.asset){
                                if(run.child && run.child.length > 0){
                                    run.child.push(action.json.data);
                                } else {
                                    run.child = [action.json.data];
                                }
                            }
                            return run;
                        }),
                    };
                }
            } else {
                return {
                    ...state,
                    submitSubAssetLoader: false
                };
            }
        case assetChangeHandlerSub.REQUEST:
            return {
                ...state,
                subAsset:{
                    ...state.subAsset,
                    [action.json.name]:action.json.value
                },
            };
        case openSubAssetModal.REQUEST:
            return {
                ...state,
                openSubModal: true,
                subAsset:(action.json || {}),
            };
        case closeSubAssetModal.REQUEST:
            return {
                ...state,
                openSubModal: false,
                subAsset:{},
            };

        case submitAsset.REQUEST:
            return {
                ...state,
                submitAssetLoader: true,
            };
        case submitAsset.RESPONSE:
            if(action.json.success){
                if(action.json._id){
                    return {
                        ...state,
                        submitAssetLoader: false,
                        openModal: false,
                        assets: state.assets.map(function (run) {
                            if(run._id === action.json._id){
                                run.title =  action.json.data.title;
                                run.parent =  action.json.data.parent;
                            }
                            return run;
                        }),
                    };
                } else {
                    return {
                        ...state,
                        submitAssetLoader: false,
                        openModal: false,
                        all: state.all + 1,
                        assets:[
                            action.json.data,
                            ...state.assets,
                        ],
                    };
                }
            } else {
                return {
                    ...state,
                    submitAssetLoader: false
                };
            }
        case assetChangeHandler.REQUEST:
            return {
                ...state,
                asset:{
                    ...state.asset,
                    [action.json.name]:action.json.value
                },
            };
        case openAssetModal.REQUEST:
            return {
                ...state,
                openModal: true,
                asset:(action.json || {}),
            };
        case closeAssetModal.REQUEST:
            return {
                ...state,
                openModal: false,
                asset:{},
            };
        case getAsset.REQUEST:
            return {
                ...state,
                status: 1
            };
        case getAsset.RESPONSE:
            return {
                ...state,
                status: 0,
                assets: (action.json.assets || []),
                allAssets: (action.json.allAssets || []),
                assetRequests: (action.json.assetRequests || 0),
                all: (action.json.all || 0)
            };


        default:
            return state;
    }
};