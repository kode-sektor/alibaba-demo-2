import { orderConstants } from "../actions/constants";

const initState = {
	orders: [],
	error: null
};

export default (state = initState, action) => {
	switch (action.type) {
		case orderConstants.GET_CUSTOMER_ORDER_SUCCESS:
			state = {
				...state,
				orders: action.payload.orders
			};
		break;
		case orderConstants.GET_CUSTOMER_ORDER_FAILURE:
			state = {
				...state,
				error: action.payload.error
			};
		break;
	}
	return state;
};
