import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Product, Review } from "../../types";

interface ProductState {
  items: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (filters: Record<string, any>) => {
    const { data } = await axios.get("http://localhost:5000/api/products", {
      params: filters,
    });
    return data;
  }
);

export const addReview = createAsyncThunk(
  "product/addReview",
  async ({ productId, review }: { productId: string; review: Review }) => {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `http://localhost:5000/api/products/${productId}/reviews`,
      review,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }
);


// export const addReview = createAsyncThunk(
//   "product/addReview",
//   async ({ productId, review }: { productId: string; review: Review }) => {
//     const { data } = await axios.post(
//       `http://localhost:5000/api/products/${productId}/reviews`,
//       review
//     );
//     return data;
//   }
// );

export const productSlice = createSlice({
  name: "product",
  initialState,
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
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.status = "succeeded";
          state.items = action.payload;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(addReview.fulfilled, (state, action: PayloadAction<Product>) => {
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
