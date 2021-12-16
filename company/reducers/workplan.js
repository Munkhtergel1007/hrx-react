import {
    getAllSubTags,
    getEmpWorkPlans,
    createWorkPlan,
    deleteWorkPlan,
    deleteWorkPlanJob,
    createWorkPlanJob,
    submitWorkPlan,
    getAllWorkPlans,
    respondToWorkPlan,
    submitWorkplanJob,
    appraiseJob,
    declineJob
} from '../actionTypes'

const initialState = {
    workplans: [],
    subtags: [],
    submittingWorkplan: false,
    gettingSubs: false,
    all: 0
}

export default (state = initialState, action) => {
    switch(action.type){
        case getAllSubTags.REQUEST:
            return {
                ...state,
                gettingSubs: true
            }
        case getAllSubTags.RESPONSE:
            return {
                ...state,
                subtags: action.json.success ? action.json.subtags : state.subtags,
                gettingSubs: false
            }
        case getEmpWorkPlans.REQUEST:
            return {
                ...state
            }
        case getEmpWorkPlans.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ? action.json.workplans : state.workplans
            }
        case createWorkPlan.REQUEST:
            return {
                ...state,
                submittingWorkplan: true,
            }
        case createWorkPlan.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ? [{...action.json.workplan, jobs: []}, ...state.workplans] : state.workplans,
                submittingWorkplan: false,
            }
        case deleteWorkPlan.REQUEST:
            return {
                ...state,
            }
        case deleteWorkPlan.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.filter(c => c._id !== action.json.id)
                : state.workplans
            }
        case deleteWorkPlanJob.REQUEST:
            return {
                ...state
            }
        case deleteWorkPlanJob.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.map(aa => {
                        if(aa._id !== action.json.work_plan){
                            return aa
                        } else {
                            let bb = aa.jobs.filter(c => c._id !== action.json.id)
                            aa.jobs = bb
                            return aa
                        }
                    })
                : state.workplans
            }
        case createWorkPlanJob.REQUEST:
            return {
                ...state
            }
        case createWorkPlanJob.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    action.json.id ?
                        state.workplans.map(a => {
                            if(a._id !== action.json.work_plan){
                                return a
                            } else {
                                a.jobs = a.jobs.map(b => {
                                    if(b._id !== action.json.id){
                                        return b
                                    } else {
                                        return action.json.job
                                    }
                                })
                                return a
                            }
                        })
                    : state.workplans.map(a => {
                        if(a._id !== action.json.work_plan){
                            return a
                        } else {
                            a.jobs = [action.json.job, ...a.jobs]
                            return a
                        }
                    })
                : state.workplans
            }
        case submitWorkPlan.REQUEST:
            return {
                ...state
            }
        case submitWorkPlan.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.map(c => {
                        if(c._id !== action.json.id){
                            return c
                        } else {
                            c.status = action.json.status
                            return c
                        }
                    })
                : state.workplans
            }
        case getAllWorkPlans.REQUEST:
            return {
                ...state
            }
        case getAllWorkPlans.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ? action.json.workplans : state.workplans,
                all: action.json.success ? action.json.all : state.all,
            }
        case respondToWorkPlan.REQUEST:
            return {
                ...state
            }
        case respondToWorkPlan.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.map(c => {
                        if(c._id !== action.json.workplan._id){
                            return c
                        } else {
                            c.status = action.json.workplan.status
                            c.comment = action.json.workplan.comment
                            c.approved_by = action.json.workplan.approved_by
                            return c
                        }
                    })
                : state.workplans
            }
        case submitWorkplanJob.REQUEST:
            return {
                ...state
            }
        case submitWorkplanJob.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.map(plan => {
                        if(plan._id !== action.json.work_plan){
                            return plan
                        } else {
                            plan.jobs = plan.jobs.map(job => {
                                if(job._id !== action.json.job._id){
                                    return job
                                } else {
                                    job.status = action.json.job.status
                                    return job
                                }
                            })
                            return plan
                        }
                    })
                : state.workplans
            }
        case appraiseJob.REQUEST:
            return {
                ...state
            }
        case appraiseJob.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.map(plan => {
                        if(plan._id !== action.json.work_plan){
                            return plan
                        } else {
                            plan.jobs = plan.jobs.map(job => {
                                if(job._id !== action.json.job._id){
                                    return job
                                } else {
                                    job.status = action.json.job.status
                                    job.approved_by = action.json.job.approved_by
                                    job.comment = action.json.job.comment
                                    job.completion = action.json.job.completion
                                    return job
                                }
                            })
                            return plan
                        }
                    })
                : state.workplans
            }
        case declineJob.REQUEST:
            return {
                ...state
            }
        case declineJob.RESPONSE:
            return {
                ...state,
                workplans: action.json.success ?
                    state.workplans.map(plan => {
                        if(plan._id !== action.json.work_plan){
                            return plan
                        } else {
                            plan.jobs = plan.jobs.map(job => {
                                if(job._id !== action.json.job._id){
                                    return job
                                } else {
                                    job.status = action.json.job.status
                                    job.comment = action.json.job.comment
                                    return job
                                }
                            })
                            return plan
                        }
                    })
                : state.workplans
            }
        default:
            return state
    }
}