import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../types";

interface OrderState {
  orders: Order[];
}

const initialState: OrderState = {
  orders: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { setOrders, clearOrders } = orderSlice.actions;

export default orderSlice.reducer;
