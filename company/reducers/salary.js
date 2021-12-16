import {
    changeSalaryInfo,
    getSalaries,
    submitAndCancelSalary,
    approveAndDeclineSalary,
    deleteSalary,
    getSalaryLogs,
    getEmployeeStandard,
    getSubsidiaryCompanies,
} from "../actionTypes";
const initialState = {
    employees: [],
    gettingSalaries: false,
    changingStatus: false,
    gettingLogs: false,
    changingEmp: 'idle',
    salaryLogs: [],
    found: [],
    gettingEmployees: false,
    salaryEmployees: [],
    subCompanies: [],
    gettingSubCompanies: false
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getSalaries.REQUEST:
            return {
                ...state,
                gettingSalaries: true
            };
        case getSalaries.RESPONSE:
            if((action.json || {}).success){
                let emps = ((action.json || {}).employees || []);
                let total = {
                    salary: 0,
                    nemegdel: 0,
                    uramshuulal: 0,
                    iluu_tsagiin_huls: 0,
                    bonus_busad: 0,
                    n_d_sh: 0,
                    h_h_o_a_t: 0,
                    hotsrolt: 0,
                    taslalt: 0,
                    fine_busad: 0,
                    hungulult: 0,
                    hool_unaanii_mungu: 0,
                    approved: 0,
                    count: 0,
                };
                ((action.json || {}).employees || []).forEach((emp) => {
                    ((emp || {}).add || []).map(ad => {
                        if(ad.type !== 'busad'){
                            (total || [])[ad.type] += (ad.amount || 0);
                        }else{
                            (total || [])['bonus_busad'] += (ad.amount || 0);
                        }
                    });
                    ((emp || {}).sub || []).map(su => {
                        if(su.type !== 'busad'){
                            (total || [])[su.type] += (su.amount || 0);
                        }else{
                            (total || [])['fine_busad'] += (su.amount || 0);
                        }
                    });
                    (total || {}).count++;
                    (total || {}).salary += ((emp || {}).salary || 0);
                    (total || {}).hungulult += ((emp || {}).hungulult || 0);
                    (total || {}).hool_unaanii_mungu += ((emp || {}).hool_unaanii_mungu || 0);
                    if(emp.salary_status === 'approved'){
                        (total || {}).approved++;
                    }
                });
                emps.push({
                    user: {
                        first_name: '',
                        last_name: 'Нийт',
                    },
                    salary: (total.salary || 0),
                    add: [
                        {type: 'nemegdel', amount: ((total || {}).nemegdel || 0)},
                        {type: 'uramshuulal', amount: ((total || {}).uramshuulal || 0)},
                        {type: 'iluu_tsagiin_huls', amount: ((total || {}).iluu_tsagiin_huls || 0)},
                        {type: 'busad', amount: ((total || {}).bonus_busad || 0)},
                    ],
                    sub: [
                        {type: 'n_d_sh', amount: ((total || {}).n_d_sh || 0)},
                        {type: 'h_h_o_a_t', amount: ((total || {}).h_h_o_a_t || 0)},
                        {type: 'hotsrolt', amount: ((total || {}).hotsrolt || 0)},
                        {type: 'taslalt', amount: ((total || {}).taslalt || 0)},
                        {type: 'busad', amount: ((total || {}).fine_busad || 0)},
                    ],
                    hungulult: ((total || {}).hungulult || 0),
                    hool_unaanii_mungu: ((total || {}).hool_unaanii_mungu || 0),
                    salary_status: `${((total || {}).approved || 0)}/${((total || {}).count || 0)}`,
                    summary: true
                });
                return {
                    ...state,
                    gettingSalaries: false,
                    employees: (emps || [])
                }
            }else{
                return {
                    ...state,
                    gettingSalaries: false
                }
            }
        case changeSalaryInfo.REQUEST:
            return {
                ...state,
                gettingSalaries: true
            };
        case changeSalaryInfo.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingSalaries: false,
                    employees: (state.employees || []).map(emp => {
                        if((emp._id || '').toString() !== ((action.json || {}).emp || '').toString()){
                            if(emp.summary && emp.summary === true){
                                let initialNumbers = {
                                    salary: 0,
                                    nemegdel: 0,
                                    uramshuulal: 0,
                                    iluu_tsagiin_huls: 0,
                                    bonus_busad: 0,
                                    n_d_sh: 0,
                                    h_h_o_a_t: 0,
                                    hotsrolt: 0,
                                    taslalt: 0,
                                    fine_busad: 0,
                                    hungulult: 0,
                                    hool_unaanii_mungu: 0,
                                    approved: '',
                                    count: '',
                                };
                                [initialNumbers.approved, initialNumbers.count] = (emp.salary_status || '').split('/');
                                (initialNumbers || {}).salary += ((emp || {}).salary || 0);
                                (initialNumbers || {}).hungulult += ((emp || {}).hungulult || 0);
                                (initialNumbers || {}).hool_unaanii_mungu += ((emp || {}).hool_unaanii_mungu || 0);
                                ((emp || {}).add || []).map(ad => {
                                    if(ad.type !== 'busad'){
                                        (initialNumbers || [])[ad.type] += (ad.amount || 0);
                                    }else{
                                        (initialNumbers || [])['bonus_busad'] += (ad.amount || 0);
                                    }
                                });
                                ((emp || {}).sub || []).map(su => {
                                    if(su.type !== 'busad'){
                                        (initialNumbers || [])[su.type] += (su.amount || 0);
                                    }else{
                                        (initialNumbers || [])['fine_busad'] += (su.amount || 0);
                                    }
                                });
                                (initialNumbers || {}).salary += ((action.json || {}).salary || 0);
                                (initialNumbers || {}).hungulult += ((action.json || {}).hungulult || 0);
                                (initialNumbers || {}).hool_unaanii_mungu += ((action.json || {}).hool_unaanii_mungu || 0);
                                ((action.json || {}).add || []).map(ad => {
                                    if(ad.type !== 'busad'){
                                        (initialNumbers || [])[ad.type] += (ad.amount || 0);
                                    }else{
                                        (initialNumbers || [])['bonus_busad'] += (ad.amount || 0);
                                    }
                                });
                                ((action.json || {}).sub || []).map(su => {
                                    if(su.type !== 'busad'){
                                        (initialNumbers || [])[su.type] += (su.amount || 0);
                                    }else{
                                        (initialNumbers || [])['fine_busad'] += (su.amount || 0);
                                    }
                                });

                                if((action.json || {}).prior && Object.keys((action.json || {}).prior || []).length > 0){

                                    (initialNumbers || {}).salary -= (((action.json || {}).prior || {}).initial_salary || 0);
                                    (initialNumbers || {}).hungulult -= (((action.json || {}).prior || {}).hungulult || 0);
                                    (initialNumbers || {}).hool_unaanii_mungu -= (((action.json || {}).prior || {}).hool_unaanii_mungu || 0);

                                    (((action.json || {}).prior || {}).add || []).map(ad => {
                                        if(ad.type !== 'busad'){
                                            (initialNumbers || [])[ad.type] -= (ad.amount || 0);
                                        }else{
                                            (initialNumbers || [])['bonus_busad'] -= (ad.amount || 0);
                                        }
                                    });
                                    (((action.json || {}).prior || {}).sub || []).map(su => {
                                        if(su.type !== 'busad'){
                                            (initialNumbers || [])[su.type] -= (su.amount || 0);
                                        }else{
                                            (initialNumbers || [])['fine_busad'] -= (su.amount || 0);
                                        }
                                    });
                                }

                                return {
                                    ...emp,
                                    salary: (initialNumbers.salary || 0),
                                    add: [
                                        {type: 'nemegdel', amount: ((initialNumbers || {}).nemegdel || 0)},
                                        {type: 'uramshuulal', amount: ((initialNumbers || {}).uramshuulal || 0)},
                                        {type: 'iluu_tsagiin_huls', amount: ((initialNumbers || {}).iluu_tsagiin_huls || 0)},
                                        {type: 'busad', amount: ((initialNumbers || {}).bonus_busad || 0)},
                                    ],
                                    sub: [
                                        {type: 'n_d_sh', amount: ((initialNumbers || {}).n_d_sh || 0)},
                                        {type: 'h_h_o_a_t', amount: ((initialNumbers || {}).h_h_o_a_t || 0)},
                                        {type: 'hotsrolt', amount: ((initialNumbers || {}).hotsrolt || 0)},
                                        {type: 'taslalt', amount: ((initialNumbers || {}).taslalt || 0)},
                                        {type: 'busad', amount: ((initialNumbers || {}).fine_busad || 0)},
                                    ],
                                    hungulult: ((initialNumbers || {}).hungulult || 0),
                                    hool_unaanii_mungu: ((initialNumbers || {}).hool_unaanii_mungu || 0),
                                    salary_status: `${((initialNumbers || {}).approved || 0)}/${((initialNumbers || {}).count || 0)}`,
                                }
                            }else{
                                return emp;
                            }
                        }
                        return {
                            ...emp,
                            salary: ((action.json || {}).salary || 0),
                            add: ((action.json || {}).add || []),
                            sub: ((action.json || {}).sub || []),
                            hungulult: ((action.json || {}).hungulult || 0),
                            hool_unaanii_mungu: ((action.json || {}).hool_unaanii_mungu || 0),
                            salary_id: ((action.json || {}).salary_id || ''),
                            salary_status: ((action.json || {}).status || 'idle')
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    gettingSalaries: false
                }
            }
        case submitAndCancelSalary.REQUEST:
            return {
                ...state,
                changingStatus: true,
                changingEmp: (action.json || {})._id,
            };
        case submitAndCancelSalary.RESPONSE:
            if((action.json || {}).success){
                return{
                    ...state,
                    changingStatus: false,
                    changingEmp: 'idle',
                    employees: (state.employees || []).map((emp) => {
                        if((emp._id || 'as').toString() !== ((action.json || {}).employee || 'sd').toString()){
                            return emp;
                        }
                        return {
                            ...emp,
                            salary_status: ((action.json || {}).status || 'pending')
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    changingStatus: false,
                    changingEmp: 'idle',
                }
            }
        case approveAndDeclineSalary.REQUEST:
            return {
                ...state,
                changingStatus: true,
                changingEmp: (action.json || {})._id,
            };
        case approveAndDeclineSalary.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    changingStatus: false,
                    changingEmp: 'idle',
                    employees: (state.employees || []).map((emp) => {
                        if((emp._id || 'as').toString() !== ((action.json || {}).employee || 'sd').toString()){
                            if(emp.summary && emp.summary === true && (action.json || {}).status === 'approved'){
                                let [approved, count] = (emp.salary_status || '').split('/');
                                approved = (parseInt(approved)+1 || 0).toString();
                                return {
                                    ...emp,
                                    salary_status: `${approved}/${count}`
                                };
                            }
                            return emp;
                        }
                        return {
                            ...emp,
                            salary_status: ((action.json || {}).status || 'declined')
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    changingStatus: false,
                    changingEmp: 'idle',
                }
            }
        case deleteSalary.REQUEST:
            return {
                ...state,
                changingStatus: true,
                changingEmp: (action.json || {})._id
            };
        case deleteSalary.RESPONSE:
            if((action.json || {}).success){
                let initialNumbers = {
                    salary: 0,
                    nemegdel: 0,
                    uramshuulal: 0,
                    iluu_tsagiin_huls: 0,
                    bonus_busad: 0,
                    n_d_sh: 0,
                    h_h_o_a_t: 0,
                    hotsrolt: 0,
                    taslalt: 0,
                    fine_busad: 0,
                    hungulult: 0,
                    hool_unaanii_mungu: 0,
                    approved: '',
                    count: '',
                };
                (state.employees || []).map(emp => {

                });
                return {
                    ...state,
                    employees: (state.employees || []).map((emp) => {
                        if((emp._id || 'as').toString() !== ((action.json || {}).employee || 'sd').toString()){
                            if(emp.summary && emp.summary === true){
                                [initialNumbers.approved, initialNumbers.count] = (emp.salary_status || '').split('/');
                                (initialNumbers || {}).salary += ((emp || {}).salary || 0);
                                (initialNumbers || {}).hungulult += ((emp || {}).hungulult || 0);
                                (initialNumbers || {}).hool_unaanii_mungu += ((emp || {}).hool_unaanii_mungu || 0);
                                ((emp || {}).add || []).map(ad => {
                                    if (ad.type !== 'busad') {
                                        (initialNumbers || [])[ad.type] += (ad.amount || 0);
                                    } else {
                                        (initialNumbers || [])['bonus_busad'] += (ad.amount || 0);
                                    }
                                });
                                ((emp || {}).sub || []).map(su => {
                                    if (su.type !== 'busad') {
                                        (initialNumbers || [])[su.type] += (su.amount || 0);
                                    } else {
                                        (initialNumbers || [])['fine_busad'] += (su.amount || 0);
                                    }
                                });

                                (initialNumbers || {}).salary -= (((action.json || {}).deleted || {}).initial_salary || 0);
                                (initialNumbers || {}).hungulult -= (((action.json || {}).deleted || {}).hungulult || 0);
                                (initialNumbers || {}).hool_unaanii_mungu -= (((action.json || {}).deleted || {}).hool_unaanii_mungu || 0);
                                (((action.json || {}).deleted || {}).add || []).map(ad => {
                                    if(ad.type !== 'busad'){
                                        (initialNumbers || [])[ad.type] -= (ad.amount || 0);
                                    }else{
                                        (initialNumbers || [])['bonus_busad'] -= (ad.amount || 0);
                                    }
                                });
                                (((action.json || {}).deleted || {}).sub || []).map(su => {
                                    if(su.type !== 'busad'){
                                        (initialNumbers || [])[su.type] -= (su.amount || 0);
                                    }else{
                                        (initialNumbers || [])['fine_busad'] -= (su.amount || 0);
                                    }
                                });
                                return {
                                    ...emp,
                                    salary: (initialNumbers.salary || 0),
                                    add: [
                                        {type: 'nemegdel', amount: ((initialNumbers || {}).nemegdel || 0)},
                                        {type: 'uramshuulal', amount: ((initialNumbers || {}).uramshuulal || 0)},
                                        {type: 'iluu_tsagiin_huls', amount: ((initialNumbers || {}).iluu_tsagiin_huls || 0)},
                                        {type: 'busad', amount: ((initialNumbers || {}).bonus_busad || 0)},
                                    ],
                                    sub: [
                                        {type: 'n_d_sh', amount: ((initialNumbers || {}).n_d_sh || 0)},
                                        {type: 'h_h_o_a_t', amount: ((initialNumbers || {}).h_h_o_a_t || 0)},
                                        {type: 'hotsrolt', amount: ((initialNumbers || {}).hotsrolt || 0)},
                                        {type: 'taslalt', amount: ((initialNumbers || {}).taslalt || 0)},
                                        {type: 'busad', amount: ((initialNumbers || {}).fine_busad || 0)},
                                    ],
                                    hungulult: ((initialNumbers || {}).hungulult || 0),
                                    hool_unaanii_mungu: ((initialNumbers || {}).hool_unaanii_mungu || 0)
                                }
                            }
                            return emp;
                        }
                        return {
                            ...emp,
                            salary: 0,
                            add: [
                                {amount: 0, type: 'nemegdel', description: ''},
                                {amount: 0, type: 'uramshuulal', description: ''},
                                {amount: 0, type: 'iluu_tsagiin_huls', description: ''},
                                {amount: 0, type: 'busad', description: ''}
                            ],
                            sub: [
                                {amount: 0, type: 'taslalt', description: ''},
                                {amount: 0, type: 'hotsrolt', description: ''},
                                {amount: 0, type: 'n_d_sh', description: ''},
                                {amount: 0, type: 'h_h_o_a_t', description: ''},
                                {amount: 0, type: 'busad', description: ''}
                            ],
                            hungulult: 0,
                            hool_unaanii_mungu: 0,
                            salary_id: ''
                        }
                    })
                }
            }else{
                return {
                    ...state,
                    changingStatus: false,
                    changingEmp: 'idle',
                }
            }
        case getSalaryLogs.REQUEST:
            return {
                ...state,
                gettingLogs: true
            };
        case getSalaryLogs.RESPONSE:
            let employs = [];
            let logs = ((action.json || {}).logs || []);
            logs.map(log => {
                if((employs || []).every((emp) => (emp.emp || 'as').toString() !== ((log.salEmployee || {}).emp || 'ds').toString())){
                    employs.push({
                        ...log.salEmployee,
                        logs: []
                    });
                }
            });
            employs = (employs || []).map(emp => {
                let temp = [];
                logs.map(log => {
                    if((emp.emp || 'as').toString() === ((log.salEmployee || {}).emp || 'ds').toString()){
                        temp.push(log);
                    }
                });
                return {
                    ...emp,
                    logs: temp
                }
            });
            return {
                ...state,
                gettingLogs: false,
                salaryLogs: ((action.json || {}).logs || []),
                salaryEmployees: employs
            };
        case getEmployeeStandard.REQUEST:
            return {
                ...state,
                gettingEmployees: true
            };
        case getEmployeeStandard.RESPONSE:
            return {
                ...state,
                gettingEmployees: false,
                found: ((action.json || {}).employees || [])
            };
        case getSubsidiaryCompanies.REQUEST:
            return {
                ...state,
                gettingSubCompanies: true
            }
        case getSubsidiaryCompanies.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingSubCompanies: false,
                    subCompanies: ((action.json || {}).companies)
                }
            }else{
                return {
                    ...state,
                    gettingSubCompanies: false
                }
            }
        default:
            return state;
    }
};