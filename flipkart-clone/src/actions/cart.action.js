import axios from "../helpers/axios";
import { cartConstants } from "./constants";
import store from "../store";

const getCartItems = () => {
	return async (dispatch) => {
		try {
			dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
			const res = await axios.post(`/user/getCartItems`);
			if (res.status === 200) {
				const { cartItems } = res.data;
				console.log({ getCartItems: cartItems });
				if (cartItems) {
					dispatch({
						type: cartConstants.ADD_TO_CART_SUCCESS,
						payload: { cartItems },
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	};
};

// On click of '+'
export const addToCart = (product, newQty = 1) => {
	return async (dispatch) => {

		// Fetch whole cartItems and login state from store
		const {	cart: { cartItems }, auth } = store.getState();

		//console.log('action::products', products);
		//const product = action.payload.product;
		//const products = state.products;

		console.log(cartItems)

		// If the cart already exists in the cart items, then add 1 to the existing quantity
		// otherwise, make the new quantity 1
		const qty = cartItems[product._id]
			? parseInt(cartItems[product._id].qty + newQty)
			: 1;
		
		// Now overwrite the cart with the qty and infuse in cartItems
		cartItems[product._id] = { ...product, qty };

		if (auth.authenticate) {	// Logged in?
			dispatch({ type: cartConstants.ADD_TO_CART_REQUEST });
			const payload = {
				// cartItems: Object.keys(cartItems).map((key, index) => {
				//     return {
				//         quantity: cartItems[key].qty,
				//         product: cartItems[key]._id
				//     }
				// })
				cartItems: [
					{
						product: product._id,
						quantity: qty
					}
				]
			};
			console.log(payload);

			const res = await axios.post(`/user/cart/addtocart`, payload);
			console.log(res);
			if (res.status === 201) {
				dispatch(getCartItems());
			}
		} else {
			// Temporary storage of cart products to prevent data loss loading new page
			localStorage.setItem("cart", JSON.stringify(cartItems));
		}

		console.log("addToCart::", cartItems);

		dispatch({
			type: cartConstants.ADD_TO_CART_SUCCESS,
			payload: { cartItems },
		});
	};
};

export const removeCartItem = (payload) => {
	return async (dispatch) => {
		try {
			dispatch({ type: cartConstants.REMOVE_CART_ITEM_REQUEST });
			const res = await axios.post(`/user/cart/removeItem`, { payload });
			if (res.status === 202) {
				dispatch({ type: cartConstants.REMOVE_CART_ITEM_SUCCESS });
				dispatch(getCartItems());
			} else {
				const { error } = res.data;
				dispatch({
					type: cartConstants.REMOVE_CART_ITEM_FAILURE,
					payload: { error },
				});
			}
		} catch (error) {
			console.log(error);
		}
	};
};

export const updateCart = () => {
	return async (dispatch) => {
		const { auth } = store.getState();
		let cartItems = localStorage.getItem("cart")
			? JSON.parse(localStorage.getItem("cart"))
			: null;

		console.log("upppppppppp");

		if (auth.authenticate) {
			localStorage.removeItem("cart");
			//dispatch(getCartItems());
			if (cartItems) {
				const payload = {
					cartItems: Object.keys(cartItems).map((key, index) => {
						return {
							quantity: cartItems[key].qty,
							product: cartItems[key]._id,
						};
					}),
				};
				if (Object.keys(cartItems).length > 0) {
					const res = await axios.post(`/user/cart/addtocart`, payload);
					if (res.status === 201) {
						dispatch(getCartItems());
					}
				}
			} else {
				dispatch(getCartItems());
			}
		} else {
			if (cartItems) {
				dispatch({
					type: cartConstants.ADD_TO_CART_SUCCESS,
					payload: { cartItems },
				});
			}
		}
	};
};

export { getCartItems };
