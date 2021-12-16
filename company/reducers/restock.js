import {
	submitRestock,
	updateRestock,
	toggleRestockModal,
	toggleRestockSingleModal,
	getRestocks,
	getRestockSingle,
	deleteRestock,
	addItem,
	removeItem,
	distributeRestock
} from "../actionTypes";
import config from "../config";
const emit = config.get("emitter").emit;
const initialState = {
	restocks: [],
	restock: {},
	submittingRestock: false,
	submitSuccess: false,
	deletingRestock: false,
	deleteSuccess: false,
	fetchingRestocks: false,
	fetchingRestockSingle: false,
	modal: false,
	modalSingle: false,
	supplies: [],
	distributingRestock: false,
	distributeSuccess: true
};

export default (state = initialState, action) => {
	const { success, msg, data } = action.json || {};
	switch (action.type) {
		case getRestocks.REQUEST:
			return {
				...state,
				fetchingRestocks: true
			};
		case getRestocks.RESPONSE:
			if (success === true) {
				return {
					...state,
					fetchingRestocks: false,
					restocks: data
				};
			} else {
				emit("warning", msg);
				return {
					...state,
					fetchingRestocks: false,
					modal: false
				};
			}
		case getRestockSingle.REQUEST:
			return {
				...state,
				fetchingRestockSingle: true
			};
		case getRestockSingle.RESPONSE:
			if (success === true) {
				return {
					...state,
					fetchingRestockSingle: false,
					restock: data
				};
			} else {
				// emit("warning", msg);
				return {
					...state,
					fetchingRestockSingle: false
				};
			}
		case submitRestock.REQUEST:
			return {
				...state,
				submittingRestock: true
			};
		case submitRestock.RESPONSE:
			if (success) {
				return {
					...state,
					submittingRestock: false,
					restock: data,
					restocks: [...state.restocks, data],
					modal: false,
					supplies: null
				};
			} else {
				emit("warning", msg);
				return {
					...state,
					submittingRestock: false,
					modal: false
				};
			}
		case distributeRestock.REQUEST:
			return {
				...state,
				distributingRestock: true
			};
		case distributeRestock.RESPONSE:
			if (success) {
				// emit("success", msg || "");
				// console.log('emit', emit)
				return {
					...state,
					distributingRestock: false,
					distributeRestock: true,
					restock: data,
					modalSingle: false
				};
			} else {
				// emit("warning", msg || "");
				return {
					...state,
					distributingRestock: false,
					modalSingle: false
				};
			}
		case updateRestock.REQUEST:
			return {
				...state,
				updatingRestock: true
			};
		case updateRestock.RESPONSE:
			if (success) {
				return {
					...state,
					updatingRestock: false,
					restock: data
				};
			} else {
				emit("warning", msg);
				return {
					...state,
					updatingRestock: false,
					modal: false
				};
			}
		case toggleRestockModal.REQUEST:
			return {
				...state,
				modal: data
			};
		case toggleRestockSingleModal.REQUEST:
			return {
				...state,
				modalSingle: data
			};
		case addItem.REQUEST:
			return {
				...state,
				supplies: [...(state.supplies || []), data]
			};
		case removeItem.REQUEST:
			return {
				...state,
				supplies: state.supplies.filter((e) => e.name !== data)
			};
		default:
			return {
				...state
			};
	}
};
