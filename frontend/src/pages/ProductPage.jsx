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
} from "@mui/material";

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const user = useSelector((state) => state.user.user); // Get the authenticated user from the state
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated); // Check if the user is authenticated

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

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      alert("You need to be logged in to add a review.");
      return;
    }

    const review = {
      rating,
      comment,
      user: user._id, // Use the authenticated user's ID
    };

    dispatch(addReview({ productId: id, review }));
  };

  if (!product) {
    return (
      <Container>
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          {product.name}
        </Typography>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={product.image}
            alt={product.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="h6" color="text.primary">
              ${product.price}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Reviews
          </Typography>
          {product.reviews.map((review) => (
            <Box key={review._id} mb={2}>
              <Typography variant="body1">{review.comment}</Typography>
              <Typography variant="body2" color="text.secondary">
                Rating: {review.rating}
              </Typography>
            </Box>
          ))}
          <Box mt={4}>
            <Typography variant="h5" gutterBottom>
              Add a Review
            </Typography>
            <TextField
              label="Rating"
              type="number"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              fullWidth
            />
            <TextField
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddReview}
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
