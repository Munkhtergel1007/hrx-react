import {
    getWarehouses,
    getWarehouseSingle,
    submitWarehouse,
    deleteWarehouse,
    toggleWarehouseModal,
    getWarehouseSingleProducts,
    getSoldSubProduct,
    sellSubProduct,
    giveSubProduct,
    getSubAssets,
    getRequestSubProduct,
    giveSubProductOffer,
    getWarehouseSells,
    getEmployeeStandard,
    getInteractionSubProduct,
    setInteractionSubProduct,
    toggleDetailsModal,
    toggleAllDetailsModal,
    setCurrentProduct,
    getDetails,
    getAllDetails,
    getWarehouseSales,
    getCategory
} from "../actionTypes";
import config from "../config";
const initialState = {
    warehouses: [],
    warehouse: {},
    fetchingWarehouses: false,
    fetchingWarehouse: false,
    submittingWarehouse: false,
    submitSuccess: false,
    deletingWarehouse: false,
    deleteSuccess: false,
    modal: false,
    subProducts: [],
    loadingSupplies: false,
    selling: false,
    loadingSoldProducts: false,
    soldProducts: [],
    giving: false,

    loadingAssets: false,
    assets: [],

    loadingRequestProducts: false,
    requestProducts: [],

    loadingEmployees: false,
    employees: [],

    loadingInteractionSubProducts: false,
    interactionSubProducts: [],
    submittingInteractionSubProduct: false,

    modalDetails: false,
    modalAllDetails: false,
    currentProduct: {},
    allDetailsModal: false,
    allDetails: {},
    details: {},
    gettingDetails: false,
    gettingAllDetails: false,
    warehouseSales: [],
    gettingWarehouseSales: false,
    
    loadingCategories: false,
    categories: [],
};

