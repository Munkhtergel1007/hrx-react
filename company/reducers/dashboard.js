import {
    getAllEmployeesUsers,
    getEmployeeWorkplans
} from "../actionTypes";
import config, {isValidDate} from "../config";
const initialState = {
    status: 0,
    employees: [],
    data: [],
    all: 0,
    attendance: [],
    workplans: [],
    gettingWorkplan: false
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getAllEmployeesUsers.REQUEST:
            return {
                ...state,
                status: 1,
            };
        case getAllEmployeesUsers.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    status: 0,
                    data: ((action.json || {}).data || []),
                    all: ((action.json || {}).all),
                    attendance: ((action.json || {}).employees || []).map(emp => {
                        if(emp.att){
                            let vacating = false, takingBreak = false;
                            let em = emp;
                            // (emp._id || '').toString()
                            ((action.json || {}).vacations || []).map(vac => {
                                if(vac._id.toString() === (emp._id || '').toString()){
                                    vacating = true;
                                    em = {...em, att: 4, starting_date: vac.starting_date, ending_date: vac.ending_date}
                                }
                            });
                            if(vacating){
                                return em;
                            }
                            ((action.json || {}).breaks || []).map(brk => {
                                if(brk._id.toString() === (emp._id || '').toString()){
                                    takingBreak = true;
                                    em = {...em, att: 5, starting_date: brk.starting_date, ending_date: brk.ending_date, reason: brk.reason}
                                }
                            });
                            if(takingBreak){
                                return em;
                            }
                        }
                        return emp;
                    })
                };
            }else{
                return {
                    ...state,
                    status: 0
                };
            }
        case getEmployeeWorkplans.REQUEST: 
            return {
                ...state,
                gettingWorkplan: true
            }
        case getEmployeeWorkplans.RESPONSE:
            if((action.json || {}).success){
                if((action.json || {}).emp){
                    return {
                        ...state,
                        gettingWorkplan: false,
                        workplans: ((action.json || {}).workplans || [])
                    }
                }else{
                    let workplans = [];
                    (Object.values((action.json || {}).workplans || {}) || []).map(workplan => {
                        let temp = {date: (workplan[0] || {}).year_month, allWorkplans: ((workplan || []).length || 0), approved: 0, decline: 0, checking: 0, idle: 0, allJobs: 0, approvedJobs: 0};
                        (workplan || []).map(singleWorkplan => {
                            temp[(singleWorkplan || {}).status]++;
                            temp.allJobs += ((singleWorkplan.jobs || {}).all || 0);
                            temp.approvedJobs += ((singleWorkplan.jobs || {}).approved || 0);
                        });
                        workplans.push(temp);
                    });
                    (workplans || []).sort((a, b) => {
                        let date1 = new Date(a.date);
                        let date2 = new Date(b.date);
                        if(isValidDate(date1) && isValidDate(date2)){
                            return date2 - date1;
                        }else{
                            return (a.approved || 0) - (b.approved || 0);
                        }
                    });
                    return {
                        ...state,
                        gettingWorkplan: false,
                        workplans: (workplans || [])
                    }
                }
            }else{
                return {
                    ...state,
                    gettingWorkplan: false
                }
            }
        default:
            return state;
    }
};