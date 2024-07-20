// src/pages/AdminOrders.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";

interface Order {
  _id: string;
  user: { name: string };
  totalPrice: number;
  status: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editOrderData, setEditOrderData] = useState<Partial<Order>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const handleEditClick = (order: Order) => {
    setEditOrderId(order._id);
    setEditOrderData(order);
  };

  const handleSaveClick = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, editOrderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(
        orders.map((order) =>
          order._id === id ? { ...order, ...editOrderData } : order
        )
      );
      setEditOrderId(null);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditOrderData({ ...editOrderData, [e.target.name]: e.target.value });
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOrders(orders.filter((order) => order._id!== id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Manage Orders
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell>{order._id}</TableCell>
              <TableCell>{order.user.name}</TableCell>
              <TableCell>
                {editOrderId === order._id ? (
                  <TextField
                    name="totalPrice"
                    value={editOrderData.totalPrice}
                    onChange={handleChange}
                  />
                ) : (
                  order.totalPrice
                )}
              </TableCell>
              <TableCell>
                {editOrderId === order._id ? (
                  <TextField
                    name="status"
                    value={editOrderData.status}
                    onChange={handleChange}
                  />
                ) : (
                  order.status
                )}
              </TableCell>
              <TableCell>
                {editOrderId === order._id ? (
                  <Button onClick={() => handleSaveClick(order._id)}>
                    Save
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => handleEditClick(order)}>Edit</Button>
                    <Button onClick={() => handleDeleteClick(order._id)}>
                      Delete
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminOrders;
