import {
    getSubsidiaryCompany,
    createSubsidiaryCompany,
    deleteSubsidiaryCompany,
    getUsers,
    cancelSubsidiaryCompanyDeletion
} from "../actionTypes";

const initialState = {
    gettingCompanies: false,
    subCompanies: [],
    gettingUsers: false,
    users: []
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getSubsidiaryCompany.REQUEST:
            return {
                ...state,
                gettingCompanies: true
            };
        case getSubsidiaryCompany.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingCompanies: false,
                    subCompanies: ((action.json || {}).companies || [])
                }
            }else{
                return {
                    ...state,
                    gettingCompanies: false
                }
            }
        case createSubsidiaryCompany.REQUEST:
            return {
                ...state,
                gettingCompanies: true
            };
        case createSubsidiaryCompany.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingCompanies: false,
                    subCompanies: [...(state.subCompanies || []), ((action.json || {}).company || {})]
                }
            }else{
                return {
                    ...state,
                    gettingCompanies: false
                }
            }
        case deleteSubsidiaryCompany.REQUEST:
            return {
                ...state,
                gettingCompanies: true
            };
        case deleteSubsidiaryCompany.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingCompanies: false,
                    subCompanies: (state.subCompanies || []).map(com => {
                        if((com._id || 'as').toString() !== ((action.json || {}).id || '').toString()){
                            return com;
                        }
                        return {
                            ...com,
                            willBeDeletedBy: (action.json || {}).willBeDeletedBy,
                            deletionRequestedBy: (action.json || {}).deletionRequestedBy
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    gettingCompanies: false
                }
            }
        case getUsers.REQUEST:
            return {
                ...state,
                gettingUsers: true
            }
        case getUsers.RESPONSE:
            return {
                ...state,
                gettingUsers: false,
                users: ((action.json || {}).users)
            }
        case cancelSubsidiaryCompanyDeletion.REQUEST:
            return {
                ...state,
                gettingCompanies: true
            }
        case cancelSubsidiaryCompanyDeletion.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingCompanies: false,
                    subCompanies: (state.subCompanies || []).map(com => {
                        if((com._id || 'as').toString() !== ((action.json || {}).id || '').toString()){
                            return com;
                        }
                        return {
                            ...com,
                            willBeDeletedBy: (action.json || {}).willBeDeletedBy,
                            cancelledBy: (action.json || {}).cancelledBy
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    gettingCompanies: false
                }
            }
        default:
            return state;
    }
};