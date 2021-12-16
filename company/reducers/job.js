import {
    getAllSubTags,
    getEmpJobs,
    submitJob,
    deleteJob
} from '../actionTypes'
const initialState = {
    gettingSubs: false,
    gettingEmpJobs: false,
    submittingJob: false,
    jobs: [],
    jobworkers: [],
    subtags: []
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
        case getEmpJobs.REQUEST:
            return {
                ...state,
                gettingEmpJobs: true
            }
        case getEmpJobs.RESPONSE:
            return {
                ...state,
                jobs: action.json.success ? action.json.jobs : [],
                jobworkers: action.json.success ? action.json.jobworkers : [],
                gettingEmpJobs: false
            }
        case submitJob.REQUEST:
            return {
                ...state,
                submittingJob: true
            }
        case submitJob.RESPONSE:
            return {
                ...state,
                jobs: action.json.success ?
                    action.json.id ?
                        state.jobs.map(c => {
                            if(c._id === action.json.id){
                                c = action.json.job
                            }
                            return c
                        })
                    : [action.json.job, ...state.jobs]
                : state.jobs,
                submittingJob: false
            }
        case deleteJob.REQUEST:
            return {
                ...state,
                submittingJob: true
            }
        case deleteJob.RESPONSE:
            return {
                ...state,
                jobs: action.json.success ? state.jobs.filter(c => c._id !== action.json.id) : state.jobs,
                submittingJob: false
            }
        default:
            return state
    }
}