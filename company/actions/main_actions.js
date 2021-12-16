import * as constants from "../actionTypes";
import * as networkActions from './networkActions';

export function getAllSubTags() {
    let url = `/api/company/get/subtags`
    return networkActions.requestGet(constants.getAllSubTags, url)
}
export function getSubTagsWithParent() {
    let url = `/api/company/get/tags/subtag/parent`;
    return networkActions.requestGet(constants.getSubTagsWithParent, url);
}
export function submitReference(data) {
    let url = `/api/company/submit/reference`;
    return networkActions.requestPost(constants.submitReference, url, data);
}