import {
    setCompanyBundle,
    getCompanyTransactions,
    insertNewTrans,
    getChargeRequests,
} from "../actionTypes";
const initialState = {
    gettingCompanyTransactions: false,
    insertingTrans: false,
    gettingChargeReqs: false,
    requests: [],
    companyTransactions: []
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getChargeRequests.REQUEST:
            return {
                ...state,
                gettingChargeReqs: true
            };
        case getChargeRequests.RESPONSE:
            return {
                ...state,
                gettingChargeReqs: false,
                requests: action.json.chargeRequests || []
            };
        case insertNewTrans.REQUEST:
            return {
                ...state,
                insertingTrans: true
            };
        case insertNewTrans.RESPONSE:
            return {
                ...state,
                insertingTrans: false,
                companyTransactions: action.json.success ? [ action.json.transaction, ...state.companyTransactions ] : state.companyTransactions
            };
        case setCompanyBundle.REQUEST:
            return {
                ...state,
                insertingTrans: true
            };
        case setCompanyBundle.RESPONSE:
            return {
                ...state,
                insertingTrans: false,
                companyTransactions: action.json.success ? [ action.json.transaction, ...state.companyTransactions ] : state.companyTransactions
            };
        case getCompanyTransactions.REQUEST:
            return {
                ...state,
                gettingCompanyTransactions: true
            };
        case getCompanyTransactions.RESPONSE:
            return {
                ...state,
                gettingCompanyTransactions: false,
                companyTransactions: action.json.companyTransactions
            };
        default:
            return state;
    }
};