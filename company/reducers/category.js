import {
    getCategory,
    closeCategoryModal,
    openCategoryModal,
    categoryChangeHandler,
    submitCategory,
    submitSubCategory,
    categoryChangeHandlerSub,
    openSubCategoryModal,
    closeSubCategoryModal,
    unmountShopCategories,
    deleteCategory,
    deleteSubCategory,
} from "../actionTypes";
const initialState = {
    status: 1,
    categories:[],
    all:0,

    openModal: false,
    category:{},
    submitCategoryLoader: false,

    openSubModal: false,
    subCategory:{},
    submitSubCategoryLoader: false,
};

export default(state = initialState, action) => {
    switch (action.type) {
        case deleteSubCategory.REQUEST:
            if(action.json._id){
                return {
                    ...state,
                    categories: (state.categories || []).map(function (run) {
                        if(run._id === (action.json.catId || '')){
                            (run.child || []).map(function (c){
                                if(c._id === action.json._id){
                                    c.loading = true
                                }
                            });
                        }
                        return run;
                    })
                };
            } else {
                return {
                    ...state
                };
            }
        case deleteSubCategory.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    categories: state.categories.map(function(run) {
                        if(run._id === action.json.catId) {
                            run.child = (run.child || []).filter(c => c._id !== action.json._id);
                        }
                        return run;
                    })
                };
            } else {
                return {
                    ...state,
                    categories: (state.categories || []).map(function (run) {
                        if(run._id.toString() === (action.json.catId || '').toString()){
                            (run.child || []).map(function (c){
                                if(c._id.toString() === action.json._id.toString()){
                                    c.loading = false;
                                }
                            });
                        }
                        return run;
                    })
                };
            }
        case deleteCategory.REQUEST:
            if(action.json._id){
                return {
                    ...state,
                    categories: state.categories.map( function (run) {
                        if(run._id.toString() === action.json._id.toString()){
                            run.loading = true;
                        }
                        return run;
                    } ),
                };
            } else {
                return {
                    ...state
                };
            }
        case deleteCategory.RESPONSE:
            if(action.json.success){
                return {
                    ...state,
                    // categories: (action.json.categories || []),
                    categories: state.categories.filter(run => run._id.toString() !== action.json._id.toString()),
                    all: state.all - 1
                };
            } else {
                if(action.json._id){
                    return {
                        ...state,
                        categories: state.categories.map( function (run) {
                            if(run._id.toString() === action.json._id.toString()){
                                run.loading = false;
                            }
                            return run;
                        }),
                    };
                } else {
                    return {
                        ...state
                    };
                }
            }
        case unmountShopCategories.REQUEST:
            return {
                ...state,
                status: 1,
                categories:[],
                all:0,
                openModal: false,
                category:{},
                submitCategoryLoader: false,
                openSubModal: false,
                subCategory:{},
                submitSubCategoryLoader: false,
            };
        case submitSubCategory.REQUEST:
            return {
                ...state,
                submitSubCategoryLoader: true,
            };
        case submitSubCategory.RESPONSE:
            if(action.json.success){
                if(action.json._id){
                    return {
                        ...state,
                        submitSubCategoryLoader: false,
                        openSubModal: false,
                        categories: (state.categories || []).map(function (run) {
                            if(run._id.toString() === (action.json.data || {}).category.toString()){
                                (run.child || []).map(function (c){
                                    if(c._id.toString() === action.json._id.toString()){
                                        c.title = action.json.data.title
                                    }
                                });
                            }
                            return run;
                        })
                    };
                } else {
                    return {
                        ...state,
                        submitSubCategoryLoader: false,
                        openSubModal: false,
                        categories: state.categories.map(function (run) {
                            if(run._id === action.json.data.category){
                                if(run.child && run.child.length > 0){
                                    run.child.push(action.json.data);
                                } else {
                                    run.child = [action.json.data];
                                }
                            }
                            return run;
                        }),
                    };
                }
            } else {
                return {
                    ...state,
                    submitSubCategoryLoader: false
                };
            }
        case categoryChangeHandlerSub.REQUEST:
            return {
                ...state,
                subCategory:{
                    ...state.subCategory,
                    [action.json.name]:action.json.value
                },
            };
        case openSubCategoryModal.REQUEST:
            return {
                ...state,
                openSubModal: true,
                subCategory:(action.json || {}),
            };
        case closeSubCategoryModal.REQUEST:
            return {
                ...state,
                openSubModal: false,
                subCategory:{},
            };

        case submitCategory.REQUEST:
            return {
                ...state,
                submitCategoryLoader: true,
            };
        case submitCategory.RESPONSE:
            if(action.json.success){
                if(action.json._id){
                    return {
                        ...state,
                        submitCategoryLoader: false,
                        openModal: false,
                        categories: state.categories.map(function (run) {
                            if(run._id === action.json._id){
                                run.title =  action.json.data.title;
                                run.parent =  action.json.data.parent;
                            }
                            return run;
                        }),
                    };
                } else {
                    return {
                        ...state,
                        submitCategoryLoader: false,
                        openModal: false,
                        all: state.all + 1,
                        categories:[
                            action.json.data,
                            ...state.categories,
                        ],
                    };
                }
            } else {
                return {
                    ...state,
                    submitCategoryLoader: false
                };
            }
        case categoryChangeHandler.REQUEST:
            return {
                ...state,
                category:{
                    ...state.category,
                    [action.json.name]:action.json.value
                },
            };
        case openCategoryModal.REQUEST:
            return {
                ...state,
                openModal: true,
                category:(action.json || {}),
            };
        case closeCategoryModal.REQUEST:
            return {
                ...state,
                openModal: false,
                category:{},
            };
        case getCategory.REQUEST:
            return {
                ...state,
                status: 1
            };
        case getCategory.RESPONSE:
            return {
                ...state,
                status: 0,
                categories: (action.json.categories || []),
                allCategories: (action.json.allCategories || []),
                categoryRequests: (action.json.categoryRequests || 0),
                all: (action.json.all || 0)
            };


        default:
            return state;
    }
};