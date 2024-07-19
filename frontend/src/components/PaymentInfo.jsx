// src/components/PaymentInfo.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setPaymentInfo,
  setCurrentStep,
} from "../features/checkout/checkoutSlice";
import { Container, TextField, Button, Box } from "@mui/material";

const PaymentInfo = () => {
  const [paymentInfo, setPaymentInfoState] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setPaymentInfoState({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(setPaymentInfo(paymentInfo));
    dispatch(setCurrentStep(2));
  };

  return (
    <Container>
      <Box mt={4}>
        <TextField
          label="Card Number"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Expiry Date"
          name="expiryDate"
          value={paymentInfo.expiryDate}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CVV"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Next
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentInfo;
