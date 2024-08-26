import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { addReview } from "../features/product/productSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Box,
  TextField,
  CircularProgress,
  Grid,
  Divider,
  Rating,
} from "@mui/material";
import { AppDispatch, RootState } from "../store";
import { Product, Review } from "../types";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const ProductPage: React.FC = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user.user);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      ...product,
      quantity: 1, // Default quantity to 1 when adding to cart
    };
    dispatch(addToCart(cartItem));
  };

 const handleAddReview = async () => {
   if (!isAuthenticated || !user) {
     alert("You need to be logged in to add a review.");
     return;
   }

   const review: Review = {
     rating,
     comment,
     user: {
       _id: user._id,
       name: user.name,
     },
     _id: "",
   };

   try {
     const updatedProduct = await dispatch(
       addReview({ productId: id!, review })
     ).unwrap();

     const newReview = {
       ...review,
       _id: updatedProduct.reviews[updatedProduct.reviews.length - 1]._id,
     };

     setProduct({
       ...updatedProduct,
       reviews: [...updatedProduct.reviews.slice(0, -1), newReview],
     });
     setRating(0);
     setComment("");
   } catch (error) {
     console.error("Failed to add review:", error);
     alert("Failed to add review. Please try again.");
   }
 };

  if (!product) {
    return (
      <Container>
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card elevation={0}>
              <CardMedia
                component="img"
                height="400"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "contain" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<AddShoppingCartIcon />}
              onClick={() => handleAddToCart(product)}
              fullWidth
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>

        <Box mt={6}>
          <Typography variant="h5" gutterBottom>
            Customer Reviews
          </Typography>
          <Divider />
          {product.reviews.map((review) => (
            <Box key={review._id} my={2}>
              <Rating value={review.rating} readOnly size="small" />
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="body2" color="text.secondary">
                By {review.user?.name || "Anonymous"}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Write a Review
          </Typography>
          <Divider />
          <Box mt={2}>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 0)}
            />
            <TextField
              label="Your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddReview}
              disabled={!isAuthenticated}
            >
              Submit Review
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductPage;
