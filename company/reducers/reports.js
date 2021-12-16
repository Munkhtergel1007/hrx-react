import { changeReport, getEmployeeStandard, getReceived, getCreated, deleteReport, removeReport, getReport } from "../actionTypes";

const initialState = {
    gettingEmployees: false,
    employees: [],
    createdReports: [],
    receivedReports: [],
    gettingCreated: false,
    gettingReceived: false,
    changingReport: false,
    totalReceived: 0,
    totalCreated: 0,
    deletingReport: false,
};

export default (state = initialState, action) => {
    switch (action.type){
        case getEmployeeStandard.REQUEST:
            return {
                ...state,
                gettingEmployees: true
            }
        case getEmployeeStandard.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingEmployees: false,
                    employees: (action.json.employees || [])
                }
            }else{
                return {
                    ...state,
                    gettingEmployees: false
                }
            }
        case changeReport.REQUEST:
            return {
                ...state,
                changingReport: true,
            }
        case changeReport.RESPONSE:
            return {
                ...state,
                changingReport: false,
                createdReports: (action.json.success && action.json.create) ?
                    [action.json.report, ...state.createdReports] :
                    state.createdReports,
                totalCreated: (action.json.success && action.json.create) ?
                    state.totalCreated + 1 :
                    state.totalCreated
            }
        case getReceived.REQUEST:
            return {
                ...state,
                gettingReceived: true
            }
        case getReceived.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingReceived: false,
                    receivedReports: (action.json.data || []),
                    totalReceived: (action.json.all || 0),
                }
            }else {
                return {
                    ...state,
                    gettingReceived: false,
                }
            }
        case getCreated.REQUEST:
            return {
                ...state,
                gettingCreated: true
            }
        case getCreated.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingCreated: false,
                    createdReports: (action.json.data || []),
                    totalCreated: (action.json.all || 0),
                }
            }else {
                return {
                    ...state,
                    gettingCreated: false,
                }
            }
        case getReport.REQUEST:
            return {
                ...state,
                gettingCreated: true,
                gettingReceived: true
            }
        case getReport.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingCreated: false,
                    gettingReceived: false,
                    createdReports: (action.json.created || []),
                    totalCreated: (action.json.totalCreated || 0),
                    receivedReports: (action.json.received || []),
                    totalReceived: (action.json.totalReceived || 0),
                }
            }else {
                return {
                    ...state,
                    gettingCreated: false,
                    gettingReceived: false,
                    totalCreated: 0,
                    totalReceived: 0
                }
            }
        case deleteReport.REQUEST:
            return {
                ...state,
                deletingReport: true
            }
        case deleteReport.RESPONSE:
            if((action.json || {}).success){
                if((action.json || {}).isCreated){
                    return {
                        ...state,
                        createdReports: state.createdReports.filter(report => {
                            return report._id !== action.json._id
                        }),
                        deletingReport: false,
                        totalCreated: state.totalCreated - 1 
                    }
                }else{
                    return {
                        ...state,
                        receivedReports: state.receivedReports.filter(report => 
                            report._id !== action.json._id
                        ),
                        deletingReport: false,
                        totalReceived: state.totalReceived - 1 
                    }
                }
            }else {
                return {
                    ...state,
                    deletingReport: false
                }
            }
        default:
            return state;
    }
}