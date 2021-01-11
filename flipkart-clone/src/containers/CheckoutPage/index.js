import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addOrder, getAddress, getCartItems } from "../../actions";
import Layout from "../../components/Layout";
import { Anchor, MaterialButton, MaterialInput } from "../../components/MaterialUI";
import PriceDetails from "../../components/PriceDetails";
import Card from "../../components/UI/Card";
import CartPage from "../CartPage";
import AddressForm from "./AddressForm";

import "./style.css";


const CheckoutStep = (props) => {
	return (
		<div className="checkoutStep">
			<div
				onClick={props.onClick}
				className={`checkoutHeader ${props.active && "active"}`}
			>
				<div>
					<span className="stepNumber">{props.stepNumber}</span>
					<span className="stepTitle">{props.title}</span>
				</div>
			</div>
			{props.body && props.body}
		</div>
	);
};

const Address = ({ adr, selectAddress, enableAddressEditForm, confirmDeliveryAddress, onAddressSubmit}) => {

	return (
		<div className="flexRow addressContainer">
			{/* On check of 'Address' radio button, add 'selected : true' pair to the address record
			which enables the 'EDIT' button*/}
			<div>
				<input name="address" onClick={() => selectAddress(adr)} type="radio" />
			</div>
			<div className="flexRow sb addressinfo">
                {/* adr.edit starts out at false because it was inserted on each loop
                    of address fetched from DB on page load i.e. useEffect {} [user.address] 
                    Bear in mind though that if user has not previously saved address details to 
					DB before, this code block will not still run (adr.edit)
				*/}

				{!adr.edit ? (
					<div style={{ width: "100%" }}>
						<div className="addressDetail">
							<div>
								<span className="addressName">{adr.name}</span>
								<span className="addressType">{adr.addressType}</span>
								<span className="addressMobileNumber">{adr.mobileNumber}</span>
							</div>
							{adr.selected && (
								// Note : On check of 'Address' radio button sets 'selected : true' on address 
								// record to show this button (EDIT) which when clicked, sets 'edit : true' pair
								// which essentially hides this current scope (which reveals current address 
								// name, type, number) and even this button, for it to be able to show the Form, 
								// along with the correct prepopulated address details
								<Anchor
									name="EDIT"
                                    onClick={() => 
                                        enableAddressEditForm(adr)}
									style={{ fontWeight: "500", color: "#2874f0" }}
								/>
							)}
						</div>
						<div className="fullAddress">
							{adr.address} <br /> {`${adr.state} - ${adr.pinCode}`}
						</div>
						{/* If the 'Address' radio button is checked,  display
						this 'DELIVERY HERE' button
						
						On the click of this 'DELIVERY HERE' button, update the address 
						and display (the new) address details like name, address, pincode...*/}
						{adr.selected && (
							<MaterialButton
								title="DELIVERY HERE"
								onClick={() => confirmDeliveryAddress(adr)}
								style={{ width: "200px", margin: "10px 0" }}
							/>
						)}
					</div>
				) : (	// If user has saved address details to DB before, display it inside form component
						// But this never shows because 
					<AddressForm
						withoutLayout={true}
						onSubmitForm={onAddressSubmit}
						initialData={adr}
						onCancel={() => {}}
					/>
				)}
			</div>
		</div>
	);
};

