import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function setPageConf(data = {}){
    return {
        type: constants.setPageConfPro.REQUEST,
        json: data
    }
}