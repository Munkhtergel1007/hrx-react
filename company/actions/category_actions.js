import * as constants from "../actionTypes";
import * as networkActions from './networkActions';


export function getCategory(data, domain) {
    let url = `/api/company/getCategory`;
    return networkActions.requestGet(constants.getCategory,url, data);
}
// ** category
export function submitCategory(data, domain) {
    let url = `/api/company/submitCategory`;
    return networkActions.requestPost(constants.submitCategory,url, data);
}
export function openCategoryModal(data){
    return {
        type: constants.openCategoryModal.REQUEST,
        json: data
    }
}
export function closeCategoryModal(){
    return {
        type: constants.closeCategoryModal.REQUEST,
    }
}
export function categoryChangeHandler(data){
    return {
        type: constants.categoryChangeHandler.REQUEST,
        json: data
    }
}
export function deleteCategory(data, domain) {
    let url = `/api/company/deleteCategory`;
    return networkActions.requestPost(constants.deleteCategory,url, data);
}

// ** sub category
export function submitSubCategory(data, domain) {
    let url = `/api/company/submitSubCategory`;
    return networkActions.requestPost(constants.submitSubCategory,url, data);
}
export function openSubCategoryModal(data){
    return {
        type: constants.openSubCategoryModal.REQUEST,
        json: data
    }
}
export function closeSubCategoryModal(){
    return {
        type: constants.closeSubCategoryModal.REQUEST,
    }
}
export function categoryChangeHandlerSub(data){
    return {
        type: constants.categoryChangeHandlerSub.REQUEST,
        json: data
    }
}
export function deleteSubCategory(data, domain) {
    let url = `/api/company/deleteSubCategory`;
    return networkActions.requestPost(constants.deleteSubCategory,url, data);
}

// ** unmount
export function unmountShopCategories(){
    return {
        type: constants.unmountShopCategories.REQUEST,
    }
}