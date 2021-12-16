import {
    changeCompanyMain,
    createRole,
    getAllRoles,
    getBundles,
    createCharge,
    getCharges,
    deleteRole,
    getAllTags,
    addTag,
    deleteTag,
    addSubTag,
    deleteSubTag,
    getEmployeeStandard,
    getTimetables,
    createTimetable,
    deleteTimetable,
    deleteEmpTimetable,
    getAllAdmins,
    createAttendanceCollector,
    createHrManager,
    setPageConfSet,
    getJobDescriptions,
    getOrientation,
    changeActions,
    clearActions,
    addActions,
    derankEmployee
} from "../actionTypes";

const initialState = {
    updating: false,
    gettingRoles: false,
    gettingBundles: false,
    requestingBundle: false,
    gettingCharges: true,
    creatingRole: false,
    gettingTags: false,
    addingTag: false,
    deletingTag: false,
    gettingAdmins: false,
    admins: [],
    bundles: [],
    requests: [],
    roles: [],
    tags: [],
    gettingEmployees: false,
    employees: [],
    gettingTimetables: false,
    timetables: [],
    timetableCount: 0,
    pageConf: {menu: 'administration', submenu: 'administration1'},
    jobDescriptions: [],
    gettingJobDescriptions: false,
    orientation: [],
    gettingOrientation: false,
    actions: []
};

