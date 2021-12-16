import {
    registerCompanyAndUser,
    loginFrontToCompany,
} from "../actionTypes";
import config from "../config";
const initialState = {
};

export default(state = initialState, action) => {
    switch (action.type) {
        // case registerCompanyAndUser.RESPONSE:
        //     if(action.json.success && action.json.company && action.json.company.domain){
        //         return {
        //             ...state,
        //             user: (action.json.user || state.user),
        //             employee: (action.json.employee || state.employee),
        //         };
        //     }
        // case loginFrontToCompany.RESPONSE:
        //     if(action.json.success && action.json.company && action.json.company.domain){
        //         return {
        //             ...state,
        //             user: (action.json.user || state.user),
        //             employee: (action.json.employee || state.employee),
        //         };
        //     }
        default:
            return state;
    }
};