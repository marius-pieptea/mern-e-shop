import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  shippingInfo: {},
  paymentInfo: {},
  orderReview: {},
  currentStep: 0,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
    },
    setPaymentInfo: (state, action) => {
      state.paymentInfo = action.payload;
    },
    setOrderReview: (state, action) => {
      state.orderReview = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetCheckout: (state) => {
      state.shippingInfo = {};
      state.paymentInfo = {};
      state.orderReview = {};
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