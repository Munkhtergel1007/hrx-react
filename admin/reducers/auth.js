import {
    login
} from "../actionTypes";
const initialState = {
    loggingIn: false,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case login.REQUEST:
            return {
                ...state,
                loggingIn: true
            };
        case login.RESPONSE:
            return {
                ...state,
                loggingIn: false
            };
        default:
            return state;
    }
};