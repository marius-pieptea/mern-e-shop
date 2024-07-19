import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../features/order/orderSlice";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
} from "@mui/material";
import { RootState } from "../store";
import { Order } from "../types";
import { useNavigate } from "react-router-dom";

const OrderPage: React.FC = () => {
  const orders = useSelector((state: RootState) => state.order.orders);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  }, [dispatch, navigate]);

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Order Page
        </Typography>
        <Paper elevation={3}>
          <List>
            {orders.map((order: Order) => (
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
