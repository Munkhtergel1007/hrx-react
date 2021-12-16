import {
    createCompany,
    changeCreateTabKey,
    setCMRole,
    employeeRemoveCM,
    employeeAddCM,
    searchUser,
    setEmployees,
    getCompanies,
    changeCompanyBundle,
    setCompanyBundle,
    createCompanyUser,
    editCompany,
    saveCompanyForm,
    changeCompanyStatus,
    getLord,
    removeLord,
    createLord,
    findUser,
    addAction
} from "../actionTypes";
const initialState = {
    creating: false,
    creatingUser: false,
    searchingUser: false,
    insertingEmp: false,
    gettingCompanies: false,
    settingCompanyBundle: false,
    singleCompany: {},
    companies: [],
    companyMembers: [],
    searchedUsers: [],
    createTabActive: '1',
    editCompany: {},
    editCompanyLoading: false,
    saveCompanyForm: false,
    changeCompanyStatusLoading: false,
    lord: null,
    findingUser: false,
    foundedUsers: [],
};

export default(state = initialState, action) => {
    switch (action.type) {
        case setCompanyBundle.REQUEST:
            return {
                ...state,
                settingCompanyBundle: true
            };
        case setCompanyBundle.RESPONSE:
            return {
                ...state,
                settingCompanyBundle: false
            };
        case changeCompanyBundle.REQUEST:
            return {
                ...state,
                singleCompany: {
                    ...state.singleCompany,
                    bundle: action.data
                }
            };
        case getCompanies.REQUEST:
            return {
                ...state,
                gettingCompanies: true
            };
        case getCompanies.RESPONSE:
            return {
                ...state,
                gettingCompanies: false,
                companies: action.json.companies || []
            };
        case setEmployees.REQUEST:
            return {
                ...state,
                insertingEmp: true
            };
        case setEmployees.RESPONSE:
            return {
                ...state,
                insertingEmp: false,
                singleCompany: {
                    ...state.singleCompany,
                    employees: (action.json.empls || []).length
                },
                createTabActive: action.json.success ? '3' : '2'
            };
        case employeeAddCM.REQUEST:
            return {
                ...state,
                companyMembers: state.companyMembers.some((c) => c.user._id === action.data) ?
                    state.companyMembers
                    : [
                        {
                            company: state.singleCompany._id,
                            user: (state.searchedUsers.filter((c) => c._id === action.data) || [])[0] || {},
                            staticRole: 'employee'
                        },
                        ...state.companyMembers
                    ],
                searchedUsers: state.searchedUsers.filter((c) => c._id !== action.data)
            };
        case searchUser.REQUEST:
            return {
                ...state,
                searchingUser: true
            };
        case searchUser.RESPONSE:
            return {
                ...state,
                searchingUser: false,
                searchedUsers: (action.json.users || [])
            };
        case employeeRemoveCM.REQUEST:
            return {
                ...state,
                companyMembers: state.companyMembers.filter((c) => c._id !== action.data)
            };
        case setCMRole.REQUEST:
            return {
                ...state,
                companyMembers: state.companyMembers.map((c) => {
                    if(c.user._id === action.data._id){
                        c.staticRole = action.data.staticRole;
                    }
                    return c;
                })
            };
        case createCompanyUser.REQUEST:
            return {
                ...state,
                creatingUser: true
            };
        case createCompanyUser.RESPONSE:
            return {
                ...state,
                creatingUser: false,
                companyMembers: action.json.success ? [
                    ...state.companyMembers,
                    {
                        company: state.singleCompany._id,
                        user: (action.json.user || {}),
                        staticRole: 'lord'
                    }
                ] : state.companyMembers
            };
        case changeCreateTabKey.REQUEST:
            return {
                ...state,
                createTabActive: action.key
            };
        case createCompany.REQUEST:
            return {
                ...state,
                creating: true
            };
        case createCompany.RESPONSE:
            return {
                ...state,
                creating: false,
                createTabActive: action.json.success ? '2' : '1',
                singleCompany: action.json.company || {},
                companies: action.json.company ? [action.json.company, ...state.companies] : [...state.companies]
            };
        case editCompany.REQUEST:
            return {
                ...state,
                editCompanyLoading: true
            }
        case editCompany.RESPONSE:
            if(action.json.success) {
                return {
                    ...state,
                    editCompanyLoading: false,
                    editCompany: action.json.company
                }
            } else {
                return {
                    ...state,
                    editCompanyLoading: false
                }
            }
        case saveCompanyForm.REQUEST:
            return {
                ...state,
                saveCompanyFormLoading: true
            }
        case saveCompanyForm.RESPONSE:
            if(action.json.success) {
                return {
                    ...state,
                    editCompany: action.json.company,
                    saveCompanyFormLoading: false,
                }
            } else {
                if (action.json.backurl) {
                    window.location.href = action.json.backurl
                } else {
                    return {
                        ...state,
                        saveCompanyFormLoading: false,
                        editCompany: (action.json.data || state.editCompany)
                    }
                }
            }
        case changeCompanyStatus.REQUEST:
            return {
                ...state,
                changeCompanyStatusLoading: true
            }
        case changeCompanyStatus.RESPONSE:
            if(action.json.success) {
                let a = state.companies.filter((record) => {
                    if (record.status !== 'delete') {
                        if(record._id === action.json.company._id) {
                            record.status = action.json.company.status
                        }
                        return record
                    }
                })
                return {
                    ...state,
                    companies: a,
                    changeCompanyStatusLoading: false
                }
            } else {
                return {
                    ...state,
                    changeCompanyStatusLoading: false
                }
            }
        case getLord.REQUEST:
            return {
                ...state
            }
        case getLord.RESPONSE:
            return {
                ...state,
                lord: action.json.success ? action.json.lord : state.lord
            }
        case removeLord.REQUEST: 
            return {
                ...state
            }
        case removeLord.RESPONSE:
            return {
                ...state,
                lord: action.json.success ? null : state.lord
            }
        case createLord.REQUEST:
            return {
                ...state
            }
        case createLord.RESPONSE: 
            return {
                ...state,
                lord: action.json.success ?
                    {
                        ...action.json.emp,
                        user: action.json.user
                    }
                : null
            }
        case findUser.REQUEST:
            return {
                    ...state,
                    findingUser: true,
                };
        case findUser.RESPONSE:
            return {
                ...state,
                findingUser: false,
                foundedUsers: action.json.users || [],
                };
        case addAction.REQUEST:
            return state
        default:
            return state;
    }
};