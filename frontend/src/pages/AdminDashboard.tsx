// src/pages/AdminDashboard.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const AdminDashboard: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Button
        component={Link}
        to="/admin/products"
        variant="contained"
        color="primary"
      >
        Manage Products
      </Button>
      <Button
        component={Link}
        to="/admin/orders"
        variant="contained"
        color="primary"
      >
        Manage Orders
      </Button>
      <Button
        component={Link}
        to="/admin/users"
        variant="contained"
        color="primary"
      >
        Manage Users
      </Button>
    </Container>
  );
};

export default AdminDashboard;
