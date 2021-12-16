import * as constants from "../actionTypes";
import * as networkActions from "./networkActions";

export function getProduct(data) {
	let url = `/api/company/getProduct`;
	return networkActions.requestGet(constants.getProduct, url, data);
}
// ** Product
export function submitProduct(data) {
	let url = `/api/company/submitProduct`;
	return networkActions.requestPost(constants.submitProduct, url, data);
}
export function deleteProduct(data) {
	let url = `/api/company/deleteProduct`;
	return networkActions.requestPost(constants.deleteProduct, url, data);
}

// ** sub Product
export function submitSubProduct(data) {
	let url = `/api/company/submitSubProduct`;
	return networkActions.requestPost(constants.submitSubProduct, url, data);
}
export function deleteSubProduct(data) {
	let url = `/api/company/deleteSubProduct`;
	return networkActions.requestPost(constants.deleteSubProduct, url, data);
}
