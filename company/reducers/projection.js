import {
    setPageConfPro
} from "../actionTypes";
import config from "../config";
const initialState = {
    pageConf: 'about'
};

export default(state = initialState, action) => {
    switch (action.type) {
        case setPageConfPro.REQUEST:
            return {
                ...state,
                pageConf: {menu: (action.json || {}).menu, submenu: (action.json || {}).submenu}
            }
        default:
            return state;
    }
};