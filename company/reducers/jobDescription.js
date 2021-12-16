import {
    getJobDescriptions,
    createJobDescriptions,
    deleteJobDescriptions
} from "../actionTypes";
import config from "../config";
import moment from "moment";
const initialState = {
    gettingJobDescriptions: false,
    jobDescriptions: []
};

export default(state = initialState, action) => {
    switch (action.type) {
        case getJobDescriptions.REQUEST:
            return {
                ...state,
                gettingJobDescriptions: true
            }
        case getJobDescriptions.RESPONSE:
            return {
                ...state,
                gettingJobDescriptions: false,
                jobDescriptions: ((action.json || {}).jobDescriptions)
            }
        case createJobDescriptions.REQUEST:
            return {
                ...state,
                gettingJobDescriptions: true
            }
        case createJobDescriptions.RESPONSE:
            if ((action.json || {}).success) {
                if ((action.json || {})._id && (action.json || {})._id !== '') {
                    return {
                        ...state,
                        gettingJobDescriptions: false,
                        jobDescriptions: (state.jobDescriptions || []).map(description => {
                            if ((description._id || 'as').toString() !== ((action.json || {})._id || '').toString()) {
                                return description;
                            }
                            return {
                                ...(action.json || {}).jobDescription
                            }
                        })
                    }
                } else {
                    return {
                        ...state,
                        gettingJobDescriptions: false,
                        jobDescriptions: [...state.jobDescriptions, ((action.json || {}).jobDescription)]
                    }
                }
            } else {
                return {
                    ...state,
                    gettingJobDescriptions: false
                };
            }
        case deleteJobDescriptions.REQUEST:
            return {
                ...state,
                gettingJobDescriptions: true
            }
        case deleteJobDescriptions.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    gettingJobDescriptions: false,
                    jobDescriptions: (state.jobDescriptions || []).filter(description => (description._id || 'as').toString() !== ((action.json || {})._id || '').toString())
                }
            }else{
                return {
                    ...state,
                    gettingJobDescriptions: false
                }
            }
        default:
            return state;
    }
};