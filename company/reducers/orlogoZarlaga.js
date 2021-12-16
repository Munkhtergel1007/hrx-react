import {
  getOrlogoZarlaga,
  getEmployeeStandard,
  unMountOrlogoZarlaga,
  submitOrlogoZarlaga,
  deleteOrlogoZarlaga,
  publishOrlogoZarlaga
} from "../actionTypes";
import moment from "moment";
const initialState = {
  status: true,
  Workplan_tags:[],
  orlogoZarlagas:[],
  companyOrlogo:[],
  all:0,
  user: null,
  employees: [],
  subCompanies: [],
  gettingEmployees: false,
  publishing: '',
  starting_date: null,
  ending_date: null,
    orlogo: 0,
    zarlaga: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case unMountOrlogoZarlaga.REQUEST:
      return {
        ...state,
        status: true,
        Workplan_tags:[],
        orlogoZarlagas:[],
        companyOrlogo:[],
        all:0,
        user: null,
        employees: [],
        subCompanies: [],
        gettingEmployees: false,
        publishing: '',
        starting_date: null,
        ending_date: null,
          orlogo: 0,
          zarlaga: 0,
      };
    case getOrlogoZarlaga.REQUEST:
      return {
        ...state,
        status: true,
        user: null
      };
      case getOrlogoZarlaga.RESPONSE:
    let ed = (action.json.orlogoZarlagas || []);
    // let ed = (action.json.orlogoZarlagas || []).sort(compare);
      if(action.json.success){
        return {
          ...state,
          status: false,
          orlogoZarlagas:ed || [],
          user: ((action.json || {}).user),
          all:action.json.all || 0,
          Workplan_tags:action.json.Workplan_tags || [],
          subCompanies:action.json.subCompanies || [],
          ending_date:action.json.ending_date || [],
          companyOrlogo:action.json.companyOrlogo || [],
          starting_date:action.json.starting_date || [],
            employees: [],
            orlogo:action.json.orlogo || 0,
            zarlaga:action.json.zarlaga || 0,
        };
      } else{
        return {
          ...state,
            status: false,
        };
      }
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
          employees: ((action.json || {}).employees)
        }
      }else{
        return {
          ...state,
          gettingEmployees: false
        }
      }
    case submitOrlogoZarlaga.REQUEST:
      return {
        ...state,
        status: true
      }
    case submitOrlogoZarlaga.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          orlogoZarlagas: ((action.json || {})._id) ?
            (state.orlogoZarlagas || []).map(orlogoZarlaga => {
              if((orlogoZarlaga._id || 'as').toString() !== ((action.json || {})._id || '').toString()){
                return orlogoZarlaga;
              }
              return {
                ...orlogoZarlaga,
                ...((action.json || {}).orlogoZarlaga)
              }
            })
            :
            [((action.json || {}).orlogoZarlaga), ...state.orlogoZarlagas]
          ,
          all: ((action.json || {})._id) ? state.all : state.all+1,
          status: false,
        }
      }else{
        return {
          ...state,
          status: false
        }
      }
    case deleteOrlogoZarlaga.REQUEST:
      return {
        ...state,
        publishing: ((action.json || {})._id)
      }
    case deleteOrlogoZarlaga.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          publishing: '',
          all: state.all - 1,
          orlogoZarlagas: (state.orlogoZarlagas || []).filter(orlogoZarlaga => (orlogoZarlaga._id || 'as').toString() !== ((action.json || {})._id || '').toString())
        }
      }else{
        return {
          ...state,
          publishing: '',
        }
      }
    case publishOrlogoZarlaga.REQUEST:
      return {
        ...state,
        publishing: ((action.json || {})._id)
      }
    case publishOrlogoZarlaga.RESPONSE:
      if((action.json || {}).success){
        return {
          ...state,
          publishing: '',
          orlogoZarlagas: (state.orlogoZarlagas || []).map(orlogoZarlaga => {
            if((orlogoZarlaga._id || 'as').toString() !== ((action.json || {})._id || '').toString()){
              return orlogoZarlaga;
            }
            return {
              ...orlogoZarlaga,
              ...((action.json || {}).orlogoZarlaga)
            }
          })
        }
      }else{
        return {
          ...state,
          publishing: ''
        }
      }
    default:
      return state;
  }
};
function compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const groupA = ((a.company || {}).name || '').toUpperCase();
    const groupB = ((b.company || {}).name || '').toUpperCase();

    let comparison = 0;
    if (groupA > groupB) {
        comparison = +1;
    } else if (groupA < groupB) {
        comparison = -1;
    }
    return comparison;
}
