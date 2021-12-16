import * as constants from "../actionTypes";
import * as networkActions from "./networkActions";

export function getWarehouses(data) {
    let url = `/api/company/getWarehouses`;
    return networkActions.requestGet(constants.getWarehouses, url, data);
}
export function getWarehouseSells(data) {
    let url = `/api/company/getWarehouseSells`;
    return networkActions.requestGet(constants.getWarehouseSells, url, data);
}
export function getWarehouseSingle(data) {
    let url = `/api/company/getWarehouseSingle`;
    return networkActions.requestGet(constants.getWarehouseSingle, url, data);
}
export function getWarehouseSales(data) {
    let url = `/api/company/getWarehouseSales`;
    return networkActions.requestGet(constants.getWarehouseSales, url, data);
}
export function getWarehouseSingleProducts(data) {
    let url = `/api/company/getWarehouseSingleProducts`;
    return networkActions.requestGet(
        constants.getWarehouseSingleProducts,
        url,
        data
    );
}
export function submitWarehouse(data) {
    let url = `/api/company/submitWarehouse`;
    return networkActions.requestPost(constants.submitWarehouse, url, data);
}
export function deleteWarehouse(data) {
    let url = `/api/company/deleteWarehouse`;
    return networkActions.requestPost(constants.deleteWarehouse, url, data);
}
export function toggleWarehouseModal(data) {
    return {
        type: constants.toggleWarehouseModal.REQUEST,
        json: data
    };
}
export function sellSubProduct(data) {
    let url = `/api/company/sellSubProduct`;
    return networkActions.requestPost(constants.sellSubProduct, url, data);
}
export function getSoldSubProduct(data) {
    let url = `/api/company/getSoldSubProduct`;
    return networkActions.requestGet(constants.getSoldSubProduct, url, data);
}
export function getRequestSubProduct(data) {
    let url = `/api/company/getRequestSubProduct`;
    return networkActions.requestGet(constants.getRequestSubProduct, url, data);
}
export function getInteractionSubProduct(data) {
    let url = `/api/company/getInteractionSubProduct`;
    return networkActions.requestGet(
        constants.getInteractionSubProduct,
        url,
        data
    );
}
export function setInteractionSubProduct(data) {
    let url = `/api/company/setInteractionSubProduct`;
    return networkActions.requestPost(
        constants.setInteractionSubProduct,
        url,
        data
    );
}
export function giveSubProduct(data) {
    let url = `/api/company/giveSubProductRequest`;
    return networkActions.requestPost(constants.giveSubProduct, url, data);
}
export function giveSubProductOffer(data) {
    let url = `/api/company/giveSubProductOffer`;
    return networkActions.requestPost(constants.giveSubProductOffer, url, data);
}
export function getSubAssets(data) {
    let url = `/api/company/getSubAssets`;
    return networkActions.requestGet(constants.getSubAssets, url, data);
}
export function getDetails(data) {
    let url = `/api/company/getDetails`;
    return networkActions.requestGet(constants.getDetails, url, data);
}
export function getAllDetails(data) {
    let url = `/api/company/getAllDetails`;
    return networkActions.requestGet(constants.getAllDetails, url, data);
}
// export function getWarehouseDetails(data) {
//     let url = `/api/company/getWarehouseDetails`;
//     return networkActions.requestGet(constants.getWarehouseDetails, url, data);
// }
export function toggleDetailsModal(data) {
    return {
        type: constants.toggleDetailsModal.REQUEST,
        json: data
    };
}
export function toggleAllDetailsModal(data) {
    return {
        type: constants.toggleAllDetailsModal.REQUEST,
        json: data
    };
}
export function setCurrentProduct(data) {
    return {
        type: constants.setCurrentProduct.REQUEST,
        json: data
    };
}
