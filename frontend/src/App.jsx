import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
} from "@mui/material";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import RequestPasswordResetPage from "./pages/RequestPasswordResetPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Checkout from "./components/Checkout";
import { useSelector, useDispatch } from "react-redux";
import { decodeToken } from "react-jwt";
import { setUser, clearUser } from "./features/user/userSlice";
import { Navigate } from "react-router-dom";
import Cart from "./components/Cart";


import "./App.css";

function App() {
    const { isAuthenticated, dataLoaded } = useSelector((state) => state.user);

  const userLogin = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

 useEffect(() => {
   const token = localStorage.getItem("token");
   if (token && !dataLoaded) {
     const user = decodeToken(token);
     dispatch(setUser(user));
   }
 }, [dispatch, dataLoaded]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    // redirect to home page after logout
    window.location.href = "/";
  };

  const ProtectedRoute = ({ element, ...rest }) => {
    return userLogin && userLogin.isAuthenticated ? (
      element
    ) : (
      <Navigate to="/login" />
    );
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <Router>
      <AppBar position="fixed">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            E-Shop
          </Typography>
          {userLogin && userLogin.isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/orders">
                Orders
              </Button>
              <Button color="inherit" component={Link} to="/cart">
                <Badge badgeContent={totalQuantity} color="secondary">
                  Cart
                </Badge>
              </Button>
              <Button color="inherit" component={Link} to="/user">
                User
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route
            path="/request-password-reset"
            element={<RequestPasswordResetPage />}
          />

          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoute element=<Checkout /> />}
          />

          <Route
            path="/user"
            element={<ProtectedRoute element={<UserPage />} />}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute element={<OrderPage />} />}
          />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
