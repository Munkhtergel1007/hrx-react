import {
    registerCompanyAndUser,
    loginFrontToCompany,
} from "../actionTypes";
import config from "../config";
const initialState = {
    user:{},
    companies: [],
    employees: [],
};

export default(state = initialState, action) => {
    switch (action.type) {
        case registerCompanyAndUser.RESPONSE:
            if(action.json.success && action.json.company && action.json.company.domain){
                return {
                    ...state,
                    user: (action.json.user || state.user),
                    employee: (action.json.employee || state.employee),
                    companies: [...state.companies, action.json.company]
                };
            } else {
                return state;
            }
        case loginFrontToCompany.RESPONSE:
            if(action.json.success){
                // if(c.json.redirectToCompany && c.json.company && c.json.company[0]){
                //     let url = config.get('redirectHostHead')+ c.json.company[0].domain +'.' + config.get('redirectHostTail');
                //     window.location.assign(url);
                // }
                return {
                    ...state,
                    user: (action.json.user || state.user),
                    companies: action.json.company,
                    employees: action.json.employee
                };
            } else {
                return {
                    ...state,
                    user: (action.json.user || state.user),
                };
            }
        default:
            return state;
    }
};