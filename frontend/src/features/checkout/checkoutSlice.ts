import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ShippingInfo, PaymentInfo, OrderReview } from "../../types";

interface CheckoutState {
  shippingInfo: ShippingInfo;
  paymentInfo: PaymentInfo;
  orderReview: OrderReview;
  currentStep: number;
}

const initialState: CheckoutState = {
  shippingInfo: {
    address: "",
    city: "",
    postalCode: "",
    country: "",
  },
  paymentInfo: {
    method: "",
  },
  orderReview: {
    items: [],
    total: 0,
  },
  currentStep: 0,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
    setPaymentInfo: (state, action: PayloadAction<PaymentInfo>) => {
      state.paymentInfo = action.payload;
    },
    setOrderReview: (state, action: PayloadAction<OrderReview>) => {
      state.orderReview = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    resetCheckout: (state) => {
      state.shippingInfo = {
        address: "",
        city: "",
        postalCode: "",
        country: "",
      };
      state.paymentInfo = {
        method: "",
      };
      state.orderReview = {
        items: [],
        total: 0,
      };
      state.currentStep = 0;
    },
  },
});

export const {
  setShippingInfo,
  setPaymentInfo,
  setOrderReview,
  setCurrentStep,
  resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