export default (state = initialState, action) => {
    const { success, data } = action.json || {};
    switch (action.type) {
        case getWarehouses.REQUEST:
            return {
                ...state,
                fetchingWarehouses: true
            };
        case getWarehouses.RESPONSE:
            if (action.json.success) {
                return {
                    ...state,
                    fetchingWarehouses: false,
                    warehouses: data
                };
            } else {
                return {
                    ...state,
                    fetchingWarehouses: false
                };
            }
        case getWarehouseSingle.REQUEST:
            return {
                ...state,
                fetchingWarehouse: true
            };
        case getWarehouseSingle.RESPONSE:
            if (action.json.success) {
                return {
                    ...state,
                    fetchingWarehouse: false,
                    warehouse: { ...action.json.data }
                };
            } else {
                return {
                    ...state,
                    fetchingWarehouse: false
                };
            }
        case submitWarehouse.REQUEST:
            return {
                ...state,
                submittingWarehouse: true
            };
        case submitWarehouse.RESPONSE:
            if (action.json.success) {
                if (action.json._id) {
                    return {
                        ...state,
                        submittingWarehouse: false,
                        warehouses: (state.warehouses || []).map((wh) => {
                            if (
                                (wh._id || "as").toString() !==
                                (action.json._id || "").toString()
                            )
                                return wh;
                            else {
                                return {
                                    ...(wh || {}),
                                    ...(action.json.data || {}),
                                    employees:
                                        (action.json.employees || []).map(
                                            (employee) => {
                                                return {
                                                    emp: employee,
                                                    user: employee.user
                                                };
                                            }
                                        ) || []
                                };
                            }
                        })
                    };
                } else {
                    return {
                        ...state,
                        submittingWarehouse: false,
                        warehouses: [
                            ...state.warehouses,
                            {
                                ...data,
                                employees: (action.json.employees || []).map(
                                    (employee) => {
                                        return {
                                            emp: employee,
                                            user: employee.user
                                        };
                                    }
                                )
                            }
                        ]
                    };
                }
            } else {
                return {
                    ...state,
                    submittingWarehouse: false,
                    modal: false
                };
            }
        case deleteWarehouse.REQUEST:
            return {
                ...state,
                deletingWarehouse: true,
                warehouses: (state.warehouses || []).map((wh) => {
                    if (
                        (wh._id || "as").toString() !==
                        (action.json.wh || "").toString()
                    )
                        return wh;
                    else
                        return {
                            ...(wh || {}),
                            loading: true
                        };
                })
            };
        case deleteWarehouse.RESPONSE:
            if (action.json.success) {
                return {
                    ...state,
                    deletingWarehouse: false,
                    warehouses: [
                        ...state.warehouses.filter(
                            (wh) =>
                                (wh._id || "as").toString() !==
                                (action.json._id || "").toString()
                        )
                    ]
                };
            } else {
                return {
                    ...state,
                    deletingWarehouse: false,
                    warehouses: (state.warehouses || []).map((wh) => {
                        if (
                            (wh._id || "as").toString() !==
                            (action.json._id || "").toString()
                        )
                            return wh;
                        else
                            return {
                                ...(wh || {}),
                                loading: false
                            };
                    })
                };
            }
        case toggleWarehouseModal.REQUEST:
            return {
                ...state,
                modal: data
            };
        case getWarehouseSingleProducts.REQUEST:
            return {
                ...state,
                loadingSupplies: true
            };
        case getWarehouseSingleProducts.RESPONSE:
            if ((action.json || {}).success) {
                let subProds = (action.json || {}).subProducts || [];
                subProds = (subProds || []).map((subProd) => {
                    let quantity = 0;
                    ((action.json || {}).supplies || []).map((supply) => {
                        if (
                            (subProd._id || "as").toString() ===
                            (supply.subProduct || "").toString()
                        ) {
                            quantity += supply.quantity;
                        }
                    });
                    return {
                        ...subProd,
                        quantity: quantity
                    };
                });
                return {
                    ...state,
                    loadingSupplies: false,
                    supplies: (action.json || {}).supplies || [],
                    subProducts: subProds
                };
            } else {
                return {
                    ...state,
                    loadingSupplies: false
                };
            }
        case getSoldSubProduct.REQUEST:
            return {
                ...state,
                gettingSoldSubProducts: true
            };
        case getSoldSubProduct.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    soldProducts: (action.json || {}).data || [],
                    gettingSoldSubProducts: false
                };
            } else {
                return {
                    ...state,
                    gettingSoldSubProducts: false
                };
            }
        case sellSubProduct.REQUEST:
            return {
                ...state,
                selling: true
            };
        case sellSubProduct.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    selling: false,
                    subProducts: (state.subProducts || []).map((subProd) => {
                        if (
                            (subProd._id || "as").toString() !==
                            (action.json?.subProduct || "").toString()
                        ) {
                            return subProd;
                        } else {
                            return {
                                ...(subProd || {}),
                                quantity:
                                    subProd.quantity -
                                    parseInt(action.json.quantity || 0)
                            };
                        }
                    }),
                    soldProducts: [
                        ...(action.json.savedSell || []),
                        ...(state.soldProducts || [])
                    ]
                };
            } else {
                return {
                    ...state,
                    selling: false
                };
            }
        case giveSubProduct.REQUEST:
            return {
                ...state,
                giving: true
            };
        case giveSubProduct.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    giving: false,
                    subProducts: (state.subProducts || []).map((subProd) => {
                        if (
                            (subProd._id || "as").toString() !==
                            (action.json?.subProduct || "").toString()
                        ) {
                            return subProd;
                        } else {
                            return {
                                ...(subProd || {}),
                                quantity:
                                    subProd.quantity -
                                    parseInt(action.json.quantity || 0)
                            };
                        }
                    })
                };
            } else {
                return {
                    ...state,
                    giving: false
                };
            }
        case getSubAssets.REQUEST:
            return {
                ...state,
                loadingAssets: true
            };
        case getSubAssets.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    loadingAssets: false,
                    assets: (action.json || {}).assets || []
                };
            } else {
                return {
                    ...state,
                    loadingAssets: false
                };
            }
        case getRequestSubProduct.REQUEST:
            return {
                ...state,
                loadingRequestProducts: true
            };
        case getRequestSubProduct.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    loadingRequestProducts: false,
                    requestProducts: (action.json || {}).data || []
                };
            } else {
                return {
                    ...state,
                    loadingRequestProducts: false
                };
            }
        case giveSubProductOffer.REQUEST:
            return {
                ...state,
                requesting: true
            };
        case giveSubProductOffer.RESPONSE:
            if ((action.json || {}).success) {
                if (action.json.status === "active") {
                    return {
                        ...state,
                        requesting: false,
                        requestProducts: (state.requestProducts || []).map(
                            (prod) => {
                                if (
                                    (
                                        (action.json || {})._id || "as"
                                    ).toString() !== (prod._id || "").toString()
                                ) {
                                    return prod;
                                }
                                return {
                                    ...prod,
                                    status: (action.json || {}).status
                                };
                            }
                        ),
                        subProducts: (state.subProducts || []).map((prod) => {
                            if (
                                (
                                    (action.json || {}).subProd || "as"
                                ).toString() !== (prod._id || "").toString()
                            ) {
                                return prod;
                            }
                            return {
                                ...prod,
                                quantity:
                                    prod.quantity + (action.json || {}).quantity
                            };
                        })
                    };
                } else {
                    return {
                        ...state,
                        requesting: false,
                        requestProducts: (state.requestProducts || []).map(
                            (prod) => {
                                if (
                                    (
                                        (action.json || {})._id || "as"
                                    ).toString() !== (prod._id || "").toString()
                                ) {
                                    return prod;
                                }
                                return {
                                    ...prod,
                                    status: (action.json || {}).status
                                };
                            }
                        )
                    };
                }
            } else {
                return {
                    ...state,
                    requesting: false
                };
            }
        case getWarehouseSells.REQUEST:
            return {
                ...state,
                gettingsSells: true
            };
        case getWarehouseSells.RESPONSE:
            if ((action.json || {}).success) {
                let currentSells = { ...state.sells };
                currentSells[action.json.warehouseID] = action.json.data;
                return {
                    ...state,
                    sells: currentSells,
                    gettingSells: false
                };
            }
        case getEmployeeStandard.REQUEST:
            return {
                ...state,
                loadingEmployees: true
            };
        case getEmployeeStandard.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    loadingEmployees: false,
                    employees: (action.json || {}).employees
                };
            } else {
                return {
                    ...state,
                    loadingEmployees: false
                };
            }
        case getInteractionSubProduct.REQUEST:
            return {
                ...state,
                loadingInteractionSubProducts: true
            };
        case getInteractionSubProduct.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    interactionSubProducts: (action.json || {}).data || [],
                    loadingInteractionSubProducts: false
                };
            } else {
                return {
                    ...state,
                    loadingInteractionSubProducts: false
                };
            }
        case setInteractionSubProduct.REQUEST:
            return {
                ...state,
                submittingInteractionSubProduct: true
            };
        case setInteractionSubProduct.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    interactionSubProducts: (
                        state.interactionSubProducts || []
                    ).map((prod) => {
                        if (
                            (prod._id || "as").toString() !==
                            (action.json || {})._id
                        ) {
                            return prod;
                        } else {
                            return {
                                ...prod,
                                priceSold: (action.json || {}).priceSold,
                                priceGot: (action.json || {}).priceGot,
                                paidType: (action.json || {}).paidType,
                                status: "active"
                            };
                        }
                    }),
                    submittingInteractionSubProduct: false
                };
            } else {
                return {
                    ...state,
                    submittingInteractionSubProduct: false
                };
            }
        case toggleDetailsModal.REQUEST:
            return {
                ...state,
                modalDetails: action.json.data
            };
        case toggleAllDetailsModal.REQUEST:
            return {
                ...state,
                modalAllDetails: action.json.data
            };
        case setCurrentProduct.REQUEST:
            return {
                ...state,
                currentProduct: action.json.data
            };
        case getDetails.REQUEST:
            return {
                ...state,
                gettingDetails: true,
                details: []
            };
        case getDetails.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    gettingDetails: false,
                    details: (action.json || {}).data || []
                };
            } else {
                return {
                    ...state,
                    gettingDetails: false
                };
            }
        case getAllDetails.REQUEST:
            return {
                ...state,
                gettingAllDetails: true
            };
        case getAllDetails.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    gettingAllDetails: false,
                    allDetails: (action.json || {}).data || []
                };
            } else {
                return {
                    ...state,
                    gettingAllDetails: false
                };
            }
        case getWarehouseSales.REQUEST:
            return {
                ...state,
                gettingSales: true
            };
        case getWarehouseSales.RESPONSE:
            if ((action.json || {}).success) {
                return {
                    ...state,
                    gettingSales: false,
                    warehouseSales: (action.json || {}).data || []
                };
            } else {
                return {
                    ...state,
                    gettingSales: false
                };
            }
        case getCategory.REQUEST:
            return {
                ...state,
                loadingCategories: true
            }
        case getCategory.RESPONSE:
            if((action.json || {}).success){
                return {
                    ...state,
                    loadingCategories: false,
                    categories: ((action.json || {}).categories || [])
                }
            }else{
                return {
                    ...state,
                    loadingCategories: false
                }
            }
        default:
            return {
                ...state
            };
    }
};
