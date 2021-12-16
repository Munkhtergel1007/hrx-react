import {
    getOrientation,
    getEmployeeOrientation,
    createOrientation,
    deleteOrientation,
    changeEmployeeOrientation,
    finishEmployeeOrientation
} from "../actionTypes";
import config from "../config";
import moment from "moment";
const initialState = {
    gettingOrientation: false,
    orientation: [],
    gettingEmployees: false,
    orientationEmployees: [],
    allEmployees: 0,
    allOrientation: 0,
    changingOrientation: false
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getOrientation.REQUEST:
            return {
                ...state,
                gettingOrientation: true,
            }
        case getOrientation.RESPONSE:
            return {
                ...state,
                gettingOrientation: false,
                orientation: ((action.json || {}).orientation || []),
                allOrientation: ((action.json || {}).allOrientation || 0)
            }
        case getEmployeeOrientation.REQUEST:
            return {
                ...state,
                gettingEmployees: true
            }
        case getEmployeeOrientation.RESPONSE:
            return {
                ...state,
                gettingEmployees: false,
                orientationEmployees: ((action.json || {}).employees || []),
                allEmployees: ((action.json || {}).allEmployees || 0)
            }
        case createOrientation.REQUEST:
            return {
                ...state,
                gettingOrientation: true,
            }
        case createOrientation.RESPONSE:
            if((action.json || {}).success){
                if((action.json || {})._id && action.json._id !== ''){
                    return {
                        ...state,
                        gettingOrientation: false,
                        orientation: (state.orientation || []).map(orien => {
                            if((orien._id || 'as').toString() !== (action.json._id || '').toString()){
                                return orien;
                            }
                            return {
                                ...((action.json || {}).orientation || {})
                            }
                        }),
                        allOrientation: ((state || {}).allOrientation || 0)+1
                    }
                }else{
                    return {
                        ...state,
                        gettingOrientation: false,
                        orientation:
                            (action.json || {}).pageSize === (state.orientation || []).length ? [
                                ((action.json || {}).orientation || {}), ...(state.orientation || []).slice(1, (action.json || {}).pageSize)
                            ] : [((action.json || {}).orientation || {}), ...(state.orientation || [])],
                        allOrientation: ((state || {}).allOrientation || 0)+1
                    }
                }
            }else{
                return {
                    ...state,
                    gettingOrientation: false
                }
            }
        case deleteOrientation.REQUEST:
            return {
                ...state,
                gettingOrientation: true,
            }
        case deleteOrientation.RESPONSE:
            if((action.json || {}).success){
                let updated = (state.orientation || []).filter(orien => (orien._id || 'as').toString() !== ((action.json || {})._id || '').toString());
                if(action.json?.orient){
                    updated = [...updated, action.json?.orient];
                }
                return {
                    ...state,
                    gettingOrientation: false,
                    orientation: updated,
                    allOrientation: ((state || {}).allOrientation || 0)-1
                }
            }else{
                return {
                    ...state,
                    gettingOrientation: false
                }
            }
        case changeEmployeeOrientation.REQUEST:
            return {
                ...state,
                changingOrientation: true,
            }
        case changeEmployeeOrientation.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    changingOrientation: false,
                    orientationEmployees: (state.orientationEmployees || []).map(emp => {
                        if((emp._id || 'as').toString() !== ((action.json || {})._id || '').toString()){
                            return emp;
                        }
                        return {
                            ...emp,
                            list_environment: (action.json || {}).list_environment,
                            list_extra: (action.json || {}).list_extra
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    changingOrientation: false,
                }
            }
        case finishEmployeeOrientation.REQUEST:
            return {
                ...state,
                changingOrientation: true
            }
        case finishEmployeeOrientation.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    changingOrientation: false,
                    orientationEmployees: (state.orientationEmployees || []).filter(emp => (emp._id || 'sd').toString() !== ((action.json || {})._id || '').toString()),
                    allEmployees: (state.allEmployees || 0)-1
                }
            }else{
                return {
                    ...state,
                    changingOrientation: false
                }
            }
        default:
            return state;
    }
};