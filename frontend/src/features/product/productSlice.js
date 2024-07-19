import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (filters) => {
    const { data } = await axios.get("http://localhost:5000/api/products", {
      params: filters,
    });
    return data;
  }
);

export const addReview = createAsyncThunk(
  "product/addReview",
  async ({ productId, review }) => {
    const { data } = await axios.post(
      `http://localhost:5000/api/products/${productId}/reviews`,
      review
    );
    return data;
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearProducts } = productSlice.actions;

export default productSlice.reducer;
