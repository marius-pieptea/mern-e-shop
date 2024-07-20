import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { addProduct, updateProduct } from "../features/product/productSlice";
import { Product } from "../types";
import { v4 as uuidv4 } from "uuid";

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "_id">>({
    name: "",
    price: 0,
    description: "",
    image: "",
    category: "",
    reviews: [],
  });
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProduct({ ...editedProduct, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!newProduct.name) errors.name = "Product name is required";
    if (newProduct.price <= 0)
      errors.price = "Product price must be greater than 0";
    if (!newProduct.description)
      errors.description = "Product description is required";
    if (!newProduct.image) errors.image = "Product image URL is required";
    if (!newProduct.category) errors.category = "Product category is required";
    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const productWithId = { ...newProduct, _id: uuidv4() };
      await dispatch(addProduct(productWithId));
      setOpen(false);
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditProductId(product._id);
    setEditedProduct(product);
  };

  const handleSaveClick = async () => {
    if (editProductId) {
      try {
        await dispatch(
          updateProduct({ id: editProductId, updates: editedProduct })
        ).unwrap();
        setProducts(
          products.map((product) =>
            product._id === editProductId
              ? { ...product, ...editedProduct }
              : product
          )
        );
        setEditProductId(null);
        setEditedProduct({});
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      console.error("editProductId is null");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Products
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add Product
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            value={newProduct.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
          />
          <TextField
            margin="dense"
            name="price"
            label="Product Price"
            type="number"
            fullWidth
            value={newProduct.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
          />
          <TextField
            margin="dense"
            name="description"
            label="Product Description"
            type="text"
            fullWidth
            value={newProduct.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <TextField
            margin="dense"
            name="image"
            label="Product Image URL"
            type="text"
            fullWidth
            value={newProduct.image}
            onChange={handleChange}
            error={!!errors.image}
            helperText={errors.image}
          />
          <TextField
            margin="dense"
            name="category"
            label="Product Category"
            type="text"
            fullWidth
            value={newProduct.category}
            onChange={handleChange}
            error={!!errors.category}
            helperText={errors.category}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell>
                {editProductId === product._id ? (
                  <TextField
                    name="name"
                    value={editedProduct.name || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  product.name
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <TextField
                    name="price"
                    value={editedProduct.price || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  product.price
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <TextField
                    name="description"
                    value={editedProduct.description || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  product.description
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <TextField
                    name="image"
                    value={editedProduct.image || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  product.image
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <TextField
                    name="category"
                    value={editedProduct.category || ""}
                    onChange={handleEditChange}
                  />
                ) : (
                  product.category
                )}
              </TableCell>
              <TableCell>
                {editProductId === product._id ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveClick}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => deleteProduct(product._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminProducts;