// Understanding the code begins here
const CheckoutPage = (props) => {

    const dispatch = useDispatch();

    // Fetch details of auth, user and cart
    const auth = useSelector((state) => state.auth);
	const user = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart);
    
	const [newAddress, setNewAddress] = useState(false);
	const [address, setAddress] = useState([]);
	const [confirmAddress, setConfirmAddress] = useState(false);
	const [selectedAddress, setSelectedAddress] = useState(null);
	const [orderSummary, setOrderSummary] = useState(false);
	const [orderConfirmation, setOrderConfirmation] = useState(false);
	const [paymentOption, setPaymentOption] = useState(false);
	const [confirmOrder, setConfirmOrder] = useState(false);

	// On click of 'SAVE AND DELIVER HERE' button in Address Form
	// (for adding new address), display a few details of the address (confirmAddress)
	// and also hides the Address Form (same confirmAddress) because user is editing,
	// and does not need the form for adding
	const onAddressSubmit = (addr) => {
		setSelectedAddress(addr);
		setConfirmAddress(true);
		setOrderSummary(true);
	};

	/* On check of 'Address' radio button, add 'selected : true' pair to the address record*/
	const selectAddress = (addr) => {
		//console.log(addr);
		const updatedAddress = address.map((adr) =>
			adr._id === addr._id ? { ...adr, selected: true } : { ...adr, selected: false }
		);
		setAddress(updatedAddress);
	};

	// On click of 'Delivery Here' button, add new address to state
	const confirmDeliveryAddress = (addr) => {
		setSelectedAddress(addr);
		setConfirmAddress(true);
		setOrderSummary(true);
	};

	// On click of 'Edit', make edit flag true 
	const enableAddressEditForm = (addr) => {
		const updatedAddress = address.map((adr) =>
			adr._id === addr._id ? { ...adr, edit: true } : { ...adr, edit: false }
		);
		setAddress(updatedAddress);
	};

	const userOrderConfirmation = () => {
		setOrderConfirmation(true);
		setOrderSummary(false);
		setPaymentOption(true);
	};

	// On click of 'CONFIRM ORDER' button
	const onConfirmOrder = () => {
		const totalAmount = Object.keys(cart.cartItems).reduce(
			(totalPrice, key) => {
				const { price, qty } = cart.cartItems[key];
				return totalPrice + price * qty;
			},
			0
		);
		const items = Object.keys(cart.cartItems).map((key) => ({
			productId: key,
			payablePrice: cart.cartItems[key].price,
			purchasedQty: cart.cartItems[key].qty,
		}));
		const payload = {
			addressId: selectedAddress._id,
			totalAmount,
			items,
			paymentStatus: "pending",
			paymentType: "cod",
		};

		console.log(payload);
		dispatch(addOrder(payload));
		setConfirmOrder(true);	// Prepare to send to order_details page
	};

    // On login / logout, get cart Items and get Address and Cart items
	useEffect(() => {
		auth.authenticate && dispatch(getAddress());
		auth.authenticate && dispatch(getCartItems());
	}, [auth.authenticate]);

    // On load (because user.address will be populated from DB on load when dispatch(getAddress()))
    // Any other manipulation of the user.address in reducer will trigger this block of code

	// Add 'selected: false' and 'edit: false' for each address field
	// Multiple because you have the option of having more than 1 address
	useEffect(() => {
		const address = user.address.map((adr) => ({
			...adr,
			selected: false,
			edit: false,
		}));
		setAddress(address);
		//user.address.length === 0 && setNewAddress(true);
	}, [user.address]);

    // If order placed is successful, advance to Order Details page
	useEffect(() => {
		if (confirmOrder && user.placedOrderId) {
			props.history.push(`/order_details/${user.placedOrderId}`);
		}
    }, [user.placedOrderId]);
    
    console.log(address)

	return (
		<Layout>
			<div className="cartContainer" style={{ alignItems: "flex-start", display: "flex" }}>
				<div className="checkoutContainer">
					{/* check if user logged in or not */}

                    {/*No 1 tab : Display name and email*/}
					<CheckoutStep
						stepNumber={"1"}
						title={"LOGIN"}
						active={!auth.authenticate}
						body={
                            // If authenticated display name and email otherwise display Email input
							auth.authenticate ? (
								<div className="loggedInId">
									<span style={{ fontWeight: 500 }}>{auth.user.fullName}</span>
									<span style={{ margin: "0 5px" }}>{auth.user.email}</span>
								</div>
							) : (
								<div>
									<MaterialInput label="Email" />
								</div>
							)
						}
					/>

                    {/*No 2 tab : Delivery Address*/}
					<CheckoutStep
						stepNumber={"2"}
						title={"DELIVERY ADDRESS"}
						active={!confirmAddress && auth.authenticate}
						body={
							<>
								{	// If user clicks 'Delivery Here' button which indicates the confirmation of 
									// his address / As well as click of 'SAVE AND DELIVER HERE' (Main form button), 
									// display a few  details of the address. Recall the address is what is fetched from DB
									
								confirmAddress ? (
									<div className="stepCompleted">
                                        {`${selectedAddress.name} ${selectedAddress.address} - ${selectedAddress.pinCode} `}
                                        WE HERE
                                    </div>
								) : (
                                    // If user has saved address details to DB before, display it inside form
                                    (address.length > 0) && (
                                        address.map((adr) => (
                                            <Address
                                                selectAddress={selectAddress}
                                                enableAddressEditForm={enableAddressEditForm}
                                                confirmDeliveryAddress={confirmDeliveryAddress}
                                                onAddressSubmit={onAddressSubmit}
                                                adr={adr}   // address details from DB
                                            />
                                        ))
                                    )
								)}
							</>
						}
					/>

					{/* ADDRESS FORM
						If user clicks 'Delivery Here' button which indicates the confirmation of 
						his address, / As well as click of 'SAVE AND DELIVER HERE', then show nothing. 

						Otherwise ('Delivery Here' button not clicked), show an "ADD NEW ADDRESS"
						button which when clicked hides itself, (then makes newAddress true)
						responsible for showing the complete Address Form
						and then shows a new exactly identical button (don't get confused)
					*/}
					{confirmAddress ? null : newAddress ? (
						<AddressForm onSubmitForm={onAddressSubmit} onCancel={() => {}} />
					) : auth.authenticate ? (
						<CheckoutStep
							stepNumber={"+"}
							title={"ADD NEW ADDRESS"}
							active={false}
							onClick={() => setNewAddress(true)}
						/>
					) : null}

					<CheckoutStep
						stepNumber={"3"}
						title={"ORDER SUMMARY"}
						active={orderSummary}
						body={
							// On click of 'DELIVERY HERE' button (for edit purposes), 'SAVE AND DELIVER HERE'
							// button for (adding new address purposes) display the cart in a concise format 
							// (onlyCartItems={true})

							// On the click of "CONTINUE" button (down below), display the no of cart items

							// Otherwise display nothing
							orderSummary ? (
								<CartPage onlyCartItems={true} />
							) : orderConfirmation ? (
								<div className="stepCompleted">
									{Object.keys(cart.cartItems).length} items
								</div>
							) : null
						}
					/>

					{/* // On click of 'Delivery Here' button (for edit purposes), 'SAVE AND DELIVER HERE'
					// button for  (adding new address purposes) display "CONTINUE" button */}
					{orderSummary && (
						<Card style={{ margin: "10px 0" }}>
							<div
								className="flexRow sb"
								style={{ padding: "20px", alignItems: "center" }}
							>
								<p style={{ fontSize: "12px" }}>
									Order confirmation email will be sent to{" "}
									<strong>{auth.user.email}</strong>
								</p>
								<MaterialButton
									title="CONTINUE"
									onClick={userOrderConfirmation}
									style={{ width: "200px" }}
								/>
							</div>
						</Card>
					)}

					<CheckoutStep
						stepNumber={"4"}
						title={"PAYMENT OPTIONS"}
						active={paymentOption}
						body={
							paymentOption && (
								<div>
									<div
										className="flexRow"
										style={{ alignItems: "center", padding: "20px" }}
									>
										<input type="radio" name="paymentOption" value="cod" />
										<div>Cash on delivery</div>
									</div>
									<MaterialButton
										title="CONFIRM ORDER"
										onClick={onConfirmOrder}
										style={{ width: "200px", margin: "0 0 20px 20px" }}
									/>
								</div>
							)
						}
					/>
				</div>

				{/* Price Component */}
				<PriceDetails
					totalItem={Object.keys(cart.cartItems).reduce(function (qty, key) {
						return qty + cart.cartItems[key].qty;
					}, 0)}
					totalPrice={Object.keys(cart.cartItems).reduce((totalPrice, key) => {
						const { price, qty } = cart.cartItems[key];
						return totalPrice + price * qty;
					}, 0)}
				/>
			</div>
		</Layout>
	);
};

export default CheckoutPage;
