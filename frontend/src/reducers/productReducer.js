import {
    ALL_PRODUCT_FAIL,
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_SUCCESS,
    CLEAR_ERRORS,
} from "../constants/productConstants";

export const productReducer = ( state = { products : [] }, actions) => {
    switch(actions.type){
        case ALL_PRODUCT_REQUEST:
            return {
                loading: true,
                product : [],
            }

            case ALL_PRODUCT_SUCCESS:
            return {
                loading: true,
                product : actions.payload.products,
                productsCount: actions.payload.productsCount,
            };

            case ALL_PRODUCT_FAIL:
            return {
                loading: false,
                error: actions.payload,
            };

            case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
            default:
                return state;
    }
};