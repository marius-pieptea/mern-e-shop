import React, { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  setPaymentInfo as setPaymentInfoAction,
  setCurrentStep,
} from "../features/checkout/checkoutSlice";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
} from "@mui/material";

const PaymentInfo: React.FC = () => {
  const [paymentInfo, setPaymentInfoState] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    method: "creditCard", // Default method
  });
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfoState({
      ...paymentInfo,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setPaymentInfoState({
      ...paymentInfo,
      [name as string]: value,
    });
  };

  const handleSubmit = () => {
    dispatch(setPaymentInfoAction(paymentInfo));
    dispatch(setCurrentStep(2));
  };

  return (
    <Container>
      <Box mt={4}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="method"
            value={paymentInfo.method}
            onChange={handleSelectChange}
          >
            <MenuItem value="creditCard">Credit Card</MenuItem>
            <MenuItem value="debitCard">Debit Card</MenuItem>
            <MenuItem value="paypal">PayPal</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Card Number"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Expiry Date"
          name="expiryDate"
          value={paymentInfo.expiryDate}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="CVV"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={handleInputChange}
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
