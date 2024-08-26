import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/product/productSlice";
import { addToCart } from "../features/cart/cartSlice";
import { Link } from "react-router-dom";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Container,
  Box,
  TextField,
  MenuItem,
  CardActions,
} from "@mui/material";
import _ from "lodash";
import { AppDispatch, RootState } from "../store";
import { Product } from "../types";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.items);
  const error = useSelector((state: RootState) => state.product.error);
   const navigate = useNavigate();
   const isAuthenticated = useSelector(
     (state: RootState) => state.user.isAuthenticated
   );
  const user = useSelector((state: RootState) => state.user.user);


  useEffect(() => {
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const filteredProducts = _.filter(products, (product: Product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category ? product.category === category : true;
    const matchesMinPrice = minPrice ? product.price >= Number(minPrice) : true;
    const matchesMaxPrice = maxPrice ? product.price <= Number(maxPrice) : true;
    return (
      matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
    );
  });

   const handleAddToCart = (product: Product) => {
     if (!isAuthenticated) {
       navigate("/login");
     } else if (user && user.isAdmin) {
       alert(
         "Only normal users can order. Please login to your normal user account."
       );
     } else {
       const cartItem = { ...product, quantity: 1 };
       dispatch(addToCart(cartItem));
     }
   };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <Box
          position="sticky"
          top={0}
          zIndex={1}
          bgcolor="background.paper"
          p={2}
          mb={2}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                select
                fullWidth
                variant="outlined"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Category1">Laptops</MenuItem>
                <MenuItem value="Category2">Phones</MenuItem>
                <MenuItem value="Category3">Desktops</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                fullWidth
                variant="outlined"
                type="number"
              />
            </Grid>
          </Grid>
        </Box>
        {error && (
          <Typography variant="body1" color="error" mb={2}>
            {error}
          </Typography>
        )}
        <Grid container spacing={4}>
          {filteredProducts.map((product: Product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    <Link
                      to={`/product/${product._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {product.name}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" mt={1}>
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default HomePage;
