import {
    insertBundle,
    handleSingleChange,
    setSingleBundle,
    getBundles,
    changeBundleStatus
} from "../actionTypes";
const initialState = {
    creating: false,
    gettingBundles: false,
    bundles: [],
    singleBundle: {}
};

export default(state = initialState, action) => {
    switch (action.type) {
        case setSingleBundle.REQUEST:
            return {
                ...state,
                singleBundle: action.data
            };
        case handleSingleChange.REQUEST:
            return {
                ...state,
                singleBundle: {
                    ...state.singleBundle,
                    ...action.data
                }
            };
        case getBundles.REQUEST:
            return {
                ...state,
                gettingBundles: true
            };
        case getBundles.RESPONSE:
            return {
                ...state,
                gettingBundles: false,
                bundles: action.json.bundles || []
            };
        case insertBundle.REQUEST:
            return {
                ...state,
                creating: true,
                bundles: state.bundles.some(c => c._id === action.json._id) ? state.bundles.map((c) => {
                    if(c._id === action.json._id){
                        c.loading = true;
                    }
                    return c;
                }) : state.bundles
            };
        case insertBundle.RESPONSE:
            return {
                ...state,
                creating: false,
                bundles: state.bundles.some(c => c._id === (action.json.bundle || {})._id) ? state.bundles.map((c) => {
                    if(c._id === (action.json.bundle || {})._id){
                        c = action.json.bundle || {};
                    }
                    return c;
                }) : [(action.json.bundle || {}), ...state.bundles]
            };
        case changeBundleStatus.REQUEST:
            return {
                ...state,
                gettingBundles: true
            }
        case changeBundleStatus.RESPONSE:
            if(action.json.success) {
                let a = state.bundles.filter((record) => {
                    if (record.status !== 'delete') {
                        if(record._id === action.json.bundle._id) {
                            record.status = action.json.bundle.status
                        }
                        return record
                    }
                })
                return {
                    ...state,
                    bundles: a,
                    gettingBundles: false
                }
            } else {
                return {
                    ...state,
                    gettingBundles: false
                }
            }
        default: return state;
    }
}