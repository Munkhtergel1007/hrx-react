import {
    changeCompanyReqStatus,
    getCompanyRequests
} from "../actionTypes";
const initialState = {
    requests: [],
    gettingReqs: false,
    changingReqStatus: false
}

export default(state = initialState, action) => {
    switch(action.type) {
        case getCompanyRequests.REQUEST:
            return {
                ...state,
                gettingReqs: true
            }
        case getCompanyRequests.RESPONSE:
            if(action.json.success) {
                return {
                    ...state,
                    requests: action.json.requests,
                    all: action.json.all,
                    gettingReqs: false
                }
            } else {
                return {
                    ...state,
                    gettingReqs: false
                }
            }
        case changeCompanyReqStatus.REQUEST:
            return {
                ...state,
                changingReqStatus: true
            }
        case changeCompanyReqStatus.RESPONSE:
            if (action.json.success) {
                if(action.json.request.status === 'active'){
                    return {
                        ...state,
                        requests: (state.requests || []).filter(req => req._id.toString() !== (action.json.request || {})._id),
                        changingReqStatus: false
                    }
                }else{
                    let a = state.requests.map((record) => {
                        if(record._id === action.json.request._id) {
                            record.status = action.json.request.status
                        }
                        return record
                    })
                    return {
                        ...state,
                        requests: a,
                        changingReqStatus: false
                    }
                }
            } else {
                return {
                    ...state,
                    changingReqStatus: false
                }
            }
        default:
            return {
                ...state
            }
    }
}
