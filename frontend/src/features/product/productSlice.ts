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

export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (newProduct: Omit<Product, "_id">) => {
    const response = await axios.post(
      "http://localhost:5000/api/products",
      newProduct,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ id, updates }: { id: string; updates: Partial<Product> }) => {
    const response = await axios.put(
      `http://localhost:5000/api/products/${id}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
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
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.items.push(action.payload);
        }
      )
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.items.findIndex(
            (product) => product._id === action.payload._id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      );
  },
});

export const { clearProducts } = productSlice.actions;

export default productSlice.reducer;
