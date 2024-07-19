// src/pages/OrderPage.jsx
import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setOrders, clearOrders } from "../features/order/orderSlice";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
} from "@mui/material";

const OrderPage = () => {
  const orders = useSelector((state) => state.order.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
          const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setOrders(response.data));
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, [dispatch]);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Order Page
        </Typography>
        <Paper elevation={3}>
          <List>
            {orders.map((order) => (
              <ListItem key={order._id}>
                <ListItemText
                  primary={`Order ID: ${order._id}`}
                  secondary={`Total Price: $${order.totalPrice}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default OrderPage;
