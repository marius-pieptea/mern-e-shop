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
import { AppDispatch, RootState } from "../store";
import { Product, Review } from "../types";

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

  const handleAddReview = () => {
    console.log("handleAddReview called");
    if (!isAuthenticated) {
      alert("You need to be logged in to add a review.");
      return;
    }

    if (!user) {
      alert("User information is missing.");
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

    dispatch(addReview({ productId: id!, review }));
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
              {review.user && (
                <Typography variant="body2" color="text.secondary">
                  Written by: {review.user.name}{" "}
                </Typography>
              )}
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
              onChange={(e) => setRating(Number(e.target.value))}
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