export default(state = initialState, action) => {
    switch (action.type) {
        case setPageConfSet.REQUEST:
            return {
                ...state,
                // pageConf: (action.json || {}).menu
                pageConf: {menu: (action.json || {}).menu, submenu: (action.json || {}).submenu}
            }
        case getCharges.REQUEST:
            return {
                ...state,
                gettingCharges: true
            };
        case getCharges.RESPONSE:
            return {
                ...state,
                gettingCharges: false,
                requests: action.json.chargeRequests || []
            };
        case createCharge.REQUEST:
            return {
                ...state,
                requestingBundle: true
            };
        case createCharge.RESPONSE:
            return {
                ...state,
                requestingBundle: false,
                requests: action.json.success ? [action.json.chargeRequest, ...state.requests] : state.requests
            };
        case getBundles.REQUEST:
            return {
                ...state,
                gettingBundles: true
            };
        case getBundles.RESPONSE:
            return {
                ...state,
                gettingBundles: false,
                bundles: action.json.bundles || []
            };
        case createRole.REQUEST:
            return {
                ...state,
                creatingRole: true
            };
        case createRole.RESPONSE:
            return {
                ...state,
                creatingRole: false,
                roles: action.json.success ?
                        action.json._id ?
                            state.roles.map((c) => {
                                if(c._id === action.json._id){c = action.json.role;}
                                return c;
                            })
                        : [action.json.role, ...state.roles]
                    : state.roles,
                actions: []
            };
        case deleteRole.REQUEST:
            return {
                ...state,
                gettingRoles: true
            };
        case deleteRole.RESPONSE:
            if((action.json || {}).success){
                return{
                    ...state,
                    gettingRoles: false,
                    roles: state.roles.filter((role)=>role._id !== action.json.deletedRole)
                };
            }else{
                return{
                    ...state,
                    gettingRoles: false
                };
            }
        case getAllRoles.REQUEST:
            return {
                ...state,
                gettingRoles: true
            };
        case getAllRoles.RESPONSE:
            return {
                ...state,
                gettingRoles: false,
                roles: action.json.roles || state.roles
            };
        case changeCompanyMain.REQUEST:
            return {
                ...state,
                updating: true,
            };
        case changeCompanyMain.RESPONSE:
            return {
                ...state,
                updating: false,
            };
        case getAllTags.REQUEST:
            return {
                ...state,
                gettingTags: true
            }
        case getAllTags.RESPONSE:
            return {
                ...state,
                gettingTags: false,
                tags: action.json.success ? action.json.tags : state.tags
            }
        case addTag.REQUEST:
            return {
                ...state,
                addingTag: true
            }
        case addTag.RESPONSE:
            return {
                ...state,
                tags: action.json.success ?
                    action.json.id ?
                        state.tags.map(c => {
                            if(c._id === action.json.id) {
                                c = action.json.tag;
                            }
                            return c
                        })
                    : [action.json.tag, ...state.tags]
                : state.tags,
                addingTag: false
            }
        case deleteTag.REQUEST:
            return {
                ...state,
                deletingTag: true
            }
        case deleteTag.RESPONSE:
            return {
                ...state,
                tags: action.json.success ? state.tags.filter(tag => tag._id !== action.json.id) : state.tags,
                deletingTag: false
            }
        case addSubTag.REQUEST:
            return {
                ...state,
                addingTag: true
            }
        case addSubTag.RESPONSE:
            return {
                ...state,
                tags: action.json.success ?
                    state.tags.map(c => {
                        if(c._id !== action.json.id) {
                            return c
                        }
                        return {
                            ...c,
                            sub_tags:
                                action.json.edit ?
                                    c.sub_tags ?
                                        c.sub_tags.map(sub => {
                                            if(sub._id !== action.json.tag._id){
                                                return sub
                                            }
                                            return action.json.tag
                                        })
                                    : c.sub_tags
                                : c.sub_tags ? [action.json.tag, ...c.sub_tags] : [action.json.tag]
                        }
                    })
                : state.tags,
                addingTag: false
            }
        case deleteSubTag.REQUEST:
            return {
                ...state,
                deletingTag: true
            }
        case deleteSubTag.RESPONSE:
            return {
                ...state,
                tags: action.json.success ?
                    state.tags.map(tag => {
                        if(tag._id !== action.json.id) {
                            return tag
                        }
                        return {
                            ...tag,
                            sub_tags: tag.sub_tags ? tag.sub_tags.filter(c => c._id !== action.json.tag._id) : tag.sub_tags
                        }
                    })
                : state.tags,
                deletingTag: false
            }
        case getTimetables.REQUEST:
            return {
                ...state,
                gettingTimetables: true
            }
        case getTimetables.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    // timetables: ((action.json || {}).timetables).map(tb =>
                    //     state.employees.map(emp => {
                    //         if((tb._id || '').toString() === (emp._id || '').toString()){
                    //             tb.employee = [...tb.employee, emp];
                    //         }
                    //     })
                    // )
                    timetableCount: ((action.json || {}).all || 0),
                    timetables: ((action.json || {}).timetables || []).map(tb => {
                        let temp = tb;
                        temp.employees = [];
                        ((action.json || {}).timetableEmp || []).map(emp => {
                            if((tb._id || '').toString() === (emp.timetable || '').toString()){
                                temp.employees.push(emp);
                            }
                        })
                        return temp;
                    }),
                    gettingTimetables: false
                }
            }else{
                return {
                    ...state,
                    gettingTimetables: false
                }
            }
        case getEmployeeStandard.REQUEST:
            return {
                ...state,
                gettingEmployees: true
            };
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
        case createTimetable.REQUEST:
            return {
                ...state,
                gettingTimetables: true
            };
        case createTimetable.RESPONSE:
            let newEmpIds = ((action.json || {}).emps || []).map(emp => {return emp._id});
            if((action.json || {}).success){
                if((action.json || {}).changed && ((action.json || {}).changed || '').length > 0){
                    return {
                        ...state,
                        gettingTimetables: false,
                        timetables: state.timetables.map(tm => {
                            if(tm._id.toString() !== (action.json || {}).changed){
                                return {
                                    ...tm,
                                    employees: tm.employees.filter(eml => !newEmpIds.includes((eml._id || '').toString()))
                                }
                            }
                            return {
                                ...(action.json || {}).timetable,
                                employees: (action.json || {}).emps
                            };
                        })
                    }
                }else{
                    let timetables = state.timetables.map(tm => {
                        return {
                            ...tm,
                            employees: tm.employees.filter(eml => !newEmpIds.includes((eml._id || '').toString()))
                        }
                    });
                    if(timetables && (timetables || []).length > 0){
                        return {
                            ...state,
                            gettingTimetables: false,
                            timetables: [{
                                ...(action.json || {}).timetable,
                                employees: (action.json || {}).emps
                            }, ...timetables ],
                            timetableCount: state.timetableCount+1
                        }
                    }else{
                        return {
                            ...state,
                            gettingTimetables: false,
                            timetables: [{
                                ...(action.json || {}).timetable,
                                employees: (action.json || {}).emps
                            }],
                            timetableCount: state.timetableCount+1
                        }
                    }
                }
            }else{
                return{
                    ...state,
                    gettingTimetables: false
                }
            }
        case deleteTimetable.REQUEST:
            return {
                ...state,
                gettingTimetables: true
            };
        case deleteTimetable.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingTimetables: false,
                    timetables: state.timetables.filter(tim => (tim._id || '').toString() !== action.json.id),
                    timetableCount: state.timetableCount-1
                }
            }else{
                return {
                    ...state,
                    gettingTimetables: false
                }
            }
        case deleteEmpTimetable.REQUEST:
            return {
                ...state,
                gettingTimetables: true
            };
        case deleteEmpTimetable.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingTimetables: false,
                    timetables: state.timetables.map(tm => {
                        if(tm._id.toString() !== action.json.timetable){
                            return tm;
                        }
                        return {
                            ...tm,
                            employees: tm.employees.filter(tb => tb._id.toString() !== action.json.emp)
                        }
                    })
                }
            } else {
                return {
                    state,
                    gettingTimetables: false
                };
            }
        case getAllAdmins.REQUEST:
            return {
                ...state,
                gettingAdmins: true
            }
        case getAllAdmins.RESPONSE:
            return {
                ...state,
                admins: action.json.success ? action.json.admins : state.admins,
                gettingAdmins: false
            }
        case createAttendanceCollector.REQUEST:
            return {
                ...state,
                changingAdmins: true
            }
        case createAttendanceCollector.RESPONSE:
            return {
                ...state,
                admins: action.json.success ? [{...action.json.emp, user: action.json.user}, ...state.admins] : state.admins,
                changingAdmins: false
            }
        case createHrManager.REQUEST:
            return {
                ...state,
                changingAdmins: true
            }
        case createHrManager.RESPONSE:
            return {
                ...state,
                admins: action.json.success ? [action.json.emp, ...state.admins] : state.admins,
                changingAdmins: false
            }
        case derankEmployee.REQUEST:
            return {
                ...state,
                changingAdmins: true
            }
        case derankEmployee.RESPONSE:
            return {
                ...state,
                changingAdmins: false,
                admins: action.json.success ? (state.admins || []).filter(admin => (admin._id || 'as').toString() !== (action.json._id || '').toString()) : state.admins,
            }
        case getOrientation.REQUEST:
            return {
                ...state,
                gettingOrientation: true,
            }
        case getOrientation.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingOrientation: false,
                    orientation: ((action.json || {}).orientation || [])
                }
            }else{
                return {
                    ...state,
                    gettingOrientation: false,
                }
            }
        case getJobDescriptions.REQUEST:
            return {
                ...state,
                gettingJobDescriptions: true
            }
        case getJobDescriptions.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingJobDescriptions: false,
                    jobDescriptions: ((action.json || {}).jobDescriptions || [])
                }
            }else{
                return {
                    ...state,
                    gettingJobDescriptions: false,
                }
            }
        case changeActions.REQUEST:
            let value = ((action.json || {}).target || {}).value;
            if((state.actions).includes(value)){
                return {
                    ...state,
                    actions: (state.actions || []).filter(act => act !== value)
                }
            }else{
                return {
                    ...state,
                    actions: [ value , ...(state.actions || []) ]
                }
            }
        case clearActions.REQUEST:
            return {
                ...state,
                actions: []
            }
        case addActions.REQUEST:
            return {
                ...state,
                actions: ((action.json || {}).actions || [])
            }
        default:
            return state;
    }
};