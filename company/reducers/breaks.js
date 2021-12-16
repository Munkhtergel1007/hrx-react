import {
    editEmpBreak,
    getAllBreak
} from "../actionTypes";
import config from "../config";
const initialState = {
    gettingAllBreaks: false,
    breaks: [],
    all: 0
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getAllBreak.REQUEST:
            return{
                ...state,
                gettingAllBreaks: true
            };
        case getAllBreak.RESPONSE:
            return{
                ...state,
                gettingAllBreaks: false,
                breaks: (action.json.breaks || []),
                all: (action.json.all || 0)
            };
        case editEmpBreak.REQUEST:
            return{
                ...state,
                gettingAllBreaks: true,
            };
        case editEmpBreak.RESPONSE:
            return{
                ...state,
                breaks:
                    action.json.notFound ?
                        state.breaks.filter(brk => brk._id.toString() !== action.json.notFound)
                        :
                        state.breaks.map(brk => {
                            if(brk._id.toString() !== action.json._id){
                                return brk;
                            }
                            return{
                                ...brk,
                                status: action.json.status,
                                approved_by: {
                                    emp: (action.json.employee || {}),
                                    user: (action.json.user || {})
                                }
                            }
        })
            }
        default:
            return state;
    }
};