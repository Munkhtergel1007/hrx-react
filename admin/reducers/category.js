import {
    openCategoryModal,
    closeCategoryModal,
    categoryChangeHandler,
    submitCategory,
    deleteCategory,
    getCategory
} from "../actionTypes";
const initialState = {
    status: 1,
    openModal: false,
    categories:[],
    allCategories:[],
    all:0,
    categoryRequests:0,
    submitCategoryLoader: false,
    category:{},
};

export default(state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};