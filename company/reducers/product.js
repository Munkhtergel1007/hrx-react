import { 
	getAsset, 
	getCategory, 
	getProduct,
	submitProduct,
	submitSubProduct,
	deleteProduct,
	deleteSubProduct,
} from "../actionTypes";
const initialState = {
	loadingAssets: false,
	assets: [],
	loadingCategory: false,
	categories: [],
	loadingProducts: false,
	products: [],
	all: 0,
	submitSubProductLoader: false,
	submitProductLoader: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case getCategory.REQUEST:
			return {
				...state,
				loadingCategory: true
			};
		case getCategory.RESPONSE:
			if ((action.json || {}).success) {
				return {
					...state,
					loadingCategory: false,
					categories: (action.json || {}).categories || []
				};
			} else {
				return {
					...state,
					loadingCategory: false
				};
			}
		case getAsset.REQUEST:
			return {
				...state,
				loadingAssets: true
			};
		case getAsset.RESPONSE:
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
		case getProduct.REQUEST:
            return {
                ...state,
                loadingProducts: true
            };
        case getProduct.RESPONSE:
            return {
                ...state,
                loadingProducts: false,
                products: (action.json.products || []),
                all: (action.json.all || 0)
            };
		case submitProduct.REQUEST:
			return {
				...state,
				submitProductLoader: true,
			};
		case submitProduct.RESPONSE:
			if(action.json.success){
				if(action.json._id){
					return {
						...state,
						submitProductLoader: false,
						products: state.products.map(function (run) {
							if(run._id === action.json._id){
								run.title =  action.json.data.title;
								run.category =  action.json.data.category;
								run.subCategory =  action.json.data.subCategory;
								run.assets =  action.json.data.assets;
							}
							return run;
						}),
					};
				} else {
					return {
						...state,
						submitProductLoader: false,
						all: state.all + 1,
						products:[
							action.json.data,
							...state.products,
						],
					};
				}
			} else {
				return {
					...state,
					submitProductLoader: false
				};
			}
		case deleteProduct.REQUEST:
			if(action.json._id){
				return {
					...state,
					products: state.products.map( function (run) {
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
		case deleteProduct.RESPONSE:
			if(action.json.success){
				return {
					...state,
					// Products: (action.json.Products || []),
					products: state.products.filter(run => run._id.toString() !== action.json._id.toString()),
					all: state.all - 1
				};
			} else {
				if(action.json._id){
					return {
						...state,
						products: state.products.map( function (run) {
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
		case submitSubProduct.REQUEST:
            return {
                ...state,
                submitSubProductLoader: true,
            };
        case submitSubProduct.RESPONSE:
            if(action.json.success){
                if(action.json._id){
					console.log('f')
                    return {
                        ...state,
                        submitSubProductLoader: false,
                        products: (state.products || []).map(function (run) {
                            if(run._id.toString() === (action.json.data.product || {})._id.toString()){
                                (run.child || []).map(function (c){
                                    if(c._id.toString() === action.json._id.toString()){
                                        c.product = action.json.data.product;
                                        c.subAssets = action.json.data.subAssets;
										c.price =  action.json.data.price;
                                    }
                                });
                            }
                            return run;
                        })
                    };
                } else {
                    return {
                        ...state,
                        submitSubProductLoader: false,
                        products: state.products.map(function (run) {
                            if(run._id === action.json.data.product?._id){
                                if(run.child && run.child.length > 0){
                                    // run.child.push(action.json.data);
									run.child = [action.json.data, ...run.child];
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
                    submitSubProductLoader: false
                };
            }
		case deleteSubProduct.REQUEST:
			if(action.json._id){
				return {
					...state,
					products: (state.products || []).map(function (run) {
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
		case deleteSubProduct.RESPONSE:
			if(action.json.success){
				return {
					...state,
					products: state.products.map(function(run) {
						if(run._id === action.json.catId) {
							run.child = (run.child || []).filter(c => c._id !== action.json._id);
						}
						return run;
					})
				};
			} else {
				return {
					...state,
					products: (state.products || []).map(function (run) {
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
		default:
			return state;
	}
};
