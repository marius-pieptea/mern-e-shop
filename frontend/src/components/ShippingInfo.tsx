import React, { useState, ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  setShippingInfo as setShippingInfoAction,
  setCurrentStep,
} from "../features/checkout/checkoutSlice";
import { Container, TextField, Button, Box } from "@mui/material";

const ShippingInfo: React.FC = () => {
  const [shippingInfo, setShippingInfoState] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShippingInfoState({
      ...shippingInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(setShippingInfoAction(shippingInfo));
    dispatch(setCurrentStep(1));
  };

  return (
    <Container>
      <Box mt={4}>
        <TextField
          label="Address"
          name="address"
          value={shippingInfo.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          name="city"
          value={shippingInfo.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Postal Code"
          name="postalCode"
          value={shippingInfo.postalCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Country"
          name="country"
          value={shippingInfo.country}
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

export default ShippingInfo;
