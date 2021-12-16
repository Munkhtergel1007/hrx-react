import * as constants from "../actionTypes";
import * as networkActions from "./networkActions";

export function submitRestock(data) {
	let url = `/api/company/submitOrder`;
	return networkActions.requestPost(constants.submitRestock, url, data);
}
export function distributeRestock(data) {
	let url = `/api/company/distributeRestock`;
	return networkActions.requestPost(constants.distributeRestock, url, data);
}
export function updateRestock(data) {
	let url = `/api/company/updateOrder`;
	return networkActions.requestPost(constants.updateRestock, url, data);
}
export function getRestocks(data) {
	let url = `/api/company/getOrders`;
	return networkActions.requestGet(constants.getRestocks, url, data);
}
export function getRestockSingle(data) {
	let url = `/api/company/getOrderSingle`;
	return networkActions.requestGet(constants.getRestockSingle, url, data);
}
export function deleteRestock(data) {
	let url = `/api/company/deleteRestock`;
	return networkActions.requestPost(constants.deleteRestock, url, data);
}
export function toggleRestockModal(data) {
	return {
		type: constants.toggleRestockModal.REQUEST,
		json: data
	};
}
export function toggleRestockSingleModal(data) {
	return {
		type: constants.toggleRestockSingleModal.REQUEST,
		json: data
	};
}
export function addItem(data) {
	return {
		type: constants.addItem.REQUEST,
		json: data
	};
}
export function removeItem(data) {
	return {
		type: constants.removeItem.REQUEST,
		json: data
	};
}
