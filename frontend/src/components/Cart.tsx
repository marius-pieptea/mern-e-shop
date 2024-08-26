
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../features/cart/cartSlice";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RootState } from "../store";
import { CartItem } from "../types";

const Cart: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemove = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleQuantityChange = (itemId: string, quantity: string) => {
    dispatch(updateQuantity({ itemId, quantity: parseInt(quantity, 10) }));
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <Grid container spacing={4}>
          {cartItems &&
            cartItems.map((item: CartItem) => (
              <Grid item key={item._id} xs={12}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                      ${item.price}
                    </Typography>
                    <TextField
                      type="number"
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item._id, e.target.value)
                      }
                      inputProps={{ min: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
        {cartItems.length > 0 && (
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Cart;
