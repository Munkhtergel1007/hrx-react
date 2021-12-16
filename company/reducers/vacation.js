import {
    changeCompanyVacation,
    getAllVacations,
    respondToVacationRequest
} from '../actionTypes'
const initialState = {
    gettingVacations: false,
    creatingVacation: false,
    vacations: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case changeCompanyVacation.REQUEST:
            return {
                ...state,
                creatingVacation: true
            }
        case changeCompanyVacation.RESPONSE:
            return {
                ...state,
                creatingVacation: false,
                vacations: action.json.success ?
                    action.json.delete ?
                        state.vacations.filter(vac => vac._id !== action.json._id)
                    : action.json._id ?
                        state.vacations.map((c) => {
                            if(c._id === action.json._id) {
                                c = action.json.vacation;
                            }
                            return c
                        })
                        : [action.json.vacation, ...state.vacations]
                    : state.vacations
            }
        case getAllVacations.REQUEST:
            return {
                ...state,
                gettingVacations: true
            }
        case getAllVacations.RESPONSE:
            return {
                ...state,
                gettingVacations: false,
                vacations: action.json.vacations || state.vacations,
                all: action.json.all || state.all
            }
        case respondToVacationRequest.REQUEST:
            return {
                ...state
            }
        case respondToVacationRequest.RESPONSE:
            return {
                ...state,
                vacations: state.vacations.map(vac => {
                    if(vac._id.toString() !== action.json._id) {
                        return vac
                    }
                    return {
                        ...vac,
                        status: action.json.status,
                        approved_by: {
                            emp: action.json.employee || {},
                            user: action.json.user || {}
                        }
                    }
                })
            }
        default:
            return state
    }
}