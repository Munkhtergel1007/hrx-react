import {
    login
} from "../actionTypes";
const initialState = {
    admin: {},
};

export default(state = initialState, action) => {
    switch (action.type) {
        case login.RESPONSE:
            return {
                ...state,
                admin: action.json.admin
            };
        default:
            return state;
    }
};