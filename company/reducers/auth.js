import {
    companyLogin
} from "../actionTypes";

const initialState = {
    loggingIn: false
};

export default(state = initialState, action) => {
    switch (action.type) {
        case companyLogin.REQUEST:
            return {
                ...state,
                loggingIn: true
            };
        case companyLogin.RESPONSE:
            return {
                ...state,
                loggingIn: false
            };
        default:
            return state;
    }
};