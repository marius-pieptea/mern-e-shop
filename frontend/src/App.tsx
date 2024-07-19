import React, { useEffect, ReactElement } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
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
import {
  setUser,
  clearUser,
  selectIsAuthenticated,
  selectIsAdmin,
} from "./features/user/userSlice";
import Cart from "./components/Cart";
import { User } from "../src/types";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AdminUsers from "./pages/AdminUsers";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";
import { AppDispatch } from "./store";

interface RootState {
  user: {
    isAuthenticated: boolean;
    dataLoaded: boolean;
    user: User | null;
  };
  cart: {
    cartItems: { quantity: number }[];
  };
}

interface ProtectedRouteProps {
  element: ReactElement;
}

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const dataLoaded = useSelector((state: RootState) => state.user.dataLoaded);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !dataLoaded) {
      const user = decodeToken<User>(token);
      if (user) {
        dispatch(setUser(user));
      }
    }
  }, [dispatch, dataLoaded]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(clearUser());
    window.location.href = "/";
  };

  const ProtectedRoute = ({ element }: ProtectedRouteProps) => {
    return isAuthenticated ? element : <Navigate to="/login" />;
  };

  const AdminRoute = ({ element }: ProtectedRouteProps) => {
    return isAdmin ? element : <Navigate to="/login" />;
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
          {isAuthenticated ? (
            <>
              {!isAdmin && (
                <>
                  <Button color="inherit" component={Link} to="/orders">
                    Orders
                  </Button>
                  <Button color="inherit" component={Link} to="/cart">
                    <Badge badgeContent={totalQuantity} color="secondary">
                      Cart
                    </Badge>
                  </Button>
                </>
              )}
              <Button color="inherit" component={Link} to="/user">
                User
              </Button>
              {isAdmin && (
                <>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin/dashboard"
                  >
                    Admin Dashboard
                  </Button>
                  <Button color="inherit" component={Link} to="/admin/products">
                    Admin Products
                  </Button>
                  <Button color="inherit" component={Link} to="/admin/orders">
                    Admin Orders
                  </Button>
                  <Button color="inherit" component={Link} to="/admin/users">
                    Admin Users
                  </Button>
                </>
              )}
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
            element={<ProtectedRoute element={<Checkout />} />}
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
          <Route
            path="/admin/dashboard"
            element={<AdminRoute element={<AdminDashboard />} />}
          />
          <Route
            path="/admin/products"
            element={<AdminRoute element={<AdminProducts />} />}
          />
          <Route
            path="/admin/orders"
            element={<AdminRoute element={<AdminOrders />} />}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute element={<AdminUsers />} />}
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
