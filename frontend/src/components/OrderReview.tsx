// src/components/OrderReview.tsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentStep,
  resetCheckout,
} from "../features/checkout/checkoutSlice";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../features/cart/cartSlice";
import { RootState } from "../store";
import { CartItem } from "../types";

const OrderReview: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo, paymentInfo } = useSelector(
    (state: RootState) => state.checkout
  );
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const handlePlaceOrder = async () => {
    const orderItems = cartItems.map((item: CartItem) => ({
      name: item.name,
      qty: item.quantity,
      price: item.price,
      product: item._id,
    }));
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/orders",
        { orderItems, totalPrice },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Payment successful! Order placed.");
      dispatch(resetCheckout());
      dispatch(setCurrentStep(0));
      dispatch(clearCart());
      navigate("/orders"); // Redirect to OrderPage
    } catch (error) {
      console.error("Error placing order", error);
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Order Review
        </Typography>
        <Typography variant="h6">Shipping Information</Typography>
        <Typography>Address: {shippingInfo.address}</Typography>
        <Typography>City: {shippingInfo.city}</Typography>
        <Typography>Postal Code: {shippingInfo.postalCode}</Typography>
        <Typography>Country: {shippingInfo.country}</Typography>
        <Typography variant="h6">Payment Information</Typography>
        <Typography>Card Number: {paymentInfo.cardNumber}</Typography>
        <Typography>Expiry Date: {paymentInfo.expiryDate}</Typography>
        <Typography>CVV: {paymentInfo.cvv}</Typography>
        <Typography variant="h6">Order Items</Typography>
        {cartItems.map((item: CartItem) => (
          <Typography key={item._id}>
            {item.name} - {item.quantity} x ${item.price}
          </Typography>
        ))}
        <Button variant="contained" color="primary" onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </Box>
    </Container>
  );
};

export default OrderReview;
